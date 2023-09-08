import React, {  useContext, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { get } from '../../requestMethods';
import FormNewPurchase from './FormNewPurchase';
import PurchasesTable from './PurchasesTable';
import { useDispatch } from 'react-redux';
import { addPurchase } from '../../redux/purchases/purchaseApiCalls';
import { Timeout, hideMsg } from '../../functions/functions';
import SelectSuppliers from './SelectSuppliers';
import { showPurchasesContext } from './ShowPurchases';


const AddPurchaseModal = () => {
  const [modal, setModal] = useState(false)
  const [productName, setProductName] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [modalFormNewPurchase, setModalFormNewPurchase] = useState(false);
  const [product, setProduct] = useState({});
  const [LinePurchasesData, setLinePurchasesData] = useState([]);
  const [errors, setErrors] = useState([])

  const {        
    setShowSuccessMsg, 
    supplierId, setSupplierId, checkedTotalAmount, setCheckedTotalAmount, 
    checkedPartielAmount, setCheckedPartielAmount, partielAmount, setPartielAmount, 
    showPartielAmount, setShowPartielAmount
  } = useContext(showPurchasesContext)

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
  
  const showDetailsproduct = (product) => { // Show details on modal popup
    setModalFormNewPurchase(!modalFormNewPurchase)
    setListProduct([])
    setProductName("")
    setProduct(product)
  }

  const toggle = () => {
    setModal(!modal)
  }

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = []
    if(supplierId.length === 0) {
      formErrors.push("Choisir un fournisseur") 
    }
    if(LinePurchasesData.length === 0) {
      formErrors.push("Ajouter un produit")
    }
    if(checkedPartielAmount && partielAmount.length === 0) {
      formErrors.push("Donner le montant que vous avez donner au fournisseur")
    }

    if(formErrors.length === 0)
    {
      const data = LinePurchasesData.map(
        ({productId, buy_price, sell_price, mainQty, qty, total_price, expiration_date}) =>
        ({productId: productId.id, buy_price, sell_price, mainQty, qty, total_price, expiration_date})
      )
      const totalFact = LinePurchasesData.reduce((acc, currVal) => acc + currVal.total_price, 0)
      const amountPayed = partielAmount.length === 0 ? totalFact : partielAmount;
      try {
        const supplierObj = { supplierId, amountPayed }
        const response = await dispatch(addPurchase({supplier: supplierObj, LinePurchase: data}))
        if(response === true) {
          toggle();
          setLinePurchasesData([])
          setShowSuccessMsg(true)
          setTimeout(() => setShowSuccessMsg(false), Timeout)
          setCheckedPartielAmount(false)
          setCheckedTotalAmount(true)
          setShowPartielAmount(false)
          setPartielAmount("")
        } else {
          setErrors(response)
        }
      } catch {}
 
    }else {
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
      <button className="p-2 rounded bg-blue-600 text-white" onClick={toggle}>
        <FaPlus />
      </button>        
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
                    onSubmit={handleSubmit}
                  >
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
                      product={product}
                      purchasesObj={{LinePurchasesData, setLinePurchasesData}}
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
                    />
                    {/* END Supplier */}
                    <PurchasesTable purchasesObj={{LinePurchasesData, setLinePurchasesData}} />
                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-600 rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
                      >
                        Ajouter
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

export default AddPurchaseModal