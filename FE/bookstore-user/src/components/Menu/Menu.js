import { Card, Col, Row } from 'antd'
import React from 'react'
import './Menu.css'
import { useNavigate } from 'react-router-dom'
function Menu() {
    const navigate = useNavigate()
    return (
        <div className='main-menu'>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24}>
                    <Card className="card-menu" style={{
                        borderRadius:"0px"
                    }}
                    title={(
                        <div style={{fontSize:"18px"}}>
                        TÀI KHOẢN
                        </div>
                    )}>
                        <ul>
                            <li onClick={()=>navigate('/account')}>Thông tin tài khoản</li>
                            <li onClick={()=>navigate('/account/address')}>Địa chỉ nhận hàng</li>
                            <li onClick={()=>navigate('/account/history')}>Lịch sử đặt sách</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Menu