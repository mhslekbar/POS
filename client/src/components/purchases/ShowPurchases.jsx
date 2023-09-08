import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchase } from "../../redux/purchases/purchaseApiCalls";
import ErrorMsg from "../Messages/ErrorMsg";
import SuccessMsg from "../Messages/SuccessMsg";
import { FaEdit, FaPrint } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import AddPurchaseModal from "./AddPurchaseModal";
import DeletePurchaseModal from "./DeletePurchaseModal";
import TableLinePurchase from "./TableLinePurchase";
import { lenOfFacture } from "../../functions/functions";
import EditPurchaseModal from "./EditPurchaseModal";
import SeachPurchase from "./SeachPurchase";

export const showPurchasesContext = createContext(null)

const ShowPurchases = () => {
  const dispatch = useDispatch();
  const [modalError, setModalError] = useState(false);
  const [error, setError] = useState(false);
  const { purchases } = useSelector((state) => state.purchases);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState("");

  const [numPurchase, setNumPurchase] = useState("")
  const [purchaseId, setPurchaseId] = useState("")

  const [selectedPurchase, setSelectedPurchase] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  
  // START Suppliers
  const [supplierId, setSupplierId] = useState("");
  const [checkedTotalAmount,setCheckedTotalAmount] = useState(true);
  const [checkedPartielAmount,setCheckedPartielAmount] = useState(false);  
  const [partielAmount,setPartielAmount] = useState("");
  const [showPartielAmount,setShowPartielAmount] = useState("");
  // END Suppliers

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getPurchase(null));
      if (response === true) {
        setError("");
        setModalError(false);
      } else {
        setModalError(true);
        setError(response);
      }
    };
    fetchData();
  }, [dispatch]);


  const setDeletePurchase = (purchase) => {
    setPurchaseData(purchase);
    setShowDeleteModal(!showDeleteModal);
  };
  
  const setEditPurchase = (purchase) => {
    setNumPurchase(purchase.numPurchase)
    setPurchaseData(purchase);
    setShowEditModal(!showEditModal);
    setPurchaseId(purchase._id)
  };

  useEffect(() => {
    // setSelectedPurchase(selectedPurchase._id ? purchases.find(purchase => purchase.numPurchase === numPurchase) : purchases[0]);
    const SPurchase = purchases.find(purchase => purchase._id === selectedPurchase?._id)
    setSelectedPurchase(SPurchase?.numPurchase ? SPurchase : purchases[0])
  }, [purchases, selectedPurchase, numPurchase]);

  const handleSelectedPurchase = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <showPurchasesContext.Provider 
      value={{
        setShowSuccessMsg, purchaseData, numPurchase,
        purchaseId ,supplierId, setSupplierId ,
        checkedTotalAmount, setCheckedTotalAmount, checkedPartielAmount,
        setCheckedPartielAmount, partielAmount, setPartielAmount, showPartielAmount, 
        setShowPartielAmount, selectedPurchase
      }}
    >
    <div className="w-full">
      <SeachPurchase />
      <AddPurchaseModal setShowSuccessMsg={setShowSuccessMsg} />
      {showDeleteModal && (
        <DeletePurchaseModal
          modal={showDeleteModal}
          toggle={() => setShowDeleteModal(!showDeleteModal)}
          setShowSuccessMsg={setShowSuccessMsg}
          purchaseData={purchaseData}
        />
      )}

      {showEditModal && (
        <EditPurchaseModal
          modal={showEditModal}
          toggle={() => setShowEditModal(!showEditModal)}
        />
      )}

      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
          setShowSuccessMsg={setShowSuccessMsg}
        />
      )}

      {error && (
        <ErrorMsg
          error={error}
          modal={modalError}
          toggle={() => setModalError(!modalError)}
        />
      )}

      <div className="mx-9">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "fit-content(100%) 1fr fit-content(100%)",
          }}
        >
          <div className="mr-4">
            {purchases.slice(0, 10).map((purchase, index) => (
              <span
                className={`block text-gray-700 
                  ${
                    selectedPurchase?._id === purchase._id
                      ? "bg-white border-r border-r-4 pr-2 border-r-blue-600"
                      : ""
                  }`}
                onClick={() => handleSelectedPurchase(purchase)}
                key={index}
              >
                {lenOfFacture(purchase?.numPurchase)}
              </span>
            ))}
          </div>
          {purchases.length > 0 && 
            <>          
              {/* <h1>{selectedPurchase?.supplier.supplierId}</h1> */}
              <TableLinePurchase
                LinePurchase={selectedPurchase?.LinePurchase}
              />
              <div>
                <FaEdit 
                  className="text-green"
                  style={{ fontSize: "22px" }} 
                  onClick={() => setEditPurchase(selectedPurchase)}
                />
                <CiCircleRemove
                  className="text-red"
                  style={{ fontSize: "22px" }}
                  onClick={() => setDeletePurchase(selectedPurchase)}
                />
                <FaPrint 
                  className="text-blue-600"
                  style={{ fontSize: "22px" }}
                  onClick={() => window.print()}
                />
              </div>
            </>
          }
        </div>

      </div>
    </div>
  </showPurchasesContext.Provider>
  );
};

export default ShowPurchases;
