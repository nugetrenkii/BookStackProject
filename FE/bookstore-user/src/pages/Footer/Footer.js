import React from 'react'
import './Footer.css'
import { Card, Carousel, Col, Row } from 'antd'
import Menu from '../../components/Menu/Menu';
const contentStyle = {
  margin: 0,
  height: '400px',
  color: '#000',
  lineHeight: '400px',
  textAlign: 'center',
  background: '#000',
  borderRadius: "5px",
  width: "100%",
  objectFit: "contain"
};
function Footer() {
  return (
    <div>
      {/* <div className='border-footer'>hehe</div> */}
      <div className='footer-main'>
        <div style={{ width: "100%" }}>
          <Row gutter={[0, 0]}>
            <Col span={24} md={8}>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ fontSize: "18px", fontWeight: "600" }}>DỊCH VỤ</div>
                <span style={{ margin: "5px 0px" }}>Điều khoản sử dụng</span>
                <span style={{ margin: "5px 0px" }}>Chính sách bảo mật</span>
                <span style={{ margin: "5px 0px" }}>Giới thiệu BookStore.com</span>
              </div>
            </Col>

            <Col span={24} md={8}>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ fontSize: "18px", fontWeight: "600" }}>HỖ TRỢ</div>
                <span style={{ margin: "5px 0px" }}>Chính sách đổi trả</span>
                <span style={{ margin: "5px 0px" }}>Chính sách bảo hành</span>
                <span style={{ margin: "5px 0px" }}>Chính sách vận chuyển</span>
              </div>
            </Col>

            <Col span={24} md={8}>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ fontSize: "18px", fontWeight: "600" }}>LIÊN HỆ</div>
                <span style={{ margin: "5px 0px" }}>13 Khái Đông 2, Q. Ngũ Hành Sơn, TP. Đà Nẵng</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Footer