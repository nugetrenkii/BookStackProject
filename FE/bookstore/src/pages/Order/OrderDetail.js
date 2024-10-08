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
    Avatar,
    Table,
} from "antd";

import axios from "axios";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { UploadOutlined } from "@ant-design/icons";
import Loading from "../../components/loading/Loading.js";
import { GetOrderById, UpdateOrder } from "../../axios/OrderAPI.js";
import dayjs from 'dayjs';

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import TextArea from "antd/lib/input/TextArea.js";
import { GetShippingModes } from "../../axios/ShippingModeAPI.js";
import { GetAuthors } from "../../axios/AuthorAPI.js";
import { GetPublishers } from "../../axios/PublisherAPI.js";
dayjs.extend(weekday);
dayjs.extend(localeData);
// dayjs.locale("en");
dayjs.locale("vi");
const columns = [
    {
        title: "ID",
        dataIndex: "index",
        key: "index",
        width: "10%",
    },
    {
        title: "SÁCH",
        dataIndex: "title",
        key: "title",
    },

    {
        title: "GIÁ",
        key: "price",
        dataIndex: "price",
    },
    {
        title: "SỐ LƯỢNG",
        key: "quantity",
        dataIndex: "quantity",
    },
];

const { Title } = Typography;
function OrderDetail() {
    const history = useHistory()
    const [order, setOrder] = useState()
    const [shippingModes, setShippingMode] = useState()
    const [books, setBook] = useState()
    const [form] = Form.useForm()
    const params = useParams()
    const [wait, setWait] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            // description:
            //     'Bạn đã xóa thành công order.',
        });
    };

    useEffect(() => {
        fecthData(params?.id)
    }, [])

    const fecthData = async (id) => {
        var res = await GetOrderById(id)
        console.log(res);
        var data = []
        res?.data?.orderBooks?.map((item, index) => (
            data.push({
                key: index,
                index: (
                    <>
                        <div className="ant-employed">
                            <span>
                                {
                                    index+1
                                }
                            </span>
                        </div>
                    </>
                ),
                title: (
                    <>
                        <a href={`/book/${item?.book?.id}`}>
                            <Avatar.Group>
                                <Avatar
                                    className="shape-avatar"
                                    shape="square"
                                    size={40}
                                    src={item?.book?.image}
                                ></Avatar>
                                <div className="avatar-info">
                                    <Title level={5} style={{ color: '#4096ff' }}>{item?.book?.title}</Title>
                                </div>
                            </Avatar.Group>{" "}
                        </a>
                    </>
                ),
                price: (
                    <>
                        <div className="ant-employed">
                            <span>
                                {
                                    item?.price
                                }
                            </span>
                        </div>
                    </>
                ),
                quantity: (
                    <>
                        <div className="ant-employed">
                            <span>
                                {
                                    res?.data?.orderBooks[index]?.quantity
                                }
                            </span>
                        </div>
                    </>
                )
            })
        ))
        setBook(data)
        form.setFieldsValue({
            description: res?.data?.description,
            user: res?.data?.user?.lastName + " " + res?.data?.user?.firstName,
            address: res?.data?.type === "ONLINE" ? res?.data?.address?.phone + ", " + res?.data?.address?.street + ", " + res?.data?.address?.state + ", " + res?.data?.address?.city : res?.data?.address.state,
            status: res?.data?.status,
            total: res?.data?.totalPrice,
            shippingMode: res?.data?.shippingMode?.id,
            type: res?.data?.type
        })
        // setImageURL(res?.data?.image)

        var res = await GetShippingModes(1, 10000, "", "ID")
        if (res?.code == 200)
            setShippingMode(res?.data)

    }

    const onFinish = async (values) => {
        setWait(true);
        var order = {
            description: values.description,
            status: values.status,
            shippingModeId: values.shippingMode,
        };
    
        try {
            var res = await UpdateOrder(params?.id, order);
            if (res?.code === 200) {
                openNotificationWithIcon('success', "Thành công");
                
                // Instead of reloading the page, re-fetch the data or update the state
                await fecthData(params?.id); // Re-fetch the data to get the updated state
                
                // Optionally, update the local state directly without fetching if feasible
                // setOrder((prevOrder) => ({ ...prevOrder, ...order }));
            } else {
                openNotificationWithIcon('error', "Thất bại");
            }
        } catch (error) {
            console.error("Update failed:", error);
            openNotificationWithIcon('error', "Error updating order");
        } finally {
            setWait(false);
        }
    };
    
    const statusLabels = {
        NEW: "Mới",
        COM: "Xác nhận",
        SHI: "Giao hàng",
        CAN: "Hủy",
        DON: "Hoàn thành"
    };
    
    const getStatusOptions = () => {
        const currentStatus = form.getFieldValue("status");
        switch (currentStatus) {
            case "NEW":
                return ["NEW", "COM", "CAN"];
            case "COM":
                return ["COM", "SHI"];
            case "SHI":
                return ["SHI", "DON"];
            case "CAN":
                return ["CAN"]; // No options allowed
            case "DON":
                return ["DON"];
            default:
                return [];
        }
    };
    

    return (
        <>
            {
                wait && <Loading />
            }
            {contextHolder}
            <Row gutter={[24, 0]}>
                <Col xs={24} md={24} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Thông tin đơn hàng</h6>}
                        className="header-solid h-full card-profile-information"
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
                        >

                            <Form.Item name="user" label="Người dùng"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'string',
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item name="address" label="Địa chỉ" 
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'string',
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item name="total" label="Tổng tiền"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item name="description" label="Mô tả"
                                rules={[
                                    {
                                        type: 'string',
                                    },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item 
                                        name="status" 
                                        label="Trạng thái"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                    <Select>
                                        {getStatusOptions().map((status) => (
                                            <Select.Option key={status} value={status}>
                                                {statusLabels[status]} {/* Display the name instead of the value */}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item name="shippingMode" label="Vận chuyển"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select defaultValue={form.shippingMode}>
                                            {
                                                shippingModes?.map((shippingMode, index) => (
                                                    <Select.Option value={shippingMode?.id}>{shippingMode?.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
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
            </Row>
            <Row gutter={[24, 0]}>
                <Col xs={24} md={24} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Chi tiết đơn hàng</h6>}
                        className="header-solid h-full card-profile-information"
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                    >
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={books}
                                pagination={false}
                                className="ant-border-space"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default OrderDetail;
