import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/login/apiCalls";
import { hideMsg } from "../functions/functions";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, isFetching, error } = useSelector((state) => state.login);

  const [errors, setErrors] = useState([])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, {
        username,
        password,
      });
    } catch (err) {
      setErrors([err.response?.data])
    }
  };
  
  useEffect(() => {
    if (userData) {
      navigate("/", { replace: true });
    } else if (error) {
      const arrError = []
      arrError.push(error)
      setErrors(arrError)
    }
  }, [userData, error, navigate]);

  return (
    <div className="mt-5">
      <div className="grid justify-items-center ">

        <div >
          <img
            src="/assets/logo.jpeg"
            alt="logo"
            style={{ height: "300px", width: "100%" }}
          />
          <form className="mt-2" onSubmit={handleLogin}>
            <div className="mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="usernmae"
                name="username"
                placeholder="Username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="mb-2 w-full bg-green text-white p-2 rounded"  disabled={isFetching}>
              Connecter
            </button>
          </form>
          {errors && errors?.map((err, index) => (
            <div key={index} className="bg-red-400 text-white p-2 rounded" onClick={(e) => hideMsg(e, errors, setErrors)}>{err}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
