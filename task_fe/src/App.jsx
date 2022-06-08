import { message } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Employees from "./Component/Employees/Employees";
import LayoutMain from "./Component/LayoutMain/LayoutMain";
import Login from "./Component/Login/Login";
import Task from "./Component/Task/Task";
import { key, url, UserContext } from "./Static";
import MyTaskCreate from './Component/Task/MyTaskCreate';
export default function App() {
  const [modal, setModal] = useState(false);
  const {set} = useContext(UserContext);

  useEffect(() => {
    axios.get(url + 'login?_token=' + key())
    .then(e=>{
      if(e.data.status === 'success'){
        set(e.data.data);
        message.success(['Welcome back, ', <strong>{e.data.data.full_name}</strong>])
      }else{ setModal(true) }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <LayoutMain setModal={setModal}>
        <Routes>
          <Route path="/" element={<Task/>} />
          <Route path="/employees" element={<Employees/>} />
          <Route path="/task_for" element={<MyTaskCreate />} />
        </Routes>
      </LayoutMain>
      <Login visible={[modal, setModal]} />
    </>
  );
}
