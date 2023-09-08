import React, { useEffect, useState } from 'react'
import SelectedPermissions from './SelectedPermissions';
import { useDispatch, useSelector } from "react-redux";
import { getPermissionsApi } from '../../redux/permissions/permissionApiCalls';

const PermissionsList = ({ tableName, group }) => {
  const { permissions } = useSelector(state => state.permissions);
  const [allowedPermission, setAllowedPermissions] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    const getPermissions = async () => {
      await dispatch(getPermissionsApi())
    }
    getPermissions();
  }, [dispatch])

  useEffect(() => {
    const filteredPermis = permissions?.filter(
      (perm) => perm.collectionName === tableName
    );
    setAllowedPermissions(filteredPermis)
  }, [tableName, permissions])

  return (
    <div>
      {
        allowedPermission.map((perm) => {
          return (
          <div key={perm._id}>
            <SelectedPermissions group={group} perm={perm} /> {" "}
            <label htmlFor={`perm${group._id}${perm._id}`}>
              {perm.permissionName}
            </label>
          </div>
        )})
      }
    </div>
  )
}

export default PermissionsList
