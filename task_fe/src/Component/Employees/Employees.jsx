import { Badge, Button, Popconfirm, Space, Table, Tag, Input, message } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useState, useEffect, useRef, useContext } from 'react'
import style from './style.module.css';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { url, UserContext } from '../../Static';
import { UserOutlined, EditOutlined, DeleteOutlined, StarOutlined, LockOutlined, StarFilled, UnlockOutlined, UserAddOutlined, BlockOutlined, SearchOutlined } from '@ant-design/icons';
import EmplopyeeCreate from './Create/EmplopyeeCreate';
import EmployeesModify from './Modify/EmployeesModify';
import TaskAdminView from './../Task/TaskAdminView';

export default function Employees() {
    const user = useContext(UserContext);
    const [data, setData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showTask, setShowTask] = useState(0);
    const [showEdit, setShowEdit] = useState(0);
    const [idLoadDelete, setIdLoadDelete] = useState(0);
    const [showLoadDelete, setShowLoadDelete] = useState(0);
    const [idLoadChangeState, setIdLoadChangeState] = useState(0);
    const [showLoadChangeState, setShowLoadChangeState] = useState(0);
    const [idLoadChangeRole, setIdLoadChangeRole] = useState(0);
    const [showLoadChangeRole, setShowLoadChangeRole] = useState(0);

    useEffect(() => {
        if (showModal === false && showEdit === 0 && showTask === 0) {
            axios.get(url + 'employees?_token=' + user.get._token)
                .then(({ data }) => {
                    setData(data)
                })
        }
    }, [showEdit, showModal, user.get._token, showTask])
    const DeleteRow = (id) => {
        setIdLoadDelete(id)
        axios.delete(url + `employees/${id}?_token=` + user.get._token)
            .then(({ data }) => {
                if (data.status === 'error') message.error(data.message);
                else {
                    setData((list) => list.filter(e => e.id !== id))
                    setShowLoadDelete(0)
                    message.success(data.message)
                }
            }).catch(e => { message.error("Server error") })
            .finally(() => setIdLoadDelete(0))
    }
    const ChangeState = (id) => {
        setIdLoadChangeState(id)
        axios.get(url + `employees/status/${id}?_token=` + user.get._token)
            .then(({ data }) => {
                if (data.status === 'error') message.error(data.message);
                else {
                    setData(list => list.map(e => {
                        if (e.id === id)
                            e.status = e.status === 'inactive' ? 'active' : 'inactive'
                        return e;
                    }))
                    setShowLoadChangeState(0)
                    message.success(data.message)
                }
            }).catch(e => { message.error("Server error") })
            .finally(() => setIdLoadChangeState(0))
    }
    const ChangeRole = (id) => {
        setIdLoadChangeRole(id)
        axios.get(url + `employees/role/${id}?_token=` + user.get._token)
            .then(({ data }) => {
                if (data.status === 'error') message.error(data.message);
                else {
                    setData(list => list.map(e => {
                        if (e.id === id)
                            e.role = e.role === 'admin' ? 'employees' : 'admin'
                        return e;
                    }))
                    setShowLoadChangeRole(0)
                    message.success(data.message)
                }
            }).catch(e => { message.error("Server error") })
            .finally(() => setIdLoadChangeRole(0))
    }

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    return (
        <div style={{ paddingTop: '3rem', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ overflow: 'auto', width: '100%', maxWidth: '1250px' }} className={style.Header}>
                <Button onClick={() => setShowModal(true)} type='primary' size='middle' icon={<UserAddOutlined />} >Add employee</Button>
            </div>
            <div style={{ overflow: 'auto', width: '100%', maxWidth: '1250px' }}>
                <Table loading={data === undefined}
                    dataSource={data?.map((e) => ({ key: e.id, ...e })).filter(e => e.id !== user.get.id)}
                    style={{ minWidth: '1200px' }}>
                    <Column align='center'
                        sorter={(a, b) => a.amount_work < b.amount_work ? 1 : -1}
                        fixed='left' title="Tool" render={(e) =>
                            <Space size={3}>
                                <Button onClick={() => setShowEdit(e.id)} size='small' icon={<EditOutlined />} type='primary' />
                                <Popconfirm placement='right' visible={e.id === showLoadDelete} title={<>Do you want to delete user.</>}
                                    okText={'Delete'} onConfirm={() => DeleteRow(e.id)}
                                    okButtonProps={{ danger: true, icon: <DeleteOutlined />, loading: idLoadDelete === e.id }}
                                    onCancel={() => setShowLoadDelete(0)}>
                                    <Button size='small' title='Delete user' onClick={() => setShowLoadDelete(e.id)} danger icon={<DeleteOutlined />} type='primary' />
                                </Popconfirm>
                                <Badge count={e.amount_work} style={{ zIndex: 300 }}>
                                    <Button onClick={() => setShowTask(e.id)} size='small' title='' icon={<BlockOutlined />} type='primary' />
                                </Badge>
                            </Space>
                        } />
                    <Column title="Full name" {...getColumnSearchProps('full_name')} dataIndex='full_name' sorter={(a, b) => a.full_name > b.full_name ? 1 : -1} />
                    <Column title="Role" render={e =>
                        <Popconfirm visible={e.id === showLoadChangeRole}
                            onCancel={() => setShowLoadChangeRole(0)} title="Change role user"
                            onConfirm={() => ChangeRole(e.id)} okText="Change"
                            okButtonProps={{ icon: <UserOutlined />, loading: idLoadChangeRole === e.id }}>
                            {e.role === 'admin' ?
                                <Tag onClick={() => setShowLoadChangeRole(e.id)} style={{ width: '90px', cursor: 'pointer' }} color='#edad09' icon={<StarFilled />}>Admin</Tag> :
                                <Tag onClick={() => setShowLoadChangeRole(e.id)} style={{ width: '90px', cursor: 'pointer' }} icon={<UserOutlined />} color='#828282'>Employee</Tag>}
                        </Popconfirm>
                    } filters={[
                        { text: 'Admin', value: 'admin' },
                        { text: 'Employees', value: 'employees' }
                    ]} onFilter={(value, item) => item.role === value} />
                    <Column title="Sex" dataIndex='sex' render={(e) => <Tag style={{ textTransform: 'capitalize' }}>{e}</Tag>} filters={[
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' },
                        { text: 'Order', value: 'order' }
                    ]} onFilter={(value, item) => item.sex === value} />
                    <Column title="Date of birth" dataIndex='date_birth'
                    />
                    <Column title="Email" {...getColumnSearchProps('email')} dataIndex='email' />
                    <Column title="Started date" dataIndex='started_date' />
                    <Column title="End date" dataIndex='end_date' />
                    <Column title="Status" render={e =>
                        e.status !== 'inactive' ?
                            <Popconfirm placement='left' visible={e.id === showLoadChangeState} onCancel={() => setShowLoadChangeState(0)} title="Lock account" onConfirm={() => ChangeState(e.id)} okButtonProps={{ icon: <LockOutlined />, danger: true, loading: idLoadChangeState === e.id }} okText="Lock">
                                {
                                    e.status === 'new' ?
                                        <Tag onClick={() => setShowLoadChangeState(e.id)} style={{ width: '70px', cursor: 'pointer', }} icon={<StarOutlined />} color='#ffa600'>New</Tag> :
                                        <Tag onClick={() => setShowLoadChangeState(e.id)} style={{ width: '70px', cursor: 'pointer', }} icon={<UnlockOutlined />} color='#28a745'>Active</Tag>
                                }
                            </Popconfirm> :
                            <Popconfirm placement='left' visible={e.id === showLoadChangeState} onCancel={() => setShowLoadChangeState(0)} title="Unlock account" onConfirm={() => ChangeState(e.id)} okButtonProps={{ icon: <UnlockOutlined />, loading: idLoadChangeState === e.id }} okText="Unlock" >
                                <Tag onClick={() => setShowLoadChangeState(e.id)} style={{ width: '70px', cursor: 'pointer' }} icon={<LockOutlined />} color="#aa0000" >Locked</Tag></Popconfirm>
                    } onFilter={(e, item) => {
                        return e === item.status
                    }} filters={[
                        { text: 'New', value: 'new' },
                        { text: 'Active', value: 'active' },
                        { text: 'Locked', value: 'inactive' }]} />
                </Table>
            </div>
            <EmplopyeeCreate visible={[showModal, setShowModal]} />
            <EmployeesModify visible={[showEdit, setShowEdit]} />
            <TaskAdminView visible={[showTask, setShowTask]} />
        </div>
    )
}
