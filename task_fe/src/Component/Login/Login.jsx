import { KeyOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, message, Modal } from "antd";
import style from "./style.module.css";
import React, { useContext, useState } from "react";
import axios from "axios";
import { url, UserContext } from './../../Static';

export default function Login({ visible }) {
  const [load, setLoad] = useState(false);
  const user = useContext(UserContext);

  const Finish = (data) =>{
    setLoad(true);
    axios.post(url + 'login', data)
    .then(({data})=>{
      if(data.status === 'error'){
        message.error(data.message)
      }else{
        user.set(data.data);
        visible[1](false);
      }
    }).catch(e=>message.error(e))
    .finally(()=>setLoad(false))
  }
  
  return (
    <Modal className={style.modal} closable={false} visible={visible[0]} footer={false}>
      <div className={style.formLayout}>
        <div className={style.avata}>
          <UserOutlined />
        </div>

        <div className={style.form}>
          <div className={style.title}>Login Account</div>
          <Divider orientation="center">Welcome back</Divider>
          <Form onFinish={Finish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter the email field" },
                {
                  type: "email",
                  message: "Incorrect email format. eg: example@gmail.com",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email ID"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter the password field" },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item style={{marginTop: '3rem'}}>
              <Button loading={load} htmlType="submit" icon={<LoginOutlined/>} block size="large" type="primary" shape="round">SIGN IN</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
