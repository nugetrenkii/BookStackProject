import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, Col, List, Row, Table } from 'antd'
import Waiting from '../Waiting/Waiting'
import Menu from '../../components/Menu/Menu'
import './History.css'
import { GetHistoryOrder } from '../../axios/OrderAPI'

function History() {
    const [wait, setWait] = useState(false)
    const [histories, setHistories] = useState([])

    useEffect(() => {
        fecthData()
    }, [])
    const fecthData = async () => {
        setWait(true)
        var res = await GetHistoryOrder(localStorage.getItem('userId'), 1, 1000, "", "ID")
        setHistories(res?.data)

        console.log((res));
        setWait(false)
    }

    const CalculateMoney = (orderBooks) => {
        var total = 0;
        for (var i = 0; i < orderBooks.length; i++) {
            total += orderBooks[i]?.book?.price * orderBooks[i]?.quantity
        }
        return total
    }

    const statusMap = {
        can: "Đã hủy",
        don: "Hoàn thành",
        shi: "Đang giao hàng",
        com: "Đã xác nhận đang chờ giao hàng",
        new: "Chờ xác nhận", // add new status here
      };

    return (
        <>

            {
                wait ? <Waiting /> : <></>
            }
            <div className='main-history'>
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
                                            LỊCH SỬ ĐẶT SÁCH
                                        </div>
                                    </div>
                                )}
                            >
                                {
                                    histories.length == 0 ?
                                        <>
                                            Bạn chưa có đơn đặt hàng nào
                                        </> :
                                        <>
                                            <div className='header-table' style={{
                                                display: "flex", padding: "10px 5px", borderBottom: "1px solid rgba(100,100,100,0.5)"
                                            }}>
                                                <div style={{ width: "20%", fontWeight: "600", fontSize: "16px" }}>Mã đơn hàng</div>
                                                <div style={{ width: "20%", fontWeight: "600", fontSize: "16px" }}>Người nhận</div>
                                                <div style={{ width: "20%", fontWeight: "600", fontSize: "16px" }}>Tổng tiền</div>
                                                <div style={{ width: "20%", fontWeight: "600", fontSize: "16px" }}>Trạng thái</div>
                                                <div style={{ width: "20%", fontWeight: "600", fontSize: "16px" }}></div>
                                            </div>
                                            {
                                                histories?.map((history, index) => (
                                                    <div className='line-table' style={{
                                                        display: "flex", padding: "10px 5px", borderBottom: "1px solid rgba(100,100,100,0.5)"
                                                    }}>
                                                        <div style={{
                                                            width: "20%"
                                                        }}>{history?.id}</div>
                                                        <div style={{
                                                            width: "20%"
                                                        }}>{history?.address?.name}</div>
                                                        <div style={{
                                                            width: "20%"
                                                        }}>
                                                            {Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(CalculateMoney(history?.orderBooks))}
                                                        </div>
                                                        <div style={{
                                                            width: "20%"
                                                        }}>
                                                            <span className={`order-sratus ${history?.status?.toLowerCase()}`}>
                                                                {statusMap[history?.status?.toLowerCase()] || "Chờ xác nhận"}
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            width: "20%"
                                                        }}>
                                                            <a href={`history/${history?.id}`}>Chi tiết</a>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                }

                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default History