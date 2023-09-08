const UserModel = require("../models/UserModel");

const authorizedPermission = (permission) => {
  return async (req, res, next) => {
    const { id } = req.user;

    const users = await UserModel.findById(id).populate("groups");
    let hasPermission = false;

    for (const group of users.groups || []) {
      const populatedGroup = await group.populate("permissions");
      if (
        populatedGroup.permissions.find((p) => p.permissionName === permission)
      ) {
        hasPermission = true;
        break;
      }
    }
    if (hasPermission) {
      return next();
    } else {
      return res
        .status(300)
        .json(`You are not allowed to : ${permission.toLowerCase()}`);
    }
  };
};

module.exports = { authorizedPermission };
