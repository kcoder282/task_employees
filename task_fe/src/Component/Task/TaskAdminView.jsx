import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Popover, Table, Tooltip, Tag, Space, Input, DatePicker, message } from 'antd';
import { CloseOutlined, BlockOutlined, ClockCircleOutlined, StarOutlined, CheckOutlined, 
    SearchOutlined, PlusOutlined, EditFilled } from '@ant-design/icons';
import { UserContext } from '../../Static';
import { url } from './../../Static';
import axios from 'axios';
import Column from 'antd/lib/table/Column';
import style from './style.module.css';
import { Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { Form } from 'antd';

export default function TaskAdminView({ visible }) {
    const user = useContext(UserContext);
    const [data, setData] = useState([]);
    const [pop, setPop] = useState(false);
    useEffect(() => {
        if (visible[0] !== 0 && pop === false ) {
            axios.get(url + 'task/' + visible[0] + '?_token=' + user.get._token)
                .then((result) => {
                    setData(result.data.map(e => ({ key: e.id, ...e })));
                })
        }
    }, [pop, user.get._token, visible])
    const returnColor = (percent) => {
        if (percent > 90) return '#ff0000';
        if (percent > 75) return '#fc6404';
        if (percent > 50) return '#fcd444';
        if (percent > 25) return '#8cc43c';
        return '#029658';
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
    const [loadCreate, setLoadCreate] = useState()
    const [form] = Form.useForm()
    const CreateTask = (dataForm) =>{
        setLoadCreate(true);
        axios.post(url + 'task?_token=' + user.get._token, {task_for: visible[0], start: dataForm.date[0], target: dataForm.date[1], ...dataForm})
        .then(({data}) => {
            if(data.status === 'error') message.error(data.message);
            else {
                message.success(data.message);
                form.resetFields();
                setPop(false);
            }
        }).catch(() => {
            message.error("Server error");
        }).finally(()=>setLoadCreate(false))
    }
    return (
        <Modal closeIcon={<CloseOutlined onClick={() => {
            if(pop === true) setPop(false)
            else visible[1](0);
        }} />}
            footer={false} visible={visible[0] !== 0} title={
                <span style={{ color: '#007bff' }}>
                    <BlockOutlined style={{ marginRight: '5px' }} />
                    List Task for Employee
                </span>
            }>
            <div style={{ overflow: 'auto' }}>
                <Popover visible={pop} placement='bottomLeft' title={<><BlockOutlined/> Create new Task</>} content={
                    <Form form={form} size='small' onFinish={CreateTask}>
                        <Form.Item name='task_name' rules={[{ required: true, message: 'Task name required'}]}><Input maxLength="128" showCount prefix={<BlockOutlined/>} placeholder='Task Name'/></Form.Item>
                        <Form.Item name='task_content' rules={[{ required: true, message: 'Request task content' }]}><Input maxLength="128" showCount prefix={<EditFilled />} placeholder='Content' /></Form.Item>
                        <Form.Item name='date' rules={[{ required: true, message: 'Request time work' }]}><DatePicker.RangePicker/></Form.Item>
                        <Button loading={loadCreate} htmlType='submit' type='primary' block icon={<PlusOutlined/>}> Create new Task</Button>
                    </Form>
                }>
                    <Button onClick={() => setPop(e=>!e)} size='small' type='primary' icon={<PlusOutlined />}>Add Task</Button>
                </Popover>
                <Table bordered style={{minWidth: '400px', marginTop: '1rem'}}  size='small' 
                    dataSource={data}>
                    <Column {...getColumnSearchProps('task_name')} dataIndex='task_name' title="Task name" />
                    <Column sorter={(a,b)=>a.name >= b.name ? 1: -1} title="Created by" dataIndex='created_by' render={(e) =>
                        <Tooltip title={e.email} style={{ display: 'flex', flexDirection: 'column' }}>
                            <small style={{ fontWeight: 'bold' }}>{e.full_name}</small>
                        </Tooltip>} />
                    <Column title="Activate" render={e =>
                        e.status === "received" ?
                            <Tag color='gold'>Begin: {e.start}</Tag>:
                        e.status === 'new'?
                            <Tag color='#ffc107' icon={<StarOutlined/>}>New</Tag>:
                        e.status === 'complete'?
                            <Tag title={'Completed: ' + e.completed} icon={<CheckOutlined/>}>{e.completed}</Tag>:
                        e.number_late !== undefined?
                            <Tag color='#f00' icon={<CloseOutlined/>}>Late ({e.number_late}d)</Tag>:
                        e.status === 'processing' ?
                            <Popover content={
                                <>
                                    <div><strong>Start: </strong>{e.start}</div>
                                    <div><strong>End: </strong>{e.target}</div>
                                    <div>{e.number_date}d (max {e.number_date_max}d)</div>
                                    <div style={{ color: returnColor(e.percent) }}><ClockCircleOutlined /> {e.percent.toFixed(2)}%</div>
                                </>}>
                                <div className={style.range}>
                                    <div style={{ width: `${e.percent}%`, background: returnColor(e.percent) }} className={style.percent} />
                                </div>
                            </Popover> :
                            <>
                            </>} />
                    <Column align='center' fixed='right' defaultFilteredValue={['new', 'processing']} onFilter={(value, item)=>{
                        if (value === 'processing')
                        return item.status === value || item.status === 'received';
                        return item.status === value
                    }} filters={[{ text: 'New', value: 'new' }, { text: 'Processing', value: 'processing' },{text: 'Complete', value:'complete' }]} title='Status' render={e => 
                        e.status !== 'complete' ?
                            e.status === 'new' ?
                            <Button title='New' size='small' type='text' style={{ background: '#ffc107', color: '#fff' }} icon={<StarOutlined />}></Button> :
                            <Button title='Processing' size='small' type='primary' icon={<ClockCircleOutlined />} color='#007bff'></Button>
                            : <Button title='Completed' size='small' type='text' style={{ background: '#28a745', color: '#fff'}} icon={<CheckOutlined/>}/>
                    } />
                </Table>
            </div>
        </Modal>
    )
}
