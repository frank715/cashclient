import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import MainHome from "./components/MainHome";
import GameMain from "./components/GameMain"
import { Layout } from "./components/Layout";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainHome />} />
              <Route path="/user/gameMain" element={<GameMain />} />
            </Route>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
