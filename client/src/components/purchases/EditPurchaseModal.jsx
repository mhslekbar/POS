import React, { useContext, useEffect, useState } from 'react';
import PurchasesTable from './PurchasesTable';
import { Timeout, hideMsg, lenOfFacture } from '../../functions/functions';
import FormNewPurchase from './FormNewPurchase';
import SelectSuppliers from './SelectSuppliers';
import { useDispatch } from 'react-redux';
import { updatePurchase } from '../../redux/purchases/purchaseApiCalls';
import { get } from '../../requestMethods';
import { showPurchasesContext } from './ShowPurchases';

const EditPurchaseModal = ({ modal, toggle }) => {
  const {        
    setShowSuccessMsg, purchaseData, numPurchase, purchaseId, 
    supplierId, setSupplierId, checkedTotalAmount, setCheckedTotalAmount, 
    checkedPartielAmount, setCheckedPartielAmount, partielAmount, setPartielAmount, 
    showPartielAmount, setShowPartielAmount
  } = useContext(showPurchasesContext)

  const [LinePurchasesData, setLinePurchasesData] = useState(purchaseData.LinePurchase)
  const [productName, setProductName] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [modalFormNewPurchase, setModalFormNewPurchase] = useState(false)
  const [errors, setErrors] = useState([]);
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setLinePurchasesData(purchaseData.LinePurchase)
  }, [purchaseData])

  const handleChangeProduct = (e) => {
    setProductName(e.target.value)
    const input = e.target.value
    if(input) {
      const fetchProduct = async () => {
        const res =  await get(`/product?title=${input}&limit=4`)
        setListProduct(res.data.success)
      }
      fetchProduct();
    }else {
      setListProduct([])
    }
  }

  const showDetailsproduct = (product) => {
    setProduct(product)
    setModalFormNewPurchase(!modalFormNewPurchase)
    setListProduct([])
    setProductName("")
  }

  const handleSubmitEditPurchase = async (e) => {
    e.preventDefault();
    const formErrors = []
    if(supplierId.length === 0) {
      formErrors.push("Choisir un founisseur")
    }
    if(checkedPartielAmount && partielAmount.length === 0) {
      formErrors.push("Donner le montant que vous avez donner au fournisseur")
    }

    if(formErrors.length === 0) {
      const totalFact = LinePurchasesData.reduce((acc, currVal) => acc + currVal.total_price, 0)
      const amountPayed = partielAmount.length === 0 ? totalFact : partielAmount;
      
      const response = await dispatch(updatePurchase(purchaseId, {supplierId, amountPayed, numPurchase}))
      if(response === true) {
        toggle();
        setShowSuccessMsg(true)
        setTimeout(() => setShowSuccessMsg(false), Timeout)
      }
    } else {
      setErrors(formErrors)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key
      // Process your barcodeValue here
    }
  };

  return (
    <div>
        
      {modal && (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={toggle}
            ></div>
            <div className="flex items-start min-h-screen px-4 py-8">
              <div className="relative w-full p-4 mx-auto bg-white rounded-md shadow-lg" style={{width: "800px"}}>
                <div className="mt-3">
                  {/* Start Modal Body */}
                  <form
                    className="mt-2 sm:ml-4 sm:text-left"
                    onSubmit={handleSubmitEditPurchase}
                  >
                    <h1 className='text-center font-bold text-gray-700 text-2xl mb-2'>Facture-{lenOfFacture(purchaseData.numPurchase)}</h1>
                    
                    {errors.map((err, index) => (
                      <p 
                        key={index} 
                        className="p-2 bg-red-400 text-white mb-2 rounded"
                        onClick={(e) => hideMsg(e, errors, setErrors)}
                      >{err}</p>
                    ))}

                    <FormNewPurchase 
                      modal={modalFormNewPurchase}
                      toggle={() => setModalFormNewPurchase(!modalFormNewPurchase)}
                      purchasesObj={{LinePurchasesData, setLinePurchasesData}}
                      product={product}
                      typeEvent="Edit"
                      purchaseId={purchaseId}
                    />

                    <div className="mb-2">
                      <label htmlFor="product" className="block font-bold text-gray-700">Produit</label>
                      <input
                        id="product"
                        type="text"
                        placeholder='Nom du produit'
                        className="w-full shadow borderd rounded focus:outline-none focus:shadow-outline px-3 py-2"
                        value={productName}
                        onChange={handleChangeProduct}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div className="w-full" id="listProduct">
                      {listProduct.map((product,index) => (
                        <div 
                          key={index}
                          className="group flex justify-between p-2 mb-2 bg-white text-black border-b drop-shadow rounded hover:bg-blue-600 hover:text-white"
                          onClick={() => showDetailsproduct(product)}
                        >
                          <span>{product.title}</span>
                          <span className="group-hover:border group-hover:rounded group-hover:text-blue-600 group-hover:bg-white">{product.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* Start Supplier */}
                    <SelectSuppliers 
                      supplierId={supplierId}
                      setSupplierId={setSupplierId}
                      checkedTotalAmount={checkedTotalAmount} 
                      setCheckedTotalAmount={setCheckedTotalAmount}
                      setCheckedPartielAmount={setCheckedPartielAmount}
                      checkedPartielAmount={checkedPartielAmount}
                      setPartielAmount={setPartielAmount}
                      partielAmount={partielAmount}
                      showPartielAmount={showPartielAmount}
                      setShowPartielAmount={setShowPartielAmount}
                      purchaseId={purchaseId}
                      numPurchase={numPurchase}
                      typeEvent="Edit"
                    />
                    {/* END Supplier */}

                    <PurchasesTable purchasesObj={{LinePurchasesData, setLinePurchasesData}} typeEvent="Edit" numPurchase={numPurchase} />

                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
                      >
                        Modifier
                      </button>
                      <button
                        className="w-full mt-2 p-2.5 flex-1 bg-gray-600 text-white rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                        onClick={toggle}
                      >
                        Fermer
                      </button>
                    </div>
                    {/* End Modal Footer */}
                  </form>
                  {/* End Modal Body */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EditPurchaseModal;
