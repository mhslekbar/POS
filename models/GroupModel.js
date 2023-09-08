const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "permission",
            required: true
        }
    ]
},
{ timestamps: true });

module.exports = mongoose.model("group", GroupSchema);
