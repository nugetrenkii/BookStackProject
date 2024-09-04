import React, { useState } from 'react'
import './SignIn.css'
import { Login } from '../axios//AuthAPI.js'
import { Link, useNavigate } from 'react-router-dom'

function SignIn() {
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [show, setShow] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const validate = () => {
        const error = {}
        if (username == '') error.username = 'Tên đăng nhập không được để trống!'
        if (password == '') error.password = 'Mật khẩu không được để trống!'

        setErrors(error)
        return Object.keys(error).length === 0;
    }

    const handleLogin = async () => {
        const error = {}
        try {
            if (validate()) {
                var res = await Login(username, password)
                console.log(res)
                if (res?.code == 200 && res?.data?.role?.name == "user") {
                    localStorage.setItem('token', res?.data?.token)
                    localStorage.setItem('userId', res?.data?.id)
                    window.location = '/'
                }
                else {
                    error.username = "Tài khoản hoặc mật khẩu không chính xác!"
                    setErrors(error)
                }
            }
        }
        catch (e) {
            console.log((e));
            if (e.response.data.message == "Username không tồn tại!") {
                error.username = "Tên đăng nhập không tồn tại"
                setErrors(error)
            }
            else
                if (e.response.data.message == "Tài khoản của bạn đã bị vô hiệu") {
                    error.username = "Tài khoản của bạn đã bị vô hiệu!"
                    setErrors(error)
                }
                else {
                    error.password = "Mật khẩu không đúng"
                    setErrors(error)
                }
        }
    }
    return (
        <div className='main-login'>
            <div className='login-header'>ĐĂNG NHẬP</div>
            <div className='login-main'>
                <div className='input-form'>
                    <input type='text' placeholder='Tên đăng nhập' onChange={(e) => setUsername(e.target.value)}></input>
                    {
                        errors?.username ? <span className='error-validate'>{errors.username}</span>
                            : <span className='error-validate'></span>
                    }
                </div>
                <div className='input-form'>
                    <input type={show ? 'text' : 'password'} placeholder='Mật khẩu' onChange={(e) => setPassword(e.target.value)}></input>
                    {/* <i className={'bi bi-eye' + (show ? '-slash' : '')} onClick={() => setShow(!show)}></i> */}

                </div>
                {
                    errors?.password ? <span className='error-validate'>{errors.password}</span>
                        : <span className='error-validate'></span>
                }
            </div>
            {/* <div className='login-group'>
                <Link to='/forgot-password'>
                    <div className='forgot-password'>
                        Quên mật khẩu?
                    </div>
                </Link>
            </div> */}
            <div className='login-footer'>
                <div className='login'>
                    <button className='btn-login' onClick={handleLogin}>Đăng nhập</button>
                </div>
                <div className='register'>
                    <button className='btn-register' onClick={() => navigate('/register')}>Đăng ký tài khoản mới</button>
                </div>
                
            </div>
        </div>
    )
}

export default SignIn