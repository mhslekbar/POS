import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumptionsApi } from "../../redux/consumption/consApiCalls";
import ErrorMsg from "../Messages/ErrorMsg";
import SuccessMsg from "../Messages/SuccessMsg";
import AddNewConsumption from "./AddNewConsumption";
import { FaEdit } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import EditConsumption from "./EditConsumption";
import DeleteConsumption from "./DeleteConsumption";

const ShowConsumptions = () => {
  const { consumptions, error } = useSelector((state) => state.consumptions);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCons, setSelectedCons] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getConsumptionsApi());
      if (response === true) {
        setModalError(false);
      } else {
        setModalError(true);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEditCons = (cons) => {
    setEditModal(!editModal)
    setSelectedCons(cons)
  }
  const handleDeleteCons = (cons) => {
    setDeleteModal(!deleteModal)
    setSelectedCons(cons)
  }

  return (
    <div className="w-full">
      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
        />
      )}

      {modalError && (
        <ErrorMsg
          error={error}
          modal={modalError}
          toggle={() => setModalError(!modalError)}
        />
      )}

      <AddNewConsumption setShowSuccessMsg={setShowSuccessMsg}/>
      
      {editModal && <EditConsumption modal={editModal} toggle={() => setEditModal(!editModal)} selectedCons={selectedCons} setShowSuccessMsg={setShowSuccessMsg}/>}
      {deleteModal && <DeleteConsumption modal={deleteModal} toggle={() => setDeleteModal(!deleteModal)} selectedCons={selectedCons} setShowSuccessMsg={setShowSuccessMsg}/>}


      {consumptions.length > 0 && (
        <div className="w-3/4 flex flex-col border">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-center text-sm font-light">
                  <thead className="border-b font-medium bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4">Note</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {consumptions?.map((consumption, index) => (
                      <tr className="border-b" key={index}>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {consumption.note}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {consumption.amount}
                        </td>
                        <td className="flex justify-center items-center">
                          <FaEdit style={{ fontSize: "22px" }} className="text-green" onClick={() => handleEditCons(consumption)}/>
                          <CiCircleRemove style={{ fontSize: "22px" }} className="text-red" onClick={() => handleDeleteCons(consumption)}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowConsumptions;
