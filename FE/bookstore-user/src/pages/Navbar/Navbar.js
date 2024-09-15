import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Popover } from 'antd';
import { GetUserById, GetPersonalInfo } from '../../axios/AuthAPI';
import logo from '../../assets/images/BookStack.png';
function Navbar() {
    const navigate = useNavigate();
    const [content, setContent] = useState()
    const [key, setKey] = useState("")

    useEffect(() => {
        fetchData()
    }, [localStorage.getItem('token')])


    const fetchData = async () => {
        if (!localStorage.getItem('token')) {
            setContent(
                < div style={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <button style={{
                        height: "35px",
                        // width: "180px",
                        padding: "0px 10px",
                        background: "rgb(253, 56, 56)",
                        border: "2px solid rgba(253, 56, 56,0.5)",
                        color: "#fff",
                        borderRadius: "5px",
                        marginBottom: "10px"
                    }} onClick={() => navigate("/login")} >Đăng nhập</button>

                    <button style={{
                        height: "35px",
                        // width: "180px",
                        background: "#fff",
                        padding: "0px 10px",
                        border: "2px solid rgb(253, 56, 56)",
                        color: "rgba(253, 56, 56)",
                        borderRadius: "5px",
                    }} onClick={() => navigate("/register")}>Đăng ký</button>
                </div >
            )
        } else {
            var res = await GetPersonalInfo()
            setContent(
                < div style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer"
                }}>
                    <div style={{
                        display: "flex",
                        // alignItems: "top",
                        // justifyContent:"space-between"
                        borderBottom: "1px solid rgba(0,0,0,0.2)",
                        padding: "10px 0px"
                    }} onClick={() => navigate("/account")}>
                        <img src={res?.data?.avatar} style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: '50px',
                            objectFit: 'cover'
                        }} />
                        <div style={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <span style={{ marginLeft: "15px", fontWeight: "600" }}>{res?.data?.firstName + " " + res?.data?.lastName}</span>
                            <span style={{ marginLeft: "15px", color: "rgba(0,0,0,0.5)" }}>Thành viên BookStack</span>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        padding: "10px 0px"
                    }} onClick={() => navigate("/account/history")}>
                        <span style={{
                            background: 'url("https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_bill_gray.svg")',
                            backgroundSize: 'contain',
                            height: '24px',
                            width: '24px'
                        }}></span>
                        <span style={{ marginLeft: "10px", fontWeight: "600", color: "#7A7E7F" }}>Đơn hàng của tôi</span>
                    </div>

                    <div style={{
                        display: "flex",
                        padding: "10px 0px"
                    }} onClick={() => handleLogout()}>
                        <span style={{
                            background: 'url("https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_logout_gray.svg")',
                            backgroundSize: 'contain',
                            height: '24px',
                            width: '24px'
                        }}></span>
                        <span style={{ marginLeft: "10px", fontWeight: "600", color: "#7A7E7F" }}>Đăng xuất</span>
                    </div>
                </div >
            )
        }
    }

    const handleLogout = () => {
        sessionStorage.clear()
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className='navbar-main'>
                {/* Book Store */}
                <div className="waviy" onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" style={{
                        width: "250px",
                        height: "100px",
                        objectFit: 'cover'
                    }}/>
                </div>
            <div className='navbar-search'>
                <input className='navbar-input' onChange={(e) => setKey(e.target.value)}></input>
                <Link state={{search: key}} to={{pathname: '/book' }} style={{ color: "#000" }} >
                    <SearchOutlined className='navbar-icon' />
                </Link>
            </div>
            <div className='navbar-footer'>
                <div style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px" }}>
                    <ShoppingCartOutlined className='navbar-icon' onClick={() => navigate("/cart")} />
                    <span style={{ fontSize: "12px" }}>Giỏ hàng</span>
                </div>
                <Popover placement="bottomRight" content={content} className='hungtd34'>
                    {/* <Button>BR</Button> */}
                    <div style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <UserOutlined className='navbar-icon' />
                        <span style={{ fontSize: "12px" }}>Tài khoản</span>
                    </div>
                </Popover>
            </div>
        </div>
    )
}

export default Navbar