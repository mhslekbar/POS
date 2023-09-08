const mongooose = require("mongoose");

const permissionSchema = new mongooose.Schema({
    permissionName: {
        type: String,
        required: true
    },
    collectionName: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongooose.model("permission", permissionSchema);
