import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login/Login";
export default function App() {
  const [user, setUser] = useState();

  return (
      <Routes>
        <Route path="/" element={user?"Home":<Navigate to='/login'/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
  );
}
