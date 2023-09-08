import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "../../redux/client/clientApiCalls";
import { FaEdit, FaEye } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import SuccessMsg from "../Messages/SuccessMsg";
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import DeleteClientModal from "./DeleteClientModal";
import ShowPaymentClients from "./payments/ShowPaymentClients";
import ErrorMsg from "../Messages/ErrorMsg";
import SearchClient from "./SearchClient";

const ShowClients = () => {
  const { clients, error } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const [successMsg, setSuccessMsg] = useState(false);
  const [modalError, setModalError] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      const response =  await dispatch(getClients());
      if(response === true) {
        setModalError(false)
      }else {
        setModalError(true)
      }
    };
    fetchClients();
  }, [dispatch]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const toggleEditClient = (clientId) => {
    setSelectedClient(clientId)
    setShowEditModal(true)
  }
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const toggleDeleteClient = (clientId) => {
    setSelectedClient(clientId)
    setShowDeleteModal(true)
  }
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const toggleShowPayments = (clientId) => {
    setSelectedClient(clientId)
    setShowPaymentModal(!showPaymentModal)
  }
  return (
    <>
      <AddClientModal setSuccessMsg={setSuccessMsg}/>
      <SearchClient />
      <div className="w-full">

        {error && <ErrorMsg error={error} modal={modalError} toggle={() => setModalError(!modalError)} />}

        {successMsg && (
          <SuccessMsg
            modal={successMsg}
            toggle={() => setSuccessMsg(!successMsg)}
          />
        )}

        <div className="flex flex-col border">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4">Nom</th>
                      <th className="px-6 py-4">Telephone</th>
                      <th className="px-6 py-4">Dette</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {clients.map((client, index) => (
                      <tr className="border-b" key={index}>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {client.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {client.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {client.dette}
                        </td>
                        <td className="flex justify-center items-center gap-1">
                          <FaEye 
                            style={{ fontSize: "24px" }}
                            onClick={() => toggleShowPayments(client._id)}
                          />
                          {showPaymentModal && selectedClient === client._id && (
                            <ShowPaymentClients 
                              modal={showPaymentModal}
                              toggle={() => setShowPaymentModal(!showPaymentModal)}
                              client={client}
                              setSuccessMsg={setSuccessMsg}
                            />
                          )}
                          <FaEdit
                            className="text-green"
                            style={{ fontSize: "24px" }}
                            onClick={() => toggleEditClient(client._id)}
                          />
                          {showEditModal && selectedClient === client._id && (
                            <EditClientModal 
                              modal={showEditModal}
                              toggle={() => setShowEditModal(!showEditModal)}
                              clientData={client}
                              setSuccessMsg={setSuccessMsg}
                            />
                          )}
                          <CiCircleRemove
                            className="text-red"
                            style={{ fontSize: "24px" }}
                            onClick={() => toggleDeleteClient(client._id)}

                          />
                          { showDeleteModal &&
                            selectedClient === client._id && 
                          (<DeleteClientModal 
                            modal={showDeleteModal}
                            toggle={() => setShowDeleteModal(!showDeleteModal)}
                            clientData={client}
                            setSuccessMsg={setSuccessMsg}
                          />)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowClients;
