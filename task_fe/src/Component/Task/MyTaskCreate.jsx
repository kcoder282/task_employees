import { BlockOutlined, CalendarOutlined, CheckOutlined, ClockCircleOutlined, CloseOutlined, SearchOutlined, StarOutlined, PlusOutlined, EditFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal, Select, Space, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words';
import { url, UserContext } from '../../Static'
import { Input } from 'antd';
import style from './style.module.css'
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';

export default function MyTaskCreate() {
    const user = useContext(UserContext);
    const [data, setData] = useState();
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
    const [loadAdd, setLoadCreate] = useState(false);
    const [form] = Form.useForm();
    const CreateTask = (dataForm) =>{
        dataForm.task_for = dataForm.task_for.split(' - ')[0];
        setLoadCreate(true);
        axios.post(url + 'task?_token=' + user.get._token, { start: dataForm.date[0], target: dataForm.date[1], ...dataForm })
            .then(({ data }) => {
                if (data.status === 'error') message.error(data.message);
                else {
                    setShowTaskAdd(false);
                    setLoadCreate(false);
                    form.resetFields();
                    message.success(data.message);
                }
            }).catch(() => {
                message.error("Server error");
            }).catch(() => setLoadCreate(false))
    }
    const [showTaskAdd, setShowTaskAdd] = useState(false)

    useEffect(() => {
        if( showTaskAdd === false ){
            axios.get(url + 'task_for?_token=' + user.get._token)
            .then((result) => {
                setData(result.data.map(e => ({ key: e.id, ...e })));
            })
        }
    }, [showTaskAdd, user.get._token])

    const getColumnSearchProps = (dataIndex, value) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${value}`}
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
            <div style={dataIndex === 'task_name' ? ({ fontWeight: 'bold' }) : {}}>{
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
                ) : text
            }</div>
    });

    const [listUser, setListUser] = useState([]);

    useEffect(() => {
      if(showTaskAdd===true)
      {
          axios.get(url + 'employees?_token=' + user.get._token)
          .then(({data}) => {
              setListUser(data.filter(e=>e.id !== user.get.id).map(e => ({ id: e.id, full_name: e.full_name, email: e.email })));
          })
      }
    }, [showTaskAdd, user.get._token, user.get.id])
    
    return (
        <div style={{ paddingTop: '3rem', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ overflow: 'auto', width: '100%', maxWidth: '1250px' }} className={style.Header}>
                <Button onClick={()=>setShowTaskAdd(true)} type='primary' size='middle' icon={<BlockOutlined />} >Add Task</Button>
            </div>
            <div style={{ overflow: 'auto', width: '100%', maxWidth: '1250px' }}>
                <Table loading={data === undefined} bordered style={{ maxWidth: '1200px', minWidth: '1200px', marginTop: '1rem' }}
                    dataSource={data}>
                    <Column width='100px' align='center' fixed='left' defaultFilteredValue={['new', 'processing']} onFilter={(value, item) => {
                        if (value === 'processing')
                            return item.status === value || item.status === 'received';
                        return item.status === value
                    }} filters={[{ text: 'New', value: 'new' }, { text: 'Processing', value: 'processing' }, { text: 'Complete', value: 'complete' }]} title='Status' render={e =>
                        e.status !== 'complete' ?
                            e.status === 'new' ?
                                <Button title='New' size='small' type='text' style={{ background: '#ffc107', color: '#fff' }} icon={<StarOutlined />}></Button> :
                                <Button title='Processing' size='small' type='primary' icon={<ClockCircleOutlined />} color='#007bff'></Button>
                            : <Button title='Completed' size='small' type='text' style={{ background: '#28a745', color: '#fff' }} icon={<CheckOutlined />} />
                    } />
                    <Column {...getColumnSearchProps('task_name')} dataIndex='task_name' title="Task name" />
                    <Column {...getColumnSearchProps('task_content')} dataIndex='task_content' title="Content" />

                    <Column title="Activate" render={e =>
                        e.status === "received" ?
                            <Tag color='gold'>Begin: {e.start}</Tag> :
                            e.status === 'new' ?
                                <Tag color='#ffc107' icon={<StarOutlined />}>New</Tag> :
                                e.status === 'complete' ?
                                    <Tag title={'Completed: ' + e.completed} icon={<CheckOutlined />}>{e.completed}</Tag> :
                                    e.number_late !== undefined ?
                                        <Tag color='#f00' icon={<CloseOutlined />}>Late ({e.number_late}d)</Tag> :
                                        e.status === 'processing' ?
                                            <>
                                                <div className={style.content_range}>
                                                    <div className={style.range}>
                                                        <div style={{ width: `${e.percent}%`, background: returnColor(e.percent) }} className={style.percent} />
                                                    </div>
                                                    <div><ClockCircleOutlined /> {e.percent.toFixed(2)}%</div>
                                                </div>
                                                <div><CalendarOutlined /> {e.number_date}days (max {e.number_date_max}days)</div>
                                            </>
                                            : ''} />
                    <Column sorter={(a, b) => a.name >= b.name ? 1 : -1} title="Task for"
                        dataIndex='for' render={(e) =>
                            <>
                                <div style={{ fontWeight: 'bold' }}><UserOutlined /> {e.full_name}</div>
                                <small style={{ color: '#0005' }}>{e.email}</small>
                            </>} />
                    <Column title="Start date" dataIndex="start" sorter={(a, b) => a.start > b.start ? 1 : -1} />
                    <Column title="End date" dataIndex="target" sorter={(a, b) => a.target > b.target ? 1 : -1} />
                </Table>
            </div>
            <Modal title={<><BlockOutlined/> Add new Task</>} visible={showTaskAdd} footer={false} closeIcon={<CloseOutlined onClick={()=>setShowTaskAdd(false)}/>}>
                <Form form={form}  onFinish={CreateTask}>
                    <Form.Item name='task_name' rules={[{ required: true, message: 'Task name required' }]}><Input maxLength="128" showCount prefix={<BlockOutlined />} placeholder='Task Name' /></Form.Item>
                    <Form.Item name='task_content' rules={[{ required: true, message: 'Request task content' }]}><Input maxLength="128" showCount prefix={<EditFilled />} placeholder='Content' /></Form.Item>
                    <Form.Item name='task_for' rules={[{ required: true, message: 'Request task for' }]}>
                        <Select showSearch placeholder='Choose employee'>
                        {listUser.map(e=>
                            <Select.Option value={`${e.id} - ${e.full_name} - ${e.email}`} key={e.id}>
                                <strong>{e.full_name}</strong>
                                <div style={{color: '#0005', fontSize: '.8rem'}}>{e.email}</div>
                            </Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name='date' rules={[{ required: true, message: 'Request time work' }]}><DatePicker.RangePicker style={{width: '100%'}} /></Form.Item>
                    <Button loading={loadAdd} htmlType='submit' type='primary' block icon={<PlusOutlined />}> Create new Task</Button>
                </Form>
            </Modal>
        </div>
    )
}
