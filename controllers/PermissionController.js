const PermissionModel = require("../models/PermissionModel");
const UserModel = require("../models/UserModel")

const getPermissions = async (req, res) => {
    try {
        const { userId } = req.query  
        let permission
        if(userId) {
            const userData = await UserModel.findOne({_id: userId}).populate({
                path: "groups",
                populate: {
                    path: "permissions"
                }
            })
            let allowedPermission = []
            for(let grp of userData.groups) {
                allowedPermission.push(grp.permissions)
            }
            permission = allowedPermission[0]
        } else {
            permission = await PermissionModel.find().sort({createdAt: -1})
        }
        
        res.status(200).json({success: permission});
    } catch (err) {
        console.log(err)
        res.status(500).json({err})
    }
}

const getPermissionsByTable = async (req, res) => {
    try {
        const permission = await PermissionModel.aggregate([
            { 
                $project: {
                    createdAt: 1, 
                    collectionName: 1
                }
            },
            {$group: {
                _id: "$collectionName",  
                data: { $push: "$$ROOT" }              
            }},
            {$sort: {"data.createdAt": -1}},
        ]);
        res.status(200).json({success: permission});
    } catch (err) {
        console.log(err)
        res.status(500).json({err})
    }
}

const insertPermission = async (req, res) => {
    try {
        const formErrors = [];
        const { permissionName, collectionName } = req.body 

        const PermissionData = await PermissionModel.findOne({ permissionName: permissionName });

        if(PermissionData) {
            formErrors.push("Le nom du Permission deja existe");
        }
        if(permissionName.length === 0) {
            formErrors.push("Le nom du Permission est obligatoire");
        }
        if(collectionName.length === 0) {
            formErrors.push("Le choix du nom de la collection est obligatoire");
        }
        if(formErrors.length === 0) {
            const newPermission = new PermissionModel(req.body);
            const savedPermission = await newPermission.save()
            res.status(200).json(savedPermission);
        } else {
            res.status(300).json(formErrors);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updatePermission = async (req, res) => {
    try {
        const {id} = req.params;
        const { permissionName, collectionName } = req.body 
        const formErrors = [];
        const PermissionData = await PermissionModel.findOne({ _id: id, permissionName: permissionName });

        if(PermissionData) {
            formErrors.push("Le nom du Permission deja existe");
        }
        if(permissionName.length === 0) {
            permissionName = PermissionData.permissionName
        }
        if(collectionName.length === 0) {
            collectionName = PermissionData.collectionName
        }
        if(formErrors.length === 0) {
            const updatedPermission = await PermissionModel.updateOne({_id: id}, {$set: req.body}, {new: true});
            res.status(200).json(updatedPermission);
        } else {
            res.status(300).json(formErrors);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deletePermission = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedPermission = await PermissionModel.deleteOne({_id: id});
        res.status(200).json(deletedPermission);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = { getPermissions, getPermissionsByTable, insertPermission, updatePermission, deletePermission };
