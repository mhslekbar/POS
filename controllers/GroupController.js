const UserModel = require("../models/UserModel")
const Group = require("../models/GroupModel")

const getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate("permissions").sort({createdAt: -1})
        res.status(200).json({success:groups})
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const getGroupsByTable = async (req, res) => {
    try {
        const groups = await Group.aggregate([
            { $unwind: "$permissions" },
            { $lookup: {
                from: "permissions",
                localField: "permissions", // because localField is just an array.
                foreignField: "_id",
                as: "table"
            } },
            {$unwind: "$table"},
            {
                $project: {
                    _id: 1,
                    tableName: "$table.collectionName",
                    role: "$table.permissionName"
                }
            },
            { $group: {
                _id: "$tableName",
            } }
        ])
        // const groups = await Group.find().group({permissionName}).sort({createdAt: -1})
        res.status(200).json({success:groups})
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err)
    }
}

const insertGroup = async (req, res) => {
    try {
        const formErrors = [];
        const { groupName, permissions } = req.body 
        const groupData = await Group.find({groupName})
        
        if(groupData.length > 0) {
            formErrors.push("Le nom existe deja");
        }
        if(groupName.length === 0) {
            formErrors.push("Le nom du role est obligatoire");
        }
        if(permissions?.length === 0) {
            formErrors.push("Donner au moins un permission");
        }
        if(formErrors.length === 0) {
            await Group.create({groupName, permissions});
            await getGroups(req, res)
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        console.log(err.message)
        res.status(500).json({err});
    }
} 

const updateGroup = async (req, res) => {
    try {
        const {id} = req.params;
        let { groupName, permissions } = req.body;
        const group = await Group.find({ _id: {$ne: id}, groupName });

        const formErrors = [];

        if(group.length > 0) {
            formErrors.push("Le nom existe deja");
        }

        if(groupName?.length === 0) {
            groupName = group.groupName;
        }
        if(groupName?.length < 2) {
            formErrors.push("Le nom du role doit etre superieur a 3 caracteres")
        }

        if(formErrors.length === 0) {
            await Group.updateOne({_id: id}, {$set: { groupName, permissions }}, {new: true});
            await getGroups(req, res)
            // res.status(200).json({success: updatedGroup});
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({err});
    }
}

const deleteGroup = async (req, res) => {
    try {
        const {id} = req.params;         

        const users = await UserModel.find();
        users.map(async user => {
            const newGroup = user.groups.filter(group => !group.equals(id))
            await UserModel.updateOne({_id: user._id}, { $set: { groups: newGroup } } , {new: true});
        })
        await Group.findByIdAndDelete(id);
        await getGroups(req, res)
        // res.status(200).json({success: deletedGroup});
    } catch(err) {
        console.log(err)
        res.status(500).json({err});
    }
}

module.exports = { getGroups, getGroupsByTable, insertGroup, updateGroup, deleteGroup };
