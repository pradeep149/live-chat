import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import LiveVideoStream from "./pages/Home";
const App = () => {
  return (
    <div>
      <ToastContainer />
      <div>
        <Routes>
          <Route path="/" element={<LiveVideoStream />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
