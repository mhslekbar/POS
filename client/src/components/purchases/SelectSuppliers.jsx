import React, { useEffect, useState } from "react";
import { get } from "../../requestMethods";
import { useSelector } from "react-redux";

const SelectSuppliers = ({ supplierId, setSupplierId, checkedTotalAmount,
   setCheckedTotalAmount, setCheckedPartielAmount, setPartielAmount,
   partielAmount, showPartielAmount,setShowPartielAmount, checkedPartielAmount, 
   purchaseId, numPurchase, typeEvent
  }) => {
  const [suppliers, setSuppliers] = useState([]);

  const { purchases } = useSelector(state => state.purchases)

    useEffect(() => {
      if(typeEvent === "Edit") {        
        const [ thisPurchase ] = purchases.filter(p => p.numPurchase === numPurchase)
        const thisSupplier  = thisPurchase.supplier.supplierId
        setSupplierId(thisSupplier)
        const montantPayed = thisPurchase.supplier.amountPayed
        if(montantPayed > 0) {
          setCheckedTotalAmount(false)
          setCheckedPartielAmount(true)
          setPartielAmount(montantPayed)
          setShowPartielAmount(true)
        }

      }
    }, [typeEvent, purchases, purchaseId, numPurchase, setSupplierId, setPartielAmount, setCheckedPartielAmount, setCheckedTotalAmount, setShowPartielAmount])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await get("/supplier");
      setSuppliers(res.data.success);
    };
    fetchSuppliers();
  }, []);

  return (
    <React.Fragment>
      <div className="mb-2">
        <label htmlFor="supplier" className="block font-bold text-gray-700">
          Fournisseur
        </label>
        <select
          id="supplier"
          className="w-full shadow rounded border px-3 py-2 focus:outline-none focus:shadow-outline"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          <option value="">Choisir fournisseur</option>
          {suppliers.map((supplier) => (
            <option 
              key={supplier._id}
              value={supplier._id}
            >
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <p className="font-bold text-gray-700">Montant Payé</p>
        <input
          type="radio"
          id="total"
          name="montantPayer"
          checked={checkedTotalAmount}
          onChange={() => {
            setCheckedTotalAmount(true);
            setCheckedPartielAmount(false);
            setPartielAmount("");
          }}
        />{" "}
        <label
          htmlFor="total"
          className="font-bold text-gray-700"
          onClick={() => setShowPartielAmount(false)}
        >
          total
        </label>{" "}
        <br />
        <input
          type="radio"
          id="partiel"
          name="montantPayer"
          checked={checkedPartielAmount}
          onChange={() => {
            setCheckedTotalAmount(false);
            setCheckedPartielAmount(true);
          }}
        />{" "}
        <label
          htmlFor="partiel"
          className="font-bold text-gray-700"
          onClick={() => setShowPartielAmount(true)}
        >
          partiel
        </label>
        {showPartielAmount && (
          <input
            type="text"
            placeholder="Donner le montant partiel"
            className="w-full shadow borderd rounded focus:outline-none focus:shadow-outline px-3 py-2"
            value={partielAmount}
            onChange={(e) => setPartielAmount(e.target.value)}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default SelectSuppliers;
