const UserModel = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const { io } = require("../socketIO");

const getUsers = async (req, res) => {
    try {
        // io.on("connection", socket => {
        //     socket.emit("showUser", users)
        // })
        const users = await UserModel.find({}, {password: 0}).sort({createdAt: -1}).populate("groups");
        res.status(200).json({success: users});
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const insertUser = async (req, res) => {
    try {
        const formErrors = [];
        let { username, phone, password, groups} = req.body;
        const userData = await UserModel.find({username});

        if(userData.length > 0) {
            formErrors.push("Nom d'utilisateur existe deja");
        }
        if(!username || username.length === 0) {
            formErrors.push("Username Can't be empty");
        }
        if(!password || password.length === 0) {
            formErrors.push("Password Can't be empty");
        } else {
            let checkPass = CryptoJS.enc.Utf8.parse(password);
            password = CryptoJS.AES.encrypt(
                checkPass,
                process.env.PASS_SEC
            ).toString()
        }
        if(!phone || phone.length === 0) {
            formErrors.push("Phone Can't be empty");
        }
        if(!groups || groups.length === 0) {
            formErrors.push("Choisir au moins un groupe");
        }
        if(formErrors.length === 0) {
            await UserModel.create({username, password, phone, groups});
            await getUsers(req, res)
        } else {
            res.status(300).json({formErrors})
        }
    } catch(err) {
        console.log(err.message);
        res.status(500).json(err.message)
    }
}

const updateUser = async (req, res) => { 
    let {id} = req.params
    let { username, phone, groups } = req.body
    const userData = await UserModel.find({username});
    try {
        const formErrors = [];
        if(userData.find(user => !user._id.equals(id))) {
            formErrors.push("Nom d'utilisateur existe deja");
        }
        if(!username || username.length === 0) {
            username = userData.username
        }
        if(username.length > 10) {
            formErrors.push("username can't be more than 10 chars")
        }
        if(!phone || phone.length === 0) {
            phone = userData.phone
        }
        if(!groups || groups.length === 0) {
            groups = userData.groups
        }
        if(formErrors.length === 0) {
            await UserModel.updateOne({_id: id}, {$set : { username, phone, groups }});
            await getUsers(req, res)
        } else {
            res.status(300).json({formErrors})
        }
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const deleteUser = async (req, res) => { 
    let {id} = req.params;

    try {
        const formErrors = [];
        // START CHECK IF USER IS INSIDE OTHERS DOCUMENTS ?
        
        // END CHECK IF USER IS INSIDE OTHERS DOCUMENTS ?
        if(formErrors.length === 0) {
            await UserModel.findByIdAndDelete(id);
            await getUsers(req, res)
        } else {
            res.status(300).json({"formErrors": formErrors})
        }
    } catch(err) {
        res.status(500).json(err.message)
    }

}

module.exports = { getUsers , insertUser, updateUser, deleteUser };
