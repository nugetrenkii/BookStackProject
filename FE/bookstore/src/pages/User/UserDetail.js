import { useEffect, useState } from "react";

import {
    Row,
    Col,
    Card,
    Button,
    Radio,
    Switch,
    Upload,
    message,
    Form,
    Input,
    DatePicker,
    Select,
    Image,
    Typography,
    Popconfirm,
    InputNumber,
    notification,
} from "antd";

import axios from "axios";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { UploadOutlined } from "@ant-design/icons";
import Loading from "../../components/loading/Loading.js";
import { GetUserById, UpdateUser } from "../../axios/UserAPI.js";
import dayjs from 'dayjs';

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { UploadImageAPI } from "../../axios/ImageAPI.js";
dayjs.extend(weekday);
dayjs.extend(localeData);
// dayjs.locale("en");
dayjs.locale("vi");


const { Title } = Typography;
function UserDetails() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState();
    const [form] = Form.useForm()
    const params = useParams()
    const [wait, setWait] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Thành công',
            // description:
            //     'Bạn đã xóa thành công user.',
        });
    };

    useEffect(() => {
        fecthData(params?.id)
    }, [])

    const fecthData = async (id) => {
        var res = await GetUserById(id)
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
        // formWalet.setFieldsValue({
        //     money: res?.data?.data?.walet.money
        // })

        // setFormData(res?.data?.data)
    }

    const onFinish = async (values) => {
        setWait(true)
        var url = await UploadImageAPI(values.avatar.file)

        var user = {
            firstName: values?.firstName,
            lastName: values?.lastName,
            email: values?.email,
            phone: values?.phone,
            gender: values?.gender,
            avatar: url,
            dob: dayjs(values?.dob).add(1, 'day').toJSON().slice(0, 10)
        }

        console.log(user)

        var res = await UpdateUser(params?.id, user)
        if (res?.code == 200) {
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        setWait(false)
    }

    return (
        <>
            {
                wait && <Loading />
            }
            {contextHolder}
            <Row gutter={[24, 0]}>
                <Col xs={24} md={16} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">User Information</h6>}
                        className="header-solid h-full card-profile-information"
                        // extra={<Button type="link">{pencil}</Button>}
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                    >
                        <Form
                            form={form}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 24,
                            }}
                            layout="vertical"
                            onFinish={onFinish}
                        // disabled={componentDisabled}
                        // style={{
                        //     maxWidth: 600,
                        // }}
                        >
                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item name="firstName" label="First name"
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
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item name="lastName" label="Last name"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                type: 'string',
                                            },
                                        ]}
                                    >
                                        <Input />
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
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item name="email" label="Email"
                                rules={[{ required: true },
                                {
                                    type: 'email',
                                },]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="Phone"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'string',
                                        min: 10,
                                        max: 10
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item name="dob" label="Day of birth"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Gender" name="gender"
                                        rules={[{ required: true }]}
                                    >
                                        <Radio.Group name="gender" >
                                            <Radio value={true}> Male </Radio>
                                            <Radio value={false}> FeMale </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ textAlign: "center" }}>
                                <Button onClick={() => history.goBack()} type="default" style={{ marginRight: "10px" }}>Back</Button>
                                <Button htmlType="submit" type="primary" style={{ marginLeft: "10px" }}>Save</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={24} md={8}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} className="mb-24">
                            <Card
                                bordered={false}
                                title={<h6 className="font-semibold m-0">Avatar</h6>}
                                className="header-solid h-full"
                                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                            >
                                <Row gutter={[24, 24]} style={{ textAlign: "center" }}>
                                    <Col span={24} md={24}>
                                        <Image
                                            width={300}
                                            height={300}
                                            src={imageURL}
                                            style={{ objectFit: "cover" }}
                                        />
                                        {/* <div className="avatar-info">
                                            <Title level={1} style={{ marginBottom: "0" }}>{formData?.name}</Title>
                                            <p>{formData?.email}</p>
                                        </div> */}
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default UserDetails;
