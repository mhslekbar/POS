import React, { useContext, useEffect } from "react";
import { DashBoadContext } from "../../pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../redux/sales/salesApiCalls";

const SalesStats = () => {
  const { sales } = useSelector((state) => state.sales);
  const dispatch = useDispatch();

  const { sumSales, setSumSales, setSumLineDetails, day, month, year } =
    useContext(DashBoadContext);

  useEffect(() => {
    const fetchTotalSales = async () => {
      await dispatch(
        getSales(`?filterDay=filterDay&day=${day}&month=${month}&year=${year}`)
      );
    };
    fetchTotalSales();
  }, [dispatch, day, month, year]);

  useEffect(() => {
    const arrSales = sales.map((sale) =>
      sale.LineSale.reduce(
        (acc, currVal) => acc + currVal.qty * currVal.price,
        0
      )
    );
    const newSumSales = arrSales.reduce((acc, curr) => acc + curr, 0);
    setSumSales(newSumSales);
    const lineDetails = sales.map((sale) =>
      sale.LineSale.map((lineSale) =>
        lineSale.LineDetails.reduce(
          (acc, currVal) => acc + currVal.qty * currVal.buy_price,
          0
        )
      )
    );
    const arrOfTotal = lineDetails.map((ln) =>
      ln.reduce((accVal, currVal) => accVal + currVal, 0)
    );
    const sumTotal = arrOfTotal.reduce(
      (accVal, currVal) => accVal + currVal,
      0
    );
    setSumLineDetails(sumTotal);
  }, [sales, setSumLineDetails, setSumSales]);

  return (
    <div className="space-y-6 w-full items-center justify-center flex flex-col">
      <span className="p-4 bg-white rounded-full  items-center justify-center ">
        <img className="w-14" src="/assets/imgs/sales.png" alt="" />
      </span>
      <span className="items-center justify-center flex flex-col">
        <h2>Total ventes</h2>
        <b className="font-bold text-xl">{sumSales} MRU</b>
      </span>
    </div>
  );
};

export default SalesStats;
