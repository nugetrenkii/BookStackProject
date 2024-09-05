import React, { useEffect, useState } from 'react'
import Waiting from '../Waiting/Waiting'
import { Card, Col, Image, Input, List, Radio, Row, Space, Typography } from 'antd'
import './Order.css'
import { CreateAddress, GetAddressByUser, GetSelfAddress, SelfCreateAddress } from '../../axios/AccountAPI'
import { CreateUrlPayment } from '../../axios/PaymentAPI'
import { CreateOrder, GetShippingModes, SelfCreateOrder } from '../../axios/OrderAPI'
import { useNavigate } from 'react-router-dom'
import { ClockCircleOutlined, WarningOutlined } from '@ant-design/icons'

function Order() {
    const [wait, setWait] = useState(false)
    const [total, setTotal] = useState(0)
    const [payment, setPayment] = useState(1)
    const [books, setBook] = useState([])
    const [quantities, setQuantities] = useState([])
    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState([])
    const [guestAddress, setGuestAddress] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        phone: "",
        userId: 2
    })
    const [shippingMode, setShippingMode] = useState(1)
    const [shippingModes, setShippingModes] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fecthData()
    }, [])
    const fecthData = async () => {
        setWait(true)
        console.log(JSON.parse(sessionStorage.getItem('order')));
        setBook(JSON.parse(sessionStorage.getItem('order')).books);
        setQuantities(JSON.parse(sessionStorage.getItem('order')).quantities);

        console.log(books);

        var res = await GetSelfAddress()
        if (res?.code == 200) {
            setAddresses(res?.data);
            setAddress(res?.data[0].id);
        }

        var res = await GetShippingModes()
        if (res?.code == 200)
            setShippingModes(res?.data);

        var sum = 0;
        for (var index = 0; index < JSON.parse(sessionStorage.getItem('order')).books?.length; index++) {
            sum += JSON.parse(sessionStorage.getItem('order')).books[index]?.price * JSON.parse(sessionStorage.getItem('order')).quantities[index].count
        }
        setTotal(sum)

        setWait(false)
    }

    const Order = async () => {
        setWait(true)

        if (!localStorage.getItem('token')) {
            var res = await SelfCreateAddress(guestAddress)
            if (res?.code == 200) {
                var order = {
                    status: "NEW",
                    description: "",
                    shippingModeId: shippingMode,
                    addressId: res?.data?.id,
                    payMode: payment == 1 ? "CASH" : "VNPAY", // Update this line
                    quantitieCounts: [
                
                    ],
                    bookIds: [
                
                    ]
                }
                for (var i = 0; i < books?.length; i++) {
                    order.bookIds.push(books[i]?.id)
                    order.quantitieCounts.push(quantities[i]?.count)
                }

                console.log(order);

                var res = await CreateOrder(order)

                if (res?.code == 200) {
                    navigate('/')
                }
            }
        } else {
            var order = {
                status: "NEW",
                description: "",
                shippingModeId: shippingMode,
                addressId: address,
                payMode: payment == 1 ? "CASH" : "VNPAY",
                quantitieCounts: [

                ],
                bookIds: [

                ]
            }
            for (var i = 0; i < books?.length; i++) {
                order.bookIds.push(books[i]?.id)
                order.quantitieCounts.push(quantities[i]?.count)
            }

            console.log(order);
            var res = await SelfCreateOrder(order)

            if (res?.code == 200) {
                if(payment == 2){
                    var res = await CreateUrlPayment(res?.data?.id, total)
                    if (res.code == 200) window.location = res?.data
                }
                else
                navigate('/account/history')
            }
        }
        setWait(false)
    }
    return (
        <>
            {
                wait ? <Waiting /> : <></>
            }
            <div className='main-order'>
                <Row gutter={[24, 0]} className='mb-24'>
                    <Col span={24} md={24}>
                        <Card style={{
                            borderRadius: "0px"
                        }}
                            title={(
                                <div>
                                    ĐỊA CHỈ GIAO HÀNG
                                </div>
                            )}
                        >
                            {
                                (localStorage.getItem("token")) ?
                                    <>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}>
                                            <a style={{
                                                marginBottom: "10px"
                                            }} onClick={() => navigate('/account/address')}>+ Thêm địa chỉ</a>
                                            <Radio.Group onChange={(e) => setAddress(e.target.value)} defaultValue={1}>
                                                <Space direction="vertical">
                                                    {
                                                        addresses?.map((item, index) => (
                                                            <Radio checked value={item?.id}>{item?.name + " - " + item?.phone + ", " + item?.street + ", " + item?.state + ", " + item?.city}</Radio>
                                                        ))
                                                    }
                                                </Space>
                                            </Radio.Group>
                                        </div>
                                    </>
                                    :
                                    <div className='guest-address'>
                                        <div className='guest-line'>
                                            <span>Tên người nhận</span>
                                            <Input
                                                status={guestAddress.name.length > 0 ? "" : "error"}
                                                prefix={!guestAddress.name.length > 0 ? <WarningOutlined /> : <></>}
                                                onChange={(e) => {
                                                    setGuestAddress(a => ({
                                                        ...a,
                                                        name: e.target.value
                                                    }))
                                                }}
                                                style={{
                                                    borderRadius: "2px",
                                                    marginBottom: "10px"
                                                }} />
                                        </div>
                                        <div className='guest-line'>
                                            <span>Số điện thoại</span>
                                            <Input
                                                type='number'
                                                status={(guestAddress.phone.length == 10 && guestAddress.phone[0] == '0') ? "" : "error"}
                                                prefix={!(guestAddress.phone.length == 10 && guestAddress.phone[0] == '0') ? <WarningOutlined /> : <></>}
                                                onChange={(e) => {
                                                    setGuestAddress(a => ({
                                                        ...a,
                                                        phone: e.target.value
                                                    }))
                                                }}
                                                style={{
                                                    borderRadius: "2px",
                                                    marginBottom: "10px"
                                                }} />
                                        </div>
                                        <div className='guest-line'>
                                            <span>Tỉnh/Thành phố</span>
                                            <Input
                                                status={guestAddress.city.length > 0 ? "" : "error"}
                                                prefix={!guestAddress.city.length > 0 ? <WarningOutlined /> : <></>}
                                                onChange={(e) => {
                                                    setGuestAddress(a => ({
                                                        ...a,
                                                        city: e.target.value
                                                    }))
                                                }}
                                                style={{
                                                    borderRadius: "2px",
                                                    marginBottom: "10px"
                                                }} />
                                        </div>
                                        <div className='guest-line'>
                                            <span>Quận/Huyện</span>
                                            <Input
                                                status={guestAddress.state.length > 0 ? "" : "error"}
                                                prefix={!guestAddress.state.length > 0 ? <WarningOutlined /> : <></>}
                                                onChange={(e) => {
                                                    setGuestAddress(a => ({
                                                        ...a,
                                                        state: e.target.value
                                                    }))
                                                }}
                                                style={{
                                                    borderRadius: "2px",
                                                    marginBottom: "10px"
                                                }} />
                                        </div>
                                        <div className='guest-line'>
                                            <span>Địa chỉ</span>
                                            <Input
                                                status={guestAddress.street.length > 0 ? "" : "error"}
                                                prefix={!guestAddress.street.length > 0 ? <WarningOutlined /> : <></>}
                                                onChange={(e) => {
                                                    setGuestAddress(a => ({
                                                        ...a,
                                                        street: e.target.value
                                                    }))
                                                }}
                                                style={{
                                                    borderRadius: "2px",
                                                }} />
                                        </div>
                                    </div>
                            }
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 0]} className='mb-24'>
                    <Col span={24} md={24}>
                        <Card style={{
                            borderRadius: "0px"
                        }}
                            title={(
                                <div>
                                    PHƯƠNG THỨC VẬN CHUYỂN
                                </div>
                            )}
                        >
                            <Radio.Group onChange={(e) => setShippingMode(e.target.value)} defaultValue={1}>
                                <Space direction="vertical">
                                    {
                                        shippingModes?.map((item, index) => (
                                            <Radio value={item?.id}>{item?.name}</Radio>
                                        ))
                                    }
                                </Space>
                            </Radio.Group>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 0]} className='mb-24'>
                    <Col span={24} md={24}>
                        <Card style={{
                            borderRadius: "0px"
                        }}
                            title={(
                                <div>
                                    PHƯƠNG THỨC THANH TOÁN
                                </div>
                            )}
                        >
                            <Radio.Group defaultValue={1} onChange={(e)=>setPayment(e.target.value)}>
                                <Space direction="vertical">
                                    <Radio value={1}>Thanh toán khi nhận hàng</Radio>
                                    <Radio value={2}><Image src='https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_vnpay.svg?q=10298' />   VN Pay (Đang phát triển)</Radio>
                                </Space>
                            </Radio.Group>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 0]} className='mb-24'>
                    <Col span={24} md={24}>
                        <Card style={{
                            borderRadius: "0px"
                        }}
                            title={(
                                <div>
                                    ĐƠN HÀNG
                                </div>
                            )}
                        >
                            {
                                books?.map((book, index) => (
                                    <div
                                        className={`order-line-book ${index == 0 ? "first" : ""}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}>
                                        <div style={{ width: "70%", display: "flex" }}>
                                            <Image src={book?.image} preview={false}
                                                onClick={() => navigate(`/book/${book?.id}`)}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    cursor: "pointer"
                                                }}></Image>
                                            <div style={{
                                                paddingLeft: "20px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}>
                                                <div style={{ fontSize: "16px" }}>{book?.title}</div>
                                                <div style={{
                                                    fontSize: "18px",
                                                    fontWeight: "600"
                                                }}>
                                                    {Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(book?.price)}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                width: "10%",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: "18px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            <div>
                                                {quantities[index]?.count}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                width: "20%",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: "20px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            <div style={{ color: "#C92127", }}>
                                                {Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(book?.price * quantities[index]?.count)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 0]} className='mb-24'>
                    <Col span={24} md={24}>
                        <Card style={{
                            borderRadius: "0px"
                        }}
                            title={(
                                <div>
                                    THÀNH TIỀN
                                </div>
                            )}
                        >
                            <div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px"
                                }}>
                                    <div style={{ width: "85%", textAlign: "end", fontSize: "18px", fontWeight: "600", }}>Tổng số tiền (đã bao gồm VAT)</div>
                                    <div style={{ width: "10%", textAlign: "end", fontSize: "20px", fontWeight: "600", color: "#C92127", }}>
                                        {Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(total)}</div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div className='to-cart' style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        display: "flex",
                                        alignItems: "center"
                                    }} onClick={() => navigate('/cart')}>
                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/btn_back.svg?q=10298" style={{ marginRight: "10px" }}></img>
                                        Quay về giỏ hàng
                                    </div>
                                    <button style={{
                                        width: "120px",
                                        height: "40px",
                                        borderRadius: "2px",
                                        backgroundColor: "#C92127",
                                        border: "1px solid #C92127",
                                        color: "#fff",
                                        fontSize: "16px",
                                        // fontWeight:"600"
                                    }} onClick={Order}>ĐẶT HÀNG</button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Order