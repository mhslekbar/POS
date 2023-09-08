import React, { useEffect, useState } from "react";
import { get, put } from "../../requestMethods";
import { MinusOutline, PlusOutline } from "heroicons-react";
import { createRoot } from "react-dom/client";
import PermissionsList from "./PermissionsList";
import SuccessMsg from "../Messages/SuccessMsg";
import { Timeout } from "../../functions/functions";
import AddNewGroup from "./AddNewGroup";
import { FaEdit } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import EditGroupModal from "./EditGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import ErrorMsg from "../Messages/ErrorMsg";
import { useDispatch, useSelector } from "react-redux";
import { getRolesApi } from "../../redux/roles/roleApiCalls";
import { getPermissionsApi } from "../../redux/permissions/permissionApiCalls";
import { UserData } from "../../requestMethods";

const ShowGroups = () => {
  const [groups, setGroups] = useState([]);
  const [permissionsByTable, setPermissionsByTable] = useState([]);
  const [roots, setRoots] = useState({});
  const [rootsTable, setRootsTable] = useState({});
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [error, setError] = useState([])
  const [modalError, setModalError] = useState(false)

  const { roles } = useSelector(state => state.roles)
  const dispatch = useDispatch()

  useEffect(() => {
    setGroups(roles);
  }, [roles])

  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await dispatch(getRolesApi)
        if(response === true) {
          setError([])
          setModalError(false)
        } else {
          setError(response)
          setModalError(true)
        }
      } catch { }
    };
    getGroups();
  }, [dispatch]);

  useEffect(() => {
    const getPermissionsByTable = async () => {
      const res = await get("/permission/ByTable");
      setPermissionsByTable(res.data.success);
    };
    getPermissionsByTable();
  }, []);

  const toggleGroup = (id) => {
    const type = document.querySelector(`span#grp${id}`).getAttribute("type");
    let icon;
    if (type === "plus") {
      icon = <MinusOutline />;
      document.querySelector(`span#grp${id}`).setAttribute("type", "minus");
    } else if (type === "minus") {
      icon = <PlusOutline />;
      document.querySelector(`span#grp${id}`).setAttribute("type", "plus");
    }

    const root =
      roots[id] || createRoot(document.querySelector(`span#grp${id}`));
    root.render(icon);
    setRoots({ ...roots, [id]: root });

    switch (type) {
      case "plus":
        document.querySelector(`#table${id}`).removeAttribute("hidden");
        break;
      case "minus":
        document.querySelector(`#table${id}`).setAttribute("hidden", true);
        break;
      default:
        document.querySelector(`#table${id}`).setAttribute("hidden", true);
        break;
    }
  };

  const toggleTableGroup = (grpId, tableId) => {
    const type = document
      .querySelector(`span#table-${grpId}-${tableId}`)
      .getAttribute("type");

    if (!type) return;

    let icon;
    if (type === "plus") {
      icon = <MinusOutline />;
      document
        .querySelector(`span#table-${grpId}-${tableId}`)
        .setAttribute("type", "minus");
    } else if (type === "minus") {
      icon = <PlusOutline />;
      document
        .querySelector(`span#table-${grpId}-${tableId}`)
        .setAttribute("type", "plus");
    }
    const TableGrp = tableId + grpId;
    const rootTable =
      rootsTable[TableGrp] ||
      createRoot(document.querySelector(`span#table-${grpId}-${tableId}`));
    rootTable.render(icon);
    setRootsTable({ ...rootsTable, [TableGrp]: rootTable });

    switch (type) {
      case "plus":
        document
          .querySelector(`#tablegrp-${grpId}-${tableId}`)
          .removeAttribute("hidden");
        break;
      case "minus":
        document
          .querySelector(`#tablegrp-${grpId}-${tableId}`)
          .setAttribute("hidden", true);
        break;
      default:
        document
          .querySelector(`#tablegrp-${grpId}-${tableId}`)
          .setAttribute("hidden", true);
        break;
    }
  };

  const SavePermissions = async (grpId) => {
    const permSelected = [];
    document.querySelectorAll(`[id*=perm${grpId}]`).forEach((item) => {
      if (item.checked) {
        permSelected.push(item.value);
      }
    });
    const res = await put(`/group/${grpId}`, {
      permissions: permSelected,
    });
    await dispatch(getPermissionsApi(`?userId=${UserData()._id}`))
    if (res.data.success) {
      setTimeout(() => {
        setShowSuccessMsg(false);
      }, Timeout);
      setShowSuccessMsg(true);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null)
  const toggleShowEditModal = (grpId) => {
    setShowEditModal(!showEditModal)
    setSelectedGroup(grpId)
  }
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleShowDeleteModal = (grpId) => {
    setShowDeleteModal(!showEditModal)
    setSelectedGroup(grpId)
  }
  return (
    <div className="w-full">
      <AddNewGroup />
      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
        />
      )}
      {
        modalError && <ErrorMsg error={error} modal={modalError} toggle={() => setModalError(!modalError)}/>
      }
      {groups.map((group) => (
        // START Group
        <section key={group._id}>
          <div className="flex justify-between bg-white my-2 p-4 w-1/2">
            <span className="flex ">
              <FaEdit
                className="mt-1 text-green"
                style={{ fontSize: "20px" }}
                onClick={() => toggleShowEditModal(group._id)}
              />{" "}
              {
                selectedGroup && selectedGroup === group._id &&
                <EditGroupModal modal={showEditModal} toggle={() => setShowEditModal(!showEditModal)} group={group} setShowSuccessMsg={setShowSuccessMsg} />
              }
              <CiCircleRemove
                className="mt-1 text-red"
                style={{ fontSize: "20px" }}
                onClick={() => toggleShowDeleteModal(group._id)}
              />{" "}
              {
                selectedGroup && selectedGroup === group._id &&
                <DeleteGroupModal modal={showDeleteModal} toggle={() => setShowDeleteModal(!showDeleteModal)} group={group} setShowSuccessMsg={setShowSuccessMsg} />
              }
              {group.groupName}
            </span>
            <span
              id={`grp${group._id}`}
              onClick={() => toggleGroup(group._id)}
              type="plus"
            >
              <PlusOutline />
            </span>
          </div>
          <div className="bg-blue w-1/2" id={`table${group._id}`} hidden>
            {/* START Show Different Table */}
            {permissionsByTable?.map((permis, ind) => {
              return (
                <section key={ind} style={{ marginBottom: "2px" }}>
                  <div className="flex justify-between bg-white p-2 mx-2">
                    <span>{permis._id}</span>
                    <span
                      id={`table-${group._id}-${permis._id}`}
                      onClick={() =>
                        toggleTableGroup(group._id, permis._id, group)
                      }
                      type="plus"
                    >
                      <PlusOutline />
                    </span>
                  </div>
                  <div
                    className="p-4 mx-6"
                    id={`tablegrp-${group._id}-${permis._id}`}
                    hidden
                  >
                    {/* Data Will load from react  */}
                    {<PermissionsList tableName={permis._id} group={group} />}
                    {/* END Show Permissions */}
                  </div>
                </section>
              );
            })}
            <div className="flex justify-end items-end">
              <button
                className="px-2 py-1 rounded bg-green-600 text-white"
                onClick={() => SavePermissions(group._id)}
              >
                save
              </button>
            </div>
            {/* END Show Different Table */}
          </div>
        </section>
      ))}
      {/* END Group */}
    </div>
  );
};

export default ShowGroups;
