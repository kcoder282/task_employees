import { CalendarOutlined, CheckOutlined, ClockCircleOutlined, CloseOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words';
import { url, UserContext } from '../../Static'
import { Input } from 'antd';
import style from './style.module.css'
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';

export default function Task() {
  const user = useContext(UserContext);
  const [idConfirm, setIdConfirm] = useState();
  const [data, setData] = useState();
  const [loadStatus, setLoadStatus] = useState();
  const ChangeStatus = ({ id, status }) => {
    status = status === 'new' ? 'received' : status === 'received' ? 'processing' : 'complete';
    setLoadStatus(id);
    axios.put(url + `task/${id}?_token=` + user.get._token, { status: status })
      .then(({ data }) => {
        if (data.status === 'error') {
          message.error(data.message)
        } else message.success(data.message)
      }).finally(() => {
        setLoadStatus();
        setIdConfirm();
      })
  }
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
  useEffect(() => {
    if ( loadStatus === undefined) {
      axios.get(url + 'task?_token=' + user.get._token)
        .then((result) => {
          setData(result.data.map(e => ({ key: e.id, ...e })));
         
        })
    }

  }, [user.get._token, loadStatus])
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
      <div style={dataIndex === 'task_name'?({fontWeight: 'bold'}):{}}>{
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
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{ overflow: 'auto', marginTop: '3rem' }}>
        <Table loading={data === undefined} bordered style={{ maxWidth: '1200px', minWidth: '1200px', marginTop: '1rem' }}
          dataSource={data}>
          <Column width='100px' align='center' fixed='left' defaultFilteredValue={['new', 'processing']} onFilter={(value, item) => {
            if (value === 'processing')
              return item.status === value || item.status === 'received';
            return item.status === value
          }} filters={[{ text: 'New', value: 'new' }, { text: 'Processing', value: 'processing' }, { text: 'Complete', value: 'complete' }]} title='Status' render={e =>
            e.status !== 'complete' ?
              <Popconfirm onCancel={setIdConfirm} okButtonProps={{ loading: loadStatus === e.id }}
                onConfirm={() => ChangeStatus(e)}
                title={e.status === 'new' ? 'to Received' : e.status === 'received' ? 'to Processing' : 'to Complete'}
                visible={idConfirm === e.id}>{
                  e.status === 'new' ?
                    <Button title='New' size='small' type='text' style={{ background: '#ffc107', color: '#fff' }} onClick={() => setIdConfirm(e.id)} icon={<StarOutlined />}></Button> :
                    <Button title='Processing' size='small' type='primary' onClick={() => setIdConfirm(e.id)} icon={<ClockCircleOutlined />} color='#007bff'></Button>
                }</Popconfirm>
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
                          <div><ClockCircleOutlined/> {e.percent.toFixed(2)}%</div>
                        </div>
                        <div><CalendarOutlined /> {e.number_date}days (max {e.number_date_max}days)</div>
                      </>
                      : ''} />
          <Column sorter={(a, b) => a.name >= b.name ? 1 : -1} title="Created by"
            dataIndex='created_by' render={(e) =>
              <>
                <div style={{ fontWeight: 'bold' }}><UserOutlined /> {e.full_name}</div>
                <small style={{ color: '#0005' }}>{e.email}</small>
              </>} />
          <Column title="Start date" dataIndex="start" sorter={(a, b) => a.start > b.start ? 1 : -1} />
          <Column title="End date" dataIndex="target" sorter={(a, b) => a.target > b.target ? 1 : -1} />
        </Table>
      </div>
    </div>
  )
}
