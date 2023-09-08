import React, { useContext, useEffect, useState } from "react";
import { BiCartDownload } from "react-icons/bi";
import { HiArrowUpTray } from "react-icons/hi2";
import { MdLocalGroceryStore } from "react-icons/md";
import { ShowProductContext } from "./ShowProducts";
import { get } from "../../requestMethods";

const StatisticProducts = () => {
  const { selectedProduct } = useContext(ShowProductContext)
  const [saleStats, setSaleStats] = useState(0);
  const [salePurchase, setSalePurchase] = useState(0);

  useEffect(() => {
    const fetchSaleStats = async () => {
      try {
        const response = await get(`/sale?productId=${selectedProduct._id}`)
        const resSaleStats  = response.data.success
        const qtyInAllSales = resSaleStats.map(sale => {
          return sale.LineSale.find(lineSale => lineSale.productId._id === selectedProduct._id)        
        })
        const sumQty = qtyInAllSales.reduce((acc, currVal) => acc + currVal.qty, 0)
        setSaleStats(sumQty)
      } catch { }
    }
    fetchSaleStats();
    const fetchPurchaseStats = async () => {
      try {
        const response = await get(`/purchase?productId=${selectedProduct._id}`)
        const resPurchaseStats  = response.data.success
        const qtyInAllPurchases = resPurchaseStats.map(sale => {
          return sale.LinePurchase.find(linePurchase => linePurchase.productId._id === selectedProduct._id)        
        })
        const sumQty = qtyInAllPurchases.reduce((acc, currVal) => acc + currVal.mainQty, 0)
        setSalePurchase(sumQty)
      } catch { }
    }
    fetchPurchaseStats();
  }, [selectedProduct])

  return (
    <div className="w-full grid grid-cols-3 gap-2 place-items-center my-4">
      <div className="text-center" title="les achats">
        <BiCartDownload className="text-red" style={{ fontSize: "100px" }} />
        <b>{salePurchase}</b>
      </div>
      <div className="text-center" title="les ventes">
        <HiArrowUpTray className="text-green" style={{ fontSize: "100px" }} />
        <b>{saleStats}</b>
      </div>
      <div className="text-center" title="en stock">
        <MdLocalGroceryStore
          className="text-yellow-600"
          style={{ fontSize: "100px" }}
        />
        {/* <b>{salePurchase - saleStats}</b> */}
        <b>{selectedProduct?.qty}</b>
      </div>
    </div>
  );
};

export default StatisticProducts;
