import React, { useEffect, useState } from 'react'
import Waiting from '../Waiting/Waiting'
import { Avatar, Button, Card, Col, Form, Input, List, Modal, Row } from 'antd'
import Menu from '../../components/Menu/Menu'
import './Address.css'
import { CreateAddress, GetAddressByUser } from '../../axios/AccountAPI'

function Address() {
    const [wait, setWait] = useState(false)
    const [addresses, setAddresses] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        fecthData()
    }, [])
    const fecthData = async () => {
        setWait(true)
        var res = await GetAddressByUser(localStorage.getItem("userId"))
        if (res?.code == 200)
            setAddresses(res?.data);
        setWait(false)
    }

    const handleOk = async () => {
        setWait(true)
        var a = form.getFieldValue()
        var address = {
            name: a.name,
            street: a.street,
            city: a.city,
            state: a.state,
            phone: a.phone,
            userId: localStorage.getItem('userId')
        }
        console.log(address);
        var res = await CreateAddress(address)

        if (res?.code == 200) {
            setIsModalOpen(false);
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }
        setWait(false)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>

            {
                wait ? <Waiting /> : <></>
            }
            <div className='main-address'>
                <Row gutter={[24, 0]}>
                    <Col span={24} md={6}>
                        <div className='menu-account'>
                            <Menu />
                        </div>
                    </Col>
                    <Col span={24} md={18}>
                        <div className='content-account'>
                            <Card style={{
                                borderRadius: "0px"
                            }}
                                title={(
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            SỔ ĐỊA CHỈ
                                        </div>
                                        <div>
                                            <button style={{
                                                height: "35px",
                                                width: "130px",
                                                padding: "0px 10px",
                                                background: "rgb(253, 56, 56)",
                                                border: "2px solid rgba(253, 56, 56,0.5)",
                                                color: "#fff",
                                                borderRadius: "5px"
                                            }} htmlType="submit" onClick={() => setIsModalOpen(true)}>Thêm địa chỉ</button>
                                        </div>
                                    </div>
                                )}
                            >
                                <List
                                    dataSource={addresses}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a >{item?.name + " - " + item?.phone}</a>}
                                                description={item?.street + " / " + item?.state + " / " + item?.city}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal title="Thêm địa chỉ" open={isModalOpen}
                    onOk={() => {
                        form.validateFields().then(() => {
                            handleOk()
                        });
                    }}
                    onCancel={handleCancel} visible={isModalOpen}
                    width={800}
                >
                    <Form
                        form={form}
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        layout="vertical"
                    >
                        <Form.Item name="name" label="Tên người nhận"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 1,
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="phone" label="Số điện thoại người nhận"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 1,
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="street" label="Địa chỉ nhà"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 1,
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="state" label="Quận / Huyện"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 1,
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="city" label="Tỉnh / Thành phố"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 1,
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

export default Address