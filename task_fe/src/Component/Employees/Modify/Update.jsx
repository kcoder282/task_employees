import React, { useContext, useEffect, useState } from 'react'
import { Divider, Form, message, Input, DatePicker, Select, Button } from 'antd';
import { url, UserContext } from '../../../Static';
import moment from 'moment';
import axios from 'axios';
import { Modal } from 'antd';
import { CloseOutlined, UserAddOutlined, PlusOutlined } from '@ant-design/icons';

export default function Update({visible}) {
    let [form] = Form.useForm();
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        form.setFieldsValue({
            ...user.get, date: [moment(user.get.started_date, 'YYYY-MM-DD'), moment(user.get.end_date, 'YYYY-MM-DD')],
            date_birth: moment(user.get.date_birth, 'YYYY-MM-DD')
        });
    }, [form, user.get, user.get._token, visible])

    const finish = (data) => {
        setLoading(true)
        const dataUrl =  `update?_token=`;
        axios.put(url + dataUrl + user.get._token,
            { started_date: data.date[0], end_date: data.date[1], ...data })
            .then(e => {
                if (e.data.status === 'error') message.error(e.data.message)
                else {
                    form.resetFields();
                    visible[1](0);
                    message.success(e.data.message);
                }
            }).finally(() => setLoading(false))
    }
    const [search, setSearch] = useState('')
    const [search1, setSearch1] = useState('')
    return (
        <Modal closeIcon={<CloseOutlined onClick={() => visible[1](false)} />} footer={false}
            visible={visible[0]} title={
                <>
                    <UserAddOutlined style={{ marginRight: '5px' }} />
                    Modify employee information
                </>
            }>
            <Form onFinish={finish} form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                <Form.Item name='id' hidden />
                <Divider style={{ color: '#007bff' }} > Personal information </Divider>
                <Form.Item required={false} label='Full name' name='full_name' rules={[{ required: true, message: 'Please enter your full name' }]}>
                    <Input placeholder='Full name' maxLength='100' showCount />
                </Form.Item>
                <Form.Item required={false} label='Date of Birth' name='date_birth' rules={[{ required: true, message: 'Please enter your date of birth' }]}>
                    <DatePicker placeholder='Date of birth' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item required={false} label='Working time' name='date'
                    rules={[{ required: true, message: 'Please enter full working time' }]}>
                    <DatePicker.RangePicker placeholder={['Started date', 'End date']} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item required={false} name='sex' label='Gender' rules={[{ required: true, message: 'Please enter your gender' }]}>
                    <Select placeholder="Choose your gender">
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Divider style={{ color: '#007bff' }}> Login information </Divider>
                <Form.Item name='email' required={false} label='Email' rules={[
                    { required: true, message: 'Please enter your registered email' },
                    { type: 'email', message: 'Please enter your email in the correct format' }]}>
                    <Input placeholder='Email register' />
                </Form.Item>
                <Form.Item name='password_old' required={false} label='Password old' >
                    <Input.Password onInput={(e)=>{setSearch1(e.target.value)}} placeholder='Password old' />
                </Form.Item>
                <Form.Item required={false} name='password' label='Password' rules={[{required: search1 !== '', message: 'Request new password'}]}>
                    <Input.Password onInput={(e) => { setSearch(e.target.value) }} placeholder='Password new' />
                </Form.Item>
                <Form.Item required={false} name='password_confrim' label='Confrim password' rules={[{
                    required: search !== '',
                    message: 'Request confirm password'
                }, {
                    pattern: new RegExp(`^${search}$`, 'm'),
                    message: 'Confirmation password is incorrect'
                }]}>
                    <Input.Password placeholder='Confrim password new' />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                    <Button loading={loading} htmlType='submit' type='primary' shape='round' icon={<PlusOutlined />}  >Update account</Button>
                </div>
            </Form>
        </Modal>)
}
