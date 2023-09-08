import React, { useContext, useEffect, useState } from "react";
import { get } from "../../requestMethods";
import { useSelector } from "react-redux";
import { getRemainingDays } from "../../functions/functions";
import { ShowProductContext } from "./ShowProducts";

const FilterByExpirationProd = () => {
  const { products } = useSelector((state) => state.products);
  const [filteredDate, setFilteredDate] = useState("");
  const [expirProduct, setExpirProduct] = useState({});
  const {
    setShowProductDetails,
    showStatsProduct,
    setShowStatsProduct,
    setSelectedProduct,
    selectedProduct,
  } = useContext(ShowProductContext);

  const handleFilteredDate = async (e) => {
    const date = e.target.value;
    setFilteredDate(e.target.value);
    if (date.length > 0) {
      try {
        const response = await get(`/product?expirDate=${date}`);
        const resData = response.data.success;
        const filteredResData = resData
        .filter((product) => new Date(product.expiration_date).getTime() - new Date().getTime() > 0)
        .map((product) => ({
          ...product.product,
          qtyPurchase: product.qty,
          expiration_date: product.expiration_date,
        }));

        const groupProduct = filteredResData.reduce((acc, curr) => {
          const key = curr.title;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(curr);
          return acc;
        }, {});
        setExpirProduct(groupProduct);
        setSelectedProduct(filteredResData[0]);
      } catch (err) {
        console.log("err: ", err);
      }
      setShowProductDetails(false);
    } else {
      setExpirProduct({});
      setShowProductDetails(true);
    }
  };

  useEffect(() => {
    selectedProduct?._id && setShowStatsProduct(true);
  }, [selectedProduct, setShowStatsProduct])

  const handleSelectedProduct = (product) => {
    if(selectedProduct._id === product._id && showStatsProduct) {
      setShowStatsProduct(false);
      setSelectedProduct({});
    } else {
      setShowStatsProduct(true);
      setSelectedProduct(product);
    }
  };

  return (
    <>
      <label className="text-gray-700 font-bold" htmlFor="expirDate">
        Filtrer Par
      </label>
      <select
        className="px-3 py-2 rounded border shadow ml-2 focus:outline-none focus:outline-shadow"
        value={filteredDate}
        onChange={handleFilteredDate}
      >
        <option value="">Date d'expiration</option>
        <option value="1 week">1 semaine</option>
        <option value="1 month">1 mois</option>
        <option value="3 month">3 mois</option>
        <option value="6 month">6 mois</option>
        <option value="1 year">1 an</option>
      </select>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {products
        ?.map((product, index) => {
          const title = product.title;
          const expirProductTitle = expirProduct[title];

          if (expirProductTitle) {
            return (
              <section
                key={index}
                className={`bg-white hover:bg-blue-600 rounded shadow-md p-3 ${selectedProduct?._id === product._id ? "bg-blue-600" : ""}`}
                onClick={() => handleSelectedProduct(product)}
              >
                <p className="text-center">{title}</p>
                {expirProductTitle
                .map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>qté: {item.qtyPurchase}</span>
                    <span className="text-red">
                      {getRemainingDays(item.expiration_date)}
                    </span>
                  </div>
                ))}
              </section>
            );
          }
          return null;
        })}

        {/* {expirProduct && products?.map((product, index) => {
          const title = product.title;
      })} */}
      </div>
    </>
  );
};

export default FilterByExpirationProd;
