import React, { useContext, useEffect, useState } from "react";
import { get } from "../../../requestMethods";
import { useSelector } from "react-redux";
import { ShowSalesContext } from "../ShowSales";

const CustomerInformation = () => {
  const [listClients, setListClients] = useState([]);

  const {
    setClientId, setAmountPayed, amountPayed,
    showInfo,
    setShowInfo,
    name,
    setName,
    checkTotal,
    setCheckTotal,
    checkPartiel,
    setCheckPartiel,
    clientDataToEdit,
  } = useContext(ShowSalesContext);

  const handleChangeClient = async (e) => {
    const nom = e.target.value;
    setName(nom);
    if (nom.length !== 0 && nom[nom.length - 1] !== "/") {
      const response = await get(`/client?search=${nom}`);
      if (response) {
        setListClients(response.data.success);
      }
    } else {
      setListClients([]);
      setClientId("");
    }
  };

  const { cart } = useSelector((state) => state.cart);

  const chooseClient = (client) => {
    setClientId(client._id);
    setName(client.name);
    setListClients([]);
  };

  useEffect(() => {
    setAmountPayed("");
    const totalCart = cart.reduce(
      (acc, currVal) => acc + currVal.qtyNeeded * currVal.price,
      0
    );
    if (clientDataToEdit?.clientId?._id) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
    if (Object.keys(clientDataToEdit || {}).length > 0) {
      if (clientDataToEdit?.amountPayed === totalCart) {
        setCheckTotal(true);
        setCheckPartiel(false);
      } else {
        setCheckPartiel(true);
        setCheckTotal(false);
      }
      setAmountPayed(clientDataToEdit?.amountPayed);
      if (clientDataToEdit?.clientId?.name) {
        setName(clientDataToEdit?.clientId?.name);
        setClientId(clientDataToEdit?.clientId._id);
      } else {
        setName("");
        setClientId("");
      }
    } else {
      setCheckPartiel(false);
      setCheckTotal(true);
      setName("");
      setClientId("");
      setAmountPayed(totalCart);
    }
  }, [
    cart,
    setAmountPayed,
    clientDataToEdit,
    setShowInfo,
    setCheckPartiel,
    setClientId,
    setName,
    setCheckTotal,
  ]);

  const handleCheckTotal = () => {
    setCheckTotal(true);
    setCheckPartiel(false);
    setAmountPayed(
      cart.reduce((acc, currVal) => acc + currVal.qtyNeeded * currVal.price, 0)
    );
  };

  const handleCheckPartiel = () => {
    setCheckPartiel(true);
    setCheckTotal(false);
    setAmountPayed(0);
  };

  return (
    <div>
      <input
        type="checkbox"
        id="clientName"
        checked={showInfo}
        onChange={() => setShowInfo(!showInfo)}
      />{" "}
      <label htmlFor="clientName" className="text-gray-700 font-bold">
        Information du client
      </label>
      {showInfo && (
        <>
          <label htmlFor="name" className="block text-gray-700 font-bold">
            Nom
          </label>
          <input
            type="text"
            placeholder="Nom du client"
            className="shadow border rounded w-full px-3 py-2 focus:outline-none focus:shadow-outline"
            value={name}
            onChange={handleChangeClient}
          />
          {listClients.length > 0 && (
            <div className="listClient mt-1">
              {listClients.map((client) => (
                <p
                  key={client._id}
                  className="p-1 bg-blue-600 text-white rounded w-full mb-1 hover:bg-white hover:text-blue-600"
                  onClick={() => chooseClient(client)}
                >
                  {client.name} - {client.phone}
                </p>
              ))}
            </div>
          )}
          <input
            type="radio"
            name="montantPayed"
            id="total"
            checked={checkTotal}
            onChange={handleCheckTotal}
            onClick={handleCheckTotal}
          />{" "}
          <label htmlFor="total" className="total">
            Total
          </label>
          <br />
          <input
            type="radio"
            name="montantPayed"
            id="partiel"
            checked={checkPartiel}
            value={checkPartiel}
            onChange={handleCheckPartiel}
            onClick={handleCheckPartiel}
          />{" "}
          <label htmlFor="partiel" className="partiel">
            Partiel
          </label>
          {checkPartiel && (
            <input
              type="number"
              placeholder="Donner le montant"
              className="block w-full px-3 py-2 border shadow rounded focus:outline-none"
              value={amountPayed}
              onChange={(e) => setAmountPayed(e.target.value)}
            />
          )}
          <hr className="w-full h-1 my-5" />
        </>
      )}
    </div>
  );
};

export default CustomerInformation;
