import React, {  useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa';
import { CiCircleRemove } from 'react-icons/ci';
import EditSupplierModal from "./EditSupplierModal"
import DeleteSupplierModal from "./DeleteSupplierModal"
import SuccessMsg from '../Messages/SuccessMsg';
// import ErrorMsg from '../Messages/ErrorMsg';
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from '../../redux/supplier/supplierApiCalls';
import ShowPayments from './payments/ShowPayments';
import ErrorMsg from '../Messages/ErrorMsg';
import SearchSupplier from './SearchSupplier';
// import { formatDate } from '../../functions/functions';

const ShowSuppliers = () => {
  const { suppliers, error } = useSelector(state => state.suppliers)
  // , error
  const dispatch = useDispatch()
  const [selectedSupplier, setSelectedSupplier] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [modalError, setModalError] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await dispatch(getSuppliers(null))
      if(response === true) {
        setModalError(false)
      } else {
        setModalError(true)
      }
    }
    fetchSupplier();
  }, [dispatch])

  const toggleEditSupplier = (suppId) => {
    setSelectedSupplier(suppId);
    setShowEditModal(!showEditModal)
  }
  
  const toggleDeleteSupplier = (suppId) => {
    setSelectedSupplier(suppId);
    setShowDeleteModal(!showDeleteModal)
  }

  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const toggleShowPaymentsSupplier = (suppId) => {
    setSelectedSupplier(suppId);
    setShowPaymentsModal(!showPaymentsModal)
  }
  return (
    <div className="w-full">
      <SearchSupplier />
      {modalError && <ErrorMsg error={error} modal={modalError} toggle={() => setModalError(!modalError)} />}
      {showSuccessMsg && <SuccessMsg modal={showSuccessMsg} toggle={() => setShowSuccessMsg(!showSuccessMsg)} />}
      <div className="flex flex-col border">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {suppliers?.map((supplier, index) => (
                    <tr className="border-b" key={index}>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {supplier.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {supplier.balance}
                      </td>
                      <td className="flex items-center justify-center gap-1">

                      <FaEye
                          className="text-blue"
                          style={{ fontSize: "24px" }}
                          onClick={() => toggleShowPaymentsSupplier(supplier._id)}
                        />
                        {showPaymentsModal && selectedSupplier === supplier._id && (
                          <ShowPayments
                            modal={showPaymentsModal}
                            toggle={() => setShowPaymentsModal(!showPaymentsModal)}
                            supplier={supplier}
                            setShowSuccessMsg={setShowSuccessMsg}
                          />
                        )}

                        <FaEdit
                          className="text-green"
                          style={{ fontSize: "24px" }}
                          onClick={() => toggleEditSupplier(supplier._id)}
                        />
                        {showEditModal && selectedSupplier === supplier._id && (
                          <EditSupplierModal
                            modal={showEditModal}
                            toggle={() => setShowEditModal(!showEditModal)}
                            supplierData={supplier}
                            setShowSuccessMsg={setShowSuccessMsg}
                          />
                        )}
                        <CiCircleRemove
                          className="text-red"
                          style={{ fontSize: "24px" }}
                          onClick={() => toggleDeleteSupplier(supplier._id)}
                        />
                        {showDeleteModal && selectedSupplier === supplier._id && (
                          <DeleteSupplierModal
                            modal={showDeleteModal}
                            toggle={() => setShowDeleteModal(!showDeleteModal)}
                            supplierData={supplier}
                            setShowSuccessMsg={setShowSuccessMsg}
                          />
                        )}
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
  )
}

export default ShowSuppliers
