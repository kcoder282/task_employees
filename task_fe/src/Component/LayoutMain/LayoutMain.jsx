import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import style from "./style.module.css";
import { Button, Dropdown } from "antd";
import { UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { UserContext } from "../../Static";

export default function LayoutMain({ children }) {
  
  const user = useContext(UserContext)

  const ShowData =
    <div className={style.info_show}>
      <div>Welcome, <strong>{user.get.full_name}</strong></div>
      <div className={style.list}>
        <div><UserSwitchOutlined style={{marginRight: '.25rem'}} />Employee Management</div>
        <div><UserSwitchOutlined style={{marginRight: '.25rem'}} />Update personal information</div>
      </div>
    </div>
  return (
      <div>
        <div className={style.header}>
          <div>
            <FontAwesomeIcon icon={faCubes} /> Task Manager
          </div>
          <Dropdown trigger={['click']} placement="bottomRight" overlay={user?.get?.id?ShowData:''}>
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={<UserOutlined />}>
            </Button>
          </Dropdown>
        </div>
      </div>
  );
}
