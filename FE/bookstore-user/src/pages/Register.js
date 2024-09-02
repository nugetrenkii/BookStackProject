import React, { useState } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom'
import { RegisterAPI } from '../axios/AuthAPI'

function Register() {
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [show, setShow] = useState(false)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRePassword] = useState('')
    const validate = () => {
        const error = {}
        if (username == '') error.username = 'Tên đăng nhập không được để trống!'
        if (firstName == '') error.firstName = 'Họ không được để trống!'
        if (lastName == '') error.lastName = 'Tên không được để trống!'
        if (email == '') error.email = 'Email không được để trống!'
        if (password == '') error.password = 'Mật khẩu không được để trống!'
        if (password != repassword) error.repassword = 'Mật khẩu không trùng khớp!'

        setErrors(error)
        return Object.keys(error).length === 0;
    }

    const handleRegister = async () => {
        const user = {
            firstName:firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            cfPassWord: repassword
        }

        if (validate()) {
            var res = await RegisterAPI(user)
            if(res?.code == 200){
                // addNotification(1, "Có user đăng ký tài khoản mới", "users")
                navigate("/login")
            }
        }
    }
    return (
        <div className='main-register'>
            <div className='register-header'>ĐĂNG KÝ TÀI KHOẢN</div>
            <div className='register-main'>
                <div className='input-form'>
                    <input type='text' placeholder='Họ' onChange={(e) => setFirstName(e.target.value)}></input>
                    {
                        errors?.firstName ? <span className='error-validate'>{errors.firstName}</span>
                            : <span className='error-validate'></span>
                    }
                </div>
                <div className='input-form'>
                    <input type='text' placeholder='Tên' onChange={(e) => setLastName(e.target.value)}></input>
                    {
                        errors?.lastName ? <span className='error-validate'>{errors.lastName}</span>
                            : <span className='error-validate'></span>
                    }
                </div>
                <div className='input-form'>
                    <input type='text' placeholder='Tên đăng nhập' onChange={(e) => setUsername(e.target.value)}></input>
                    {
                        errors?.username ? <span className='error-validate'>{errors.username}</span>
                            : <span className='error-validate'></span>
                    }
                </div>
                <div className='input-form'>
                    <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
                    {
                        errors?.email ? <span className='error-validate'>{errors.email}</span>
                            : <span className='error-validate'></span>
                    }
                </div>
                <div className='input-form'>
                    <input type={show ? 'text' : 'password'} placeholder='Mật khẩu' onChange={(e) => setPassword(e.target.value)}></input>
                    <i className={'bi bi-eye' + (show ? '-slash' : '')} onClick={() => setShow(!show)}></i>

                </div>
                {
                    errors?.password ? <span className='error-validate'>{errors.password}</span>
                        : <span className='error-validate'></span>
                }
                <div className='input-form'>
                    <input type={show ? 'text' : 'password'} placeholder='Xác nhận mật khẩu' onChange={(e) => setRePassword(e.target.value)}></input>
                    <i className={'bi bi-eye' + (show ? '-slash' : '')} onClick={() => setShow(!show)}></i>

                </div>
                {
                    errors?.repassword ? <span className='error-validate'>{errors.repassword}</span>
                        : <span className='error-validate'></span>
                }
            </div>
            {/* <div className='register-group'>
                <div className='remember'>
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Remember me?
                    </label>
                </div>
                <Link to='/forgot-password'>
                    <div className='forgot-password'>
                        Quên mật khẩu?
                    </div>
                </Link>
            </div> */}
            <div className='register-footer'>
                <div className='register'>
                    <button className='btn-register' onClick={handleRegister}>Đăng ký</button>
                </div>
                <div className='login'>
                    <button className='btn-register' onClick={() => navigate('/login')}>Đã có tài khoản</button>
                </div>
            </div>
        </div>
    )
}

export default Register