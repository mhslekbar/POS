import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyRoutes from "./routes/MyRoutes";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";

const App = () => {
  const { userData } = useSelector((state) => state.login);

  if (!userData) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <div>
          <Header />
          <div className="w-full min-h-[90vh] grid grid-cols-12 h-[800px]">
            <Navbar />
            <MyRoutes />
          </div>
        </div>
      </Router>
    );
  }
};

export default App;

/***
  return (
    <Router>
      {userData && (
        <div>
          <Header />
          <div className="w-full min-h-[90vh] grid grid-cols-12">
            <Navbar />
              <MyRoutes />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  ); 

*/
