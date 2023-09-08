import React, { useContext,  useState } from 'react';
import { useSelector } from "react-redux";
import ErrorMsg from '../Messages/ErrorMsg';
import { ShowProductContext } from './ShowProducts';

const SearchProduct = () => {
  const [modalError, setModalError] = useState()
  const { error } = useSelector(state => state.products)
  const { searchProduct, setSearchProduct } = useContext(ShowProductContext)

  return (
    <>
      {error && (
        <ErrorMsg
          error={error}
          modal={modalError}
          toggle={() => setModalError(!modalError)}
        />
      )}
      <label htmlFor="search" className='font-bold text-gray'>Rechercher</label>
      <input 
        type="text"
        className='rounded border shadow px-3 py-2 mx-2 focus:outline-none focus:shadow-outline'
        placeholder='Rechercher par titre'
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />
    </>
  )
}

export default SearchProduct;


// const barcodeInputRef = useRef(null);

// useScanDetection({
//   onComplete: (scanResult) => {
//     if (document.activeElement !== barcodeInputRef.current) {
//       setProduct(scanResult);
//     }
//   },
//   minLength: 3,
// });


// ref={barcodeInputRef} // Add a ref to the barcode input field
