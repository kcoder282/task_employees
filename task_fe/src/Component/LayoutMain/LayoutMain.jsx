import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import style from "./style.module.css";
import { Badge, Button, Dropdown } from "antd";
import { FieldTimeOutlined, IdcardOutlined, LineChartOutlined, LogoutOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { setKey, UserContext } from "../../Static";
import { Link } from "react-router-dom";

export default function LayoutMain({ children, setModal }) {

  const user = useContext(UserContext)

  const active_logout = () =>{
    setKey('');
    user.set({});
    setModal(true);
  }
  const ShowData =
    <div>
      <Badge.Ribbon text={user.get.role === 'admin'? 'ADMIN':'EMPLOYEE'} style={{ top: '-.75rem' }} color={user.get.role === 'admin'? 'gold':'cyan'}>
        <div className={style.info_show}>
          <div style={{ marginBottom: '1rem' }}>Welcome, <strong>{user.get.full_name}</strong>!</div>
          <div className={style.list}>
            {user.get.role === 'admin' ?
              <>
                <div> <Link to="employees"><IdcardOutlined style={{ marginRight: '.25rem' }} />Employee Management </Link> </div>
                <div> <Link to="employees"><LineChartOutlined style={{ marginRight: '.25rem' }} />Manage assigned tasks </Link> </div>
                <hr />
              </> : ''}
            <div><FieldTimeOutlined style={{ marginRight: '.25rem' }} />Task Management</div>
            <div><UserSwitchOutlined style={{ marginRight: '.25rem' }} />Update personal information</div>
            <div onClick={active_logout} style={{ color: '#d00' }}><LogoutOutlined style={{ marginRight: '.25rem' }} /> Logout </div>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  return (
    <div className={style.layout}>
      <div className={style.header}>
        <div>
          <FontAwesomeIcon icon={faCubes} /> Task Manager
        </div>
        <Dropdown trigger={['click']} placement="bottomRight" overlay={user.get.id ? ShowData : ''}>
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={<UserOutlined />}>
          </Button>
        </Dropdown>
      </div>
      <div className={style.body}>{children}</div>
      <div className={style.footer}>Copyright © 2022 - Created by Thanh Khan</div>
    </div>
  );
}
