import React, { useContext } from "react";
import { DashBoadContext } from '../../pages/Dashboard';

const FilterByDate = () => {
  const { day, setDay, month, setMonth, year, setYear } = useContext(DashBoadContext);

  return (
    <div className="w-full mx-2 flex justify-between px-12 mb-2">
      <section>
        <label htmlFor="day" className="text-gray-700 font-bold mr-2">
          Jour
        </label>
        <select
          id="day"
          className="shadow rounded border px-3 py-2 focus:outline-none"
          onChange={(e) => setDay(e.target.value)}
          value={day}
        >
          <option value="">Tous les jours</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
      </section>
      <section>
        <label htmlFor="month" className="text-gray-700 font-bold mr-2">
          Mois
        </label>
        <select
          id="month"
          className="shadow rounded border px-3 py-2 focus:outline-none"
          onChange={(e) => setMonth(e.target.value)}
          value={month}
        >
          <option value="">Tous les mois</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>
      </section>
      <section>
        <label htmlFor="year" className="text-gray-700 font-bold mr-2">
          Année
        </label>

        <select
          id="year"
          className="shadow rounded border px-3 py-2 focus:outline-none"
          onChange={(e) => setYear(e.target.value)}
          value={year}
        >
          <option value="">Tous les ans</option>
          {Array.from({ length: 2 }, (_, i) => i + 2023).map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </section>
    </div>
  );
};

export default FilterByDate;

// const { sales } = useSelector(state => state.sales)
// const [yearOfSale, setYearOfSale] = useState([]);

// useEffect(() => {
//   const data = sales.reduce((acc, curr) => {
//     const key = (new Date(curr.createdAt)).getFullYear();
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(curr);
//     return acc;
//   }, {})
//   setYearOfSale(data)
// }, [sales])
// {/* {Object.keys(yearOfSale).map((date, index) => <option key={index}>{date}</option>)} */}
