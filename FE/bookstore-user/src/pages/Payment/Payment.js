import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Payment.css'
import Waiting from '../Waiting/Waiting'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { CheckPaymenUrl } from '../../axios/PaymentAPI'

function Payment() {
    const params = useParams()
    const [data, setData] = useState()
    const [wait, setWait] = useState(false)
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var currentUrl = window.location.href;
        var url = new URL(currentUrl);
        var queryString = url.search;
        setWait(true)
        try {
            var res = await CheckPaymenUrl(queryString)
            console.log(res)
            setData(res)
        } catch (e) {
            console.log(e)
        }
        setWait(false)
    }
    return (
        <div className='main-vnpay'>
            {
                wait && <Waiting />
            }
            {
                data?.code == 200 ?
                    <div className='payment-success'>
                        <span className='success-lable'>THÀNH CÔNG
                            <CheckOutlined className="icon-success" />
                        </span>
                        <span className='success-lable'>Bạn đã thanh toán số tiền
                            <span className='money'>

                                {data?.data?.amount.toLocaleString('vi-VN', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    style: 'decimal'
                                })}
                            </span>
                            VNĐ
                        </span>
                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                            <Link to={`/account/history/${data?.data?.orderId}`} className="button" style={{ border: "none" }}>Xem chi tiết</Link>
                            {/* <Link to={"/my-history/"} className="button back">Trở lại</Link> */}
                        </div>
                    </div>
                    :
                    <div className='payment-error'>
                        <span className='error-lable'>
                            THẤT BẠI
                            <CloseOutlined className='icon-error' />
                        </span>
                        <span className='error-lable'>Giao dịch của bạn đã thất bại</span>
                        {/* <Link to="/my-history" className="button">Trở lại</Link> */}
                    </div>
            }
        </div>
    )
}

export default Payment