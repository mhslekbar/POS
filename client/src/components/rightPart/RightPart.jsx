import React, { useContext, useEffect, useState } from "react";
import BestProduct from "./BestProduct";
import { useDispatch, useSelector } from "react-redux";
import { DashBoadContext } from "../../pages/Dashboard";
import { getConsumptionsApi } from "../../redux/consumption/consApiCalls";

const RightPart = () => {
  const { sales } = useSelector((state) => state.sales);
  const { consumptions } = useSelector((state) => state.consumptions);
  const [sumConsumption, setSumConsumption] = useState(0);
  const [lineSale, setLineSale] = useState([]);
  const { day, month, year } = useContext(DashBoadContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = [];
    sales.map((sale) => sale.LineSale.map((ln) => data.push(ln)));
    setLineSale(data);
  }, [sales]);
  
  useEffect(() => {
    lineSale.filter((item, index, self) => self.findIndex((elem) => elem.productId._id === item.productId._id) === index)
  }, [lineSale])

  useEffect(() => {
    const fetchCons = async () => {
      await dispatch(
        getConsumptionsApi(
          `/?filterDay=filterDay&day=${day}&month=${month}&year=${year}`
        )
      );
    };
    fetchCons();
  }, [dispatch, day, month, year]);

  useEffect(() => {
    const total = consumptions.reduce((acc, curr) => acc + curr.amount, 0);
    setSumConsumption(total);
  }, [consumptions]);

  return (
    <div className="col-span-2 min-h-[90vh] border-r border-gray-200 items-center justify-start flex flex-col w-full">
      {/* START Right Top Section */}
      <div className="w-fit px-8 py-6 bg-[#cdc6f0] shadow-md my-2 mx-4 rounded text-center">
        <p className="text-xl block">CONSOMMATIONS</p>
        <p className="font-bold text-xl block">{sumConsumption} MRU</p>
      </div>
      {/* END Right Top Section */}
      {/* START Right Bottom Section */}
      <div className="w-full px-12 py-6">
        {" "}
        {/* items-start justify-start flex flex-col  */}
        <h1 className="font-bold text-xl text-center xl:text-2xl pb-2">
          Meilleures ventes
        </h1>
        {/* cdc6f0  9c88ff  */}
        <div className="w-full space-y-5 overflow-y-auto max-h-[350px] py-6 scrollbar-hide bg-[#cdc6f0] p-4 ml-4 rounded">
          {lineSale
            .slice(0, 10)
            .sort((a, b) => b.qty - a.qty)
            .filter((item, index, self) => self.findIndex((elem) => elem.productId._id === item.productId._id) === index)
            .map((item) => {
              return <BestProduct item={item} key={item._id} />;
            })}
        </div>
      </div>
      {/* END Right Bottom Section */}
    </div>
  );
};

export default RightPart;
