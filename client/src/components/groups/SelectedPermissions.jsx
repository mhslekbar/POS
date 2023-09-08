import React, { useEffect, useState } from 'react'

const SelectedPermissions = ({ group, perm }) => {
  const [selectedPerm, setSelectedPerm] = useState(false);
  const [updatedPerm, setUpdatedPerm] = useState(false)
  const [updatedGroup, setUpdatedGroup] = useState(group);

  useEffect(() => {
    !updatedPerm && setSelectedPerm(group.permissions.some(p => p._id.toString() === perm._id.toString()))
  }, [group.permissions, perm._id, updatedPerm])


  const handlePermissions = (e, permId, permObj) => {
    const updatedGroupPermissions = updatedGroup.permissions.filter((perm) => perm._id !== permId);
    if (e.target.checked) {
      updatedGroupPermissions.push(permObj);
    }
    const newUpdatedGroup = {...updatedGroup, permissions: updatedGroupPermissions};
    setUpdatedGroup(newUpdatedGroup);
    setSelectedPerm(newUpdatedGroup.permissions.some(p => p._id.toString() === perm._id.toString()));
    setUpdatedPerm(true);
  };
  
  return (
    <input
      type="checkbox"
      id={`perm${group._id}${perm._id}`}
      checked={selectedPerm}
      onChange={(e) => handlePermissions(e, perm._id, perm)}
      value={perm._id}
    />
  )
}

export default SelectedPermissions
