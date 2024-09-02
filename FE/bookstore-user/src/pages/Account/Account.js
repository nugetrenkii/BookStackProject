import React, { useEffect, useState } from 'react'
import "./Account.css"
import Waiting from '../Waiting/Waiting'
import Menu from '../../components/Menu/Menu'
import { Button, Card, Col, DatePicker, Form, Image, Input, Radio, Row, Upload } from 'antd'
import { GetUserById } from '../../axios/AuthAPI'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import { UpdateUser } from '../../axios/AccountAPI'
import { UploadImageAPI } from '../../axios/ImageAPI'
import { useNavigate } from 'react-router-dom'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function Account() {
  const [wait, setWait] = useState(false)
  const [imageURL, setImageURL] = useState()
  const [form] = Form.useForm()
  const navigate = useNavigate();

  useEffect(() => {
    fecthData()
  }, [])
  const fecthData = async () => {
    setWait(true)
    var res = await GetUserById(localStorage.getItem('userId'))
    console.log(res);
    if (res?.code == 200) {
      form.setFieldsValue({
        firstName: res?.data?.firstName,
        lastName: res?.data?.lastName,
        email: res?.data?.email,
        phone: res?.data?.phone,
        gender: res?.data?.gender,
        avatar: res?.data?.avatar,
        dob: dayjs(res?.data?.dob?.slice(0, 10))
      })
      setImageURL(res?.data?.avatar)
    }
    setWait(false)
  }

  const onFinish = async (values) => {
    setWait(true)

    var user = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      phone: values?.phone,
      gender: values?.gender,
      avatar: null,
      dob: dayjs(values?.dob).add(1, 'day').toJSON().slice(0, 10)
    }

    var res = await UpdateUser(localStorage.getItem('userId'), user)
    if (res?.code == 200) {
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    }

    setWait(false)
  }

  const ChangeAvatar = async (e) => {
    setWait(true)

    var url = await UploadImageAPI(e.file)
    var values = form.getFieldValue()

    var user = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      phone: values?.phone,
      gender: values?.gender,
      avatar: url,
      dob: dayjs(values?.dob).add(1, 'day').toJSON().slice(0, 10)
    }

    var res = await UpdateUser(localStorage.getItem('userId'), user)
    if (res?.code == 200) {
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    }

    setWait(false)
  }
  return (

    <>
      {
        wait ? <Waiting /> : <></>
      }
      {!localStorage.getItem('userId') ?
        <div style={{
          marginTop: 20
        }}>
          <Row gutter={[24, 0]}>
            <Col span={24} md={24}>
              <Card className="mb-24 cart-line">
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "32px",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <div>
                    Bạn chưa đăng nhập
                  </div>
                  <button style={{
                    height: "35px",
                    width: "240px",
                    padding: "0px 10px",
                    background: "rgb(253, 56, 56)",
                    border: "2px solid rgba(253, 56, 56,0.5)",
                    fontSize: "24px",
                    color: "#fff",
                    borderRadius: "5px",
                    marginTop: "20px"
                  }} onClick={() => navigate('/login')}>Đăng nhập ngay</button>
                </div>
              </Card>
            </Col>
          </Row>
        </div> :
        <div className='main-account'>

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
                    <div>
                      THÔNG TIN TÀI KHOẢN
                    </div>
                  )}
                >
                  {/* <Form
                  form={form}
                  layout="horizontal"
                  onFinish={onFinish}
                >
                  <Row gutter={[24, 0]} >
                    <Col span={24} md={24}>
                      <Form.Item name="firstName"
                        rules={[
                          {
                            message: 'Thông tin này không thể để trống!',
                            required: true,
                          },
                          {
                            type: 'string',
                            min: 1,
                            max: 255
                          },
                        ]}
                      >
                        <div className='account-info-group'>
                          <label className='account-info-lable'>Họ*</label>
                          <div className='account-info-field'>
                            <Input />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]} >
                    <Col span={24} md={24}>
                      <Form.Item name="lastName"
                        rules={[
                          {
                            message: 'Thông tin này không thể để trống!',
                            required: true,
                          },
                          {
                            type: 'string',
                            min: 1,
                            max: 255
                          },
                        ]}
                      >
                        <div className='account-info-group'>
                          <label className='account-info-lable'>Tên*</label>
                          <div className='account-info-field'>
                            <Input />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]} >
                    <Col span={24} md={24}>
                      <Form.Item name="phone"
                        rules={[
                          {
                            message: 'Thông tin này không thể để trống!',
                            required: true,
                          },
                          {
                            type: 'string',
                            min: 10,
                            max: 10
                          },
                        ]}
                      >
                        <div className='account-info-group'>
                          <label className='account-info-lable'>Số điện thoại</label>
                          <div className='account-info-field'>
                            <Input />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]} >
                    <Col span={24} md={24}>
                      <Form.Item name="email"
                        rules={[{ required: true },
                        {
                          type: 'email',
                        },]}
                      >
                        <div className='account-info-group'>
                          <label className='account-info-lable'>Email</label>
                          <div className='account-info-field'>
                            <Input />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="avatar" label="Avatar">
                    <Upload
                      multiple={false}
                      listType="picture"
                      beforeUpload={() => false}
                      defaultFileList={[]}
                    >
                    </Upload>
                  </Form.Item>

                  <Row gutter={[24, 0]} >
                    <Col span={24} md={24}>
                      <Form.Item name="dob"
                        rules={[
                          {
                            message: 'Thông tin này không thể để trống!',
                            required: true,
                          },
                        ]}
                      >

                        <div className='account-info-group'>
                          <label className='account-info-lable'>Ngày sinh</label>
                          <div className='account-info-field'>
                            <DatePicker />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} md={24}>
                      <Form.Item name="gender"
                        rules={[{ required: true }]}
                      >
                        <div className='account-info-group'>
                          <label className='account-info-lable'>Giới tính</label>
                          <div className='account-info-field'>
                            <Radio.Group style={{ width: "50%", display: "flex", justifyContent: "space-between" }}>
                              <Radio value={true}>Nam</Radio>
                              <Radio value={false}>Nữ</Radio>
                            </Radio.Group>
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ textAlign: "center" }}>
                    <Button type="default" style={{ marginRight: "10px" }}>Back</Button>
                    <Button htmlType="submit" type="primary" style={{ marginLeft: "10px" }}>Save</Button>
                  </Form.Item>
                </Form> */}



                  <Form
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    labelCol={{
                      span: 4,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                  >
                    <div className='account-avatar'>
                      <Image preview={false} src={imageURL} className='account-avatar-image' />
                      <Upload
                        multiple={false}
                        listType="picture"
                        beforeUpload={() => false}
                        defaultFileList={[]}
                        onChange={(e) => ChangeAvatar(e)}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />} style={{ borderRadius: "2px", marginTop: "10px" }}>Cập nhật ảnh đại diện</Button>
                      </Upload>
                    </div>

                    <Row gutter={[24, 0]} >
                      <Col span={24} md={24}>
                        <Form.Item name="firstName" label="Họ"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!',
                              required: true,
                            },
                            {
                              type: 'string',
                              min: 1,
                              max: 255
                            },
                          ]}
                        >
                          <Input className="account-input" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[24, 0]} >
                      <Col span={24} md={24}>
                        <Form.Item name="lastName" label="Tên"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!',
                              required: true,
                            },
                            {
                              type: 'string',
                              min: 1,
                              max: 255
                            },
                          ]}
                        >
                          <Input className="account-input" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[24, 0]} >
                      <Col span={24} md={24}>
                        <Form.Item name="phone" label="Số điện thoại"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!',
                              required: true,
                            },
                            {
                              type: 'string',
                              min: 10,
                              max: 10
                            },
                          ]}
                        >
                          <Input className="account-input" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[24, 0]} >
                      <Col span={24} md={24}>
                        <Form.Item name="email" label="Email"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!', required: true
                            },
                            {
                              type: 'email',
                            },]}
                        >
                          <Input className="account-input" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[24, 0]} >
                      <Col span={24} md={24}>
                        <Form.Item name="dob" label="Ngày sinh"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!',
                              required: true,
                            },
                          ]}
                        >

                          <DatePicker style={{ width: "50%", borderRadius: "2px" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} md={24}>
                        <Form.Item name="gender" label="Giới tính"
                          rules={[
                            {
                              message: 'Thông tin này không thể để trống!', required: true
                            }]}
                        >
                          <Radio.Group style={{ width: "50%", display: "flex", justifyContent: "space-between" }}>
                            <Radio value={true}>Nam</Radio>
                            <Radio value={false}>Nữ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "center" }}>
                      {/* <Button type="default" style={{ marginRight: "10px" }}>Back</Button>
                    <Button htmlType="submit" type="primary" style={{ marginLeft: "10px" }}>Save</Button> */}
                      <button style={{
                        height: "35px",
                        width: "180px",
                        padding: "0px 10px",
                        background: "rgb(253, 56, 56)",
                        border: "2px solid rgba(253, 56, 56,0.5)",
                        color: "#fff",
                        borderRadius: "5px"
                      }} htmlType="submit">Lưu thay đổi</button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      }
    </>
  )
}

export default Account