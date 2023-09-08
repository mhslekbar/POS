import React, { createContext, useEffect, useState } from "react";
import ErrorMsg from "../Messages/ErrorMsg";
import AddProductModal from "./AddProductModal";
import { FaEdit } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import SuccessMsg from "../Messages/SuccessMsg";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/product/productApiCalls";
import StatisticProducts from "./StatisticProducts";
import FilterByExpirationProd from "./FilterByExpirationProd";
import SearchProduct from "./SearchProduct";
import { getCategories } from "../../redux/categories/categoriesApiCalls";

export const ShowProductContext = createContext(null);

const ShowProducts = () => {
  const { products } = useSelector((state) => state.products);
  const [showProductDetails, setShowProductDetails] = useState(true)

  const [error, setError] = useState(false);
  const [modalError, setModalError] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsProduct, setShowStatsProduct] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await dispatch(getProducts(null));
      if (response === true) {
        setError("");
        setModalError(false);
      } else {
        setError(response);
        setModalError(true);
      }
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const getCats = async () => {
      await dispatch(getCategories());
    }
    getCats();
  }, [dispatch])

  const toggleEditProduct = (event, product) => {
    setSelectedProduct(product);
    setShowEditModal(!showEditModal);
    event.stopPropagation();
  };

  const toggleDeleteProduct = (event, product) => {
    setSelectedProduct(product);
    setShowDeleteModal(!showDeleteModal);
    event.stopPropagation();
  };
  
  const handleShowStatsProduct = (product) => {
    if(selectedProduct._id === product._id && showStatsProduct) {
      setShowStatsProduct(false);
      setSelectedProduct({});
    } else {
      setShowStatsProduct(true);
      setSelectedProduct(product);
    }
  };

  return (
    <div className="w-full">
      <ShowProductContext.Provider value={{
        selectedProduct,
        setSelectedProduct,
        setShowProductDetails,
        setShowStatsProduct,
        searchProduct, setSearchProduct
      }}>
        {showSuccessMsg && (
          <SuccessMsg
            modal={showSuccessMsg}
            toggle={() => setShowSuccessMsg(!showSuccessMsg)}
          />
        )}

        {error && (
          <ErrorMsg
            error={error}
            modal={modalError}
            toggle={() => setModalError(!modalError)}
          />
        )}
        <AddProductModal />
        {showStatsProduct && <StatisticProducts />}
        <SearchProduct />
        <FilterByExpirationProd />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {showProductDetails && products
          ?.filter((product) => {
            if(searchProduct) {
              return product.title?.startsWith(searchProduct) || product.barcode === searchProduct
            }
            return true
          })
          ?.map((product, index) => (
            <div
              className={`bg-white hover:bg-blue-600 rounded shadow-md p-3 ${selectedProduct?._id === product._id ? "bg-blue-600" : ""}`}
              key={index}              
            >
              <section onClick={() => handleShowStatsProduct(product)}>
                <div>
                  <b>titre:</b> {product.title}
                </div>
                <div className="hidden">
                  <b>note:</b> {product.desc}
                </div>
                <div className="hidden">
                  <b>categorie:</b> {product?.catId?.name}
                </div>
                <div>
                  <b>prix:</b> {product.price} MRU
                </div>
                <div>
                  <b>qté:</b> {product.qty}
                </div>
                <div>
                  <b>barcode:</b> {product.barcode}
                </div>
              </section>
              <div className="flex items-center justify-center">
                <FaEdit
                  className="text-green me-2"
                  style={{ fontSize: "24px" }}
                  onClick={(event) => toggleEditProduct(event, product)}
                />
                {selectedProduct && selectedProduct._id === product._id && (
                  <EditProductModal
                    modal={showEditModal}
                    toggle={() => setShowEditModal(!showEditModal)}
                    productData={product}
                    setShowSuccessMsg={setShowSuccessMsg}
                  />
                )}
                <CiCircleRemove
                  className="text-red"
                  style={{ fontSize: "24px" }}
                  onClick={(event) => toggleDeleteProduct(event, product)}
                />
                {selectedProduct && selectedProduct._id === product._id && (
                  <DeleteProductModal
                    modal={showDeleteModal}
                    toggle={() => setShowDeleteModal(!showDeleteModal)}
                    productData={product}
                    setShowSuccessMsg={setShowSuccessMsg}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </ShowProductContext.Provider>
    </div>
  );
};

export default ShowProducts;

// {products.map((product, index) => (
//   <tr className="border-b" key={index}>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {index + 1}
//     </td>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {product.title}
//     </td>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {product.desc}
//     </td>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {product?.catId?.name}
//     </td>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {product.price}
//     </td>
//     <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//       {product.qty}
//     </td>
//     <td className="flex items-center justify-center">
//       <FaEdit
//         className="text-green me-2"
//         style={{ fontSize: "24px" }}
//         onClick={() => toggleEditProduct(product._id)}
//       />
//       {selectedProduct && selectedProduct === product._id && (
//         <EditProductModal
//           modal={showEditModal}
//           toggle={() => setShowEditModal(!showEditModal)}
//           productData={product}
//           setShowSuccessMsg={setShowSuccessMsg}
//         />
//       )}
//       <CiCircleRemove
//         className="text-red"
//         style={{ fontSize: "24px" }}
//         onClick={() => toggleDeleteProduct(product._id)}
//       />
//       {selectedProduct && selectedProduct === product._id && (
//         <DeleteProductModal
//           modal={showDeleteModal}
//           toggle={() => setShowDeleteModal(!showDeleteModal)}
//           productData={product}
//           setShowSuccessMsg={setShowSuccessMsg}
//         />
//       )}
//     </td>
//   </tr>
// ))}
