import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiShareForwardFill } from "react-icons/ri";
import { addItemToCart, updateCartApi } from "../../redux/cart/cartApiCalls";
import { appendSaleApi } from "../../redux/sales/salesApiCalls";
import { getProducts } from "../../redux/product/productApiCalls";
import { ShowSalesContext } from "./ShowSales";
import SearchProducts from "./SearchProducts";

const Menu = () => {
  const { products } = useSelector((state) => state.products);

  const [qtyNeeded, setQtyNeeded] = useState(
    products.reduce((acc, product) => {
      acc[product._id] = 0;
      return acc;
    }, {})
  );

  const handleCounter = (id, type, qty) => {
    setQtyNeeded((prevCounters) => {
      const counter = prevCounters[id] || 0;
      switch (type) {
        case "decrement":
          return {
            ...prevCounters,
            [id]: counter > 0 ? Number(counter) - 1 : counter,
          };
        case "increment":
          return {
            ...prevCounters,
            [id]: counter < qty ? Number(counter) + 1 : counter,
          };
        default:
          return { ...prevCounters, [id]: 0 };
      }
    });
  };

  const handleQty = (counter, id, qtyExist) => {
    if (counter <= qtyExist && counter > 0) {
      setQtyNeeded((prevCounters) => {
        return { ...prevCounters, [id]: Number(counter) };
      });
    }
  };
  const dispatch = useDispatch();
  const {
    setShowInfo,
    setCheckPartiel,
    setCheckTotal,
    setName,
    setClientId,
    selectedOrder,
    setErrors
  } = useContext(ShowSalesContext);

  const handleAddItemToCart = async (product, id) => {
    if (localStorage.getItem("orderStatus") === "Edit") {
      const saleId = selectedOrder._id;
      const response = await dispatch(
        appendSaleApi(saleId, { ...product, productId: product._id })
      );
      if(response.res === true) {
        await dispatch(getProducts("/menuProduct"));
        const resData = response.resData;
        const responseSaleId = response.saleId;
        const FindSale = resData?.find((sale) => sale._id === responseSaleId);
        const data = FindSale.LineSale.map((lineSale) => ({
          ...lineSale,
          qtyNeeded: lineSale.qty,
          productId: { title: lineSale.productId.title },
        }));
        await dispatch(updateCartApi(data));
        setErrors([])
      }else {
        setErrors(response)
      }
    } else {
      await dispatch(
        addItemToCart({ ...product, productId: { title: product.title } })
      );
    }

    setQtyNeeded((prevCounters) => {
      return { ...prevCounters, [id]: 0 };
    });

    setShowInfo(false);
    setCheckPartiel(false);
    setCheckTotal(true);
    setName("");
    setClientId("");
  };

  return (
    <div className="w-full mt-2">
      <h1 className="text-xl font-bold text-gray-700 text-center">Menu</h1>
      <SearchProducts />
      <div className="bg-white p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[600px] overflow-y-scroll">
        {products.map((product) => (
          <div
            className={`p-2 rounded shadow border grid md:grid-cols-4 ${
              product.qty > 0 ? "bg-white" : "productNotAvailable"
            }`}
            key={product._id}
          >
            <section className="col-span-3">
              <h3 className="text-md font-bold">{product.title}</h3>
              <p>{product.price} MRU</p>
              <p className={`p-1 rounded w-fit`}>
                stock:{" "}
                <b
                  className={`${product.qty > 5 ? "text-green" : ""} ${
                    product.qty > 0 && product.qty <= 5 ? "text-red" : ""
                  }`}
                >
                  {product.qty}
                </b>
              </p>
            </section>
            <section className="flex items-end flex-col relative col-span-1">
              <p
                className="inline-block rounded-full bg-[#EEE] text-center w-8 h-8 leading-8"
                onClick={() =>
                  handleCounter(product._id, "decrement", product.qty)
                }
                style={{
                  position: "absolute",
                  top: "0",
                  right: 0,
                }}
              >
                -
              </p>
              <input
                type="number"
                className="block w-12 bg-transparent text-center focus:outline-none"
                value={qtyNeeded[product._id]}
                onChange={(e) =>
                  handleQty(e.target.value, product._id, product.qty)
                }
                style={{
                  position: "absolute",
                  top: "32px",
                  right: "-8px",
                }}
              />
              <p
                className="inline-block rounded-full bg-[#EEE] text-center w-8 h-8 leading-8"
                onClick={() =>
                  handleCounter(product._id, "increment", product.qty)
                }
                style={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                }}
              >
                +
              </p>
            </section>
            <section
              className="col-span-1 mt-4 bg-blue-600 text-white h-8 w-8 rounded"
              title="Ajouter dans le panier"
              onClick={() =>
                handleAddItemToCart(
                  { ...product, qtyNeeded: qtyNeeded[product._id] },
                  product._id
                )
              }
            >
              <RiShareForwardFill className="mt-2 ml-2" />
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
