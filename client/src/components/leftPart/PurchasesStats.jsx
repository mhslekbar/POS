import React, { useContext, useEffect } from "react";
import { DashBoadContext } from '../../pages/Dashboard';
import { getPurchase } from "../../redux/purchases/purchaseApiCalls";
import { useDispatch, useSelector } from "react-redux";

const PurchasesStats = () => {
  const { purchases } = useSelector((state) => state.purchases);
  const { sumPurchases, setSumPurchases, day, month, year, sumLineDetails } = useContext(DashBoadContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTotalPurchase = async () => {
      await dispatch(getPurchase(`?filterDay=filterDay&day=${day}&month=${month}&year=${year}`));
    };
    fetchTotalPurchase();
  }, [dispatch, day, month, year]);

  useEffect(() => {
    const arrPurchases = purchases.map((purchase) =>
      purchase.LinePurchase.reduce(
        (acc, currVal) => acc + currVal.total_price,
        0
      )
    );
    const newSumPurchases = arrPurchases.reduce((acc, curr) => acc + curr, 0);
    setSumPurchases(newSumPurchases);
  }, [purchases, sumPurchases, setSumPurchases]);

  return (
    <div className="space-y-6 w-full items-center justify-center flex flex-col">
      <span className="p-4 bg-white rounded-full  items-center justify-center ">
        <img className="w-14" src="/assets/imgs/customer.png" alt="" />
      </span>
      <span className="items-center justify-center flex flex-col">
        <h2>Total achats</h2>
        <b className="font-bold text-xl">{sumLineDetails} MRU</b>
      </span>
    </div>
  );
};

export default PurchasesStats;
