import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Upload,
    message,
    Progress,
    Button,
    Avatar,
    Typography,
    Popconfirm,
    notification,
    Modal,
    Form,
    Space,
    Input,
    Select,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Images
import ava1 from "../../assets/images/logo-shopify.svg";
import ava2 from "../../assets/images/logo-atlassian.svg";
import ava3 from "../../assets/images/logo-slack.svg";
import ava5 from "../../assets/images/logo-jira.svg";
import ava6 from "../../assets/images/logo-invision.svg";
import face6 from "../../assets/images/face-6.jpeg";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import { DeleteOrder, GetOrders } from "../../axios/OrderAPI";
import { CheckCircleOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditTwoTone, SearchOutlined, UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import "./Order.css"

const { Title } = Typography;

const formProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
        authorization: "authorization-text",
    },
    onChange(info) {
        if (info.file.status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
// table code start
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "STATUS",
        key: "status",
        dataIndex: "status",
    },
    {
        title: "DESCRIPTION",
        key: "description",
        dataIndex: "description",
    },
    {
        title: "USER",
        key: "user",
        dataIndex: "user",
    },
    {
        title: "SHIPPING MODE",
        key: "shippingMode",
        dataIndex: "shippingMode",
    },
    // {
    //     title: "ADDRESS",
    //     key: "address",
    //     dataIndex: "address",
    // },
    {
        title: "",
        key: "function",
        dataIndex: "function",
    },
];

function Order() {
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
    const history = useHistory()
    const [orders, setOrder] = useState()
    const [page, setPage] = useState(1)
    const [key, setKey] = useState("")
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Thành công',
            description:
                'Bạn đã xóa thành công order.',
        });
    };

    useEffect(() => {
        console.log("fetch");
        fetchData(page, key);
    }, [page])

    const fetchData = async (page, key) => {
        setLoading(true)
        var res = await GetOrders(page, 10, key, "ID")
        console.log(res)
        var data = []
        res.data.map((item, index) => (
            data.push({
                key: index,
                id: item?.id,
                // name: (
                //     <>
                //         <a href="/user">
                //             <Avatar.Group>
                //                 <Avatar
                //                     className="shape-avatar"
                //                     shape="square"
                //                     size={40}
                //                     src={item.avatar}
                //                 ></Avatar>
                //                 <div className="avatar-info">
                //                     <Title level={5}>{item?.lastName + " " + item?.firstName}</Title>
                //                     {/* <p>john@mail.com</p> */}
                //                 </div>
                //             </Avatar.Group>{" "}
                //         </a>
                //     </>
                // ),
                status: (
                    <>
                        {/* {
                            item?.isDelete ?
                                <Button type="danger" className="tag-primary">
                                    DELETE
                                </Button>
                                :
                                <Button type="primary" className="tag-primary">
                                    ACTIVE
                                </Button>
                        } */}
                        <Button type="primary" className={`tag-status ${item?.status?.toLowerCase()}`}>
                            {item?.status == "DON" ? "DONE" :
                                item?.status == "INP" ? "IN PROGRESS" :
                                    item?.status == "CAN" ? "CANCEL" : "NEW"}
                        </Button>
                    </>
                ),
                user: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.user?.lastName + " " + item?.user?.firstName}</span>
                        </div>
                    </>
                ),
                description: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.description}</span>
                        </div>
                    </>
                ),
                shippingMode: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.shippingMode?.name}</span>
                        </div>
                    </>
                ),
                // address: (
                //     <>
                //         <div className="ant-employed">
                //             <span>
                //                 {
                //                     item?.address.phone + ", " +
                //                     item?.address?.street + ", " +
                //                     item?.address?.state + ", " +
                //                     item?.address?.city

                //                 }
                //             </span>
                //         </div>
                //     </>
                // ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("order/" + item?.id)}
                        />
                        {/* {
                            item?.isDeleted == false ?
                                <Popconfirm title="Bạn muốn hủy order này"
                                    onConfirm={() => handleDeleteOrder(item?.id)}>
                                    <CloseOutlined
                                        style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                                    />
                                </Popconfirm>
                                :
                                <></>
                        } */}
                    </>
                )
            })
        ))

        setOrder(data)
        setTotal(res?.total)
        setLoading(false)
    }
    const handleDeleteOrder = async (id) => {
        var res = await DeleteOrder(id);
        if (res?.code == 200) {
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    }
    const handleOk = async () => {
        // setWait(true)
        // var a = form.getFieldValue()

        // //const url = await UploadImageAPI(a.avatar.file)

        // var user = {
        //     firstName: a.firstName,
        //     lastName: a.lastName,
        //     avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
        //     phone: a.phone,
        //     email: a.email,
        //     username: a.username,
        //     password: a.password,
        //     gender: a.gender,
        //     dob: a.dob.toJSON()
        // }
        // console.log(user)

        // var res = await CreateUser(user)
        // if (res?.code == 200) {
        //     setIsModalOpen(false);
        //     openNotificationWithIcon('success')
        //     setTimeout(() => {
        //         window.location.reload()
        //     }, 2000);
        // }
        // setWait(false)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleSearch = () => {
        fetchData(page, key)
    }
    return (
        <>
            {contextHolder}
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Orders Table"
                            extra={
                                <>
                                    <Space>
                                        <Input onChange={e => setKey(e.target.value)} />
                                        <Button type="primary" onClick={handleSearch}>
                                            {/* <SearchOutlined /> */}
                                            <SearchOutlined style={{ fontSize: 18 }} />
                                            Search
                                        </Button>
                                        {/* <Button type="success" onClick={showModal}>
                                            <UserAddOutlined style={{ fontSize: 18 }} />
                                            Add
                                        </Button> */}
                                    </Space>
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={orders}
                                    pagination={{
                                        position: ["bottomCenter"],
                                        current: page,
                                        total: total,
                                        showSizeChanger: false,
                                        onChange: (page) => {
                                            setPage(page);
                                        }
                                    }}
                                    loading={loading}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                {/* <Modal title="Form create order" open={isModalOpen}
                    onOk={() => {
                        form.validateFields().then(() => {
                            handleOk()
                        });
                    }}
                    onCancel={handleCancel} visible={isModalOpen}
                    width={800}
                >
                    <Form
                        form={form}
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        layout="vertical"
                    >
                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item name="userId" label="User"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option>A</Select.Option>
                                        <Select.Option>A</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item name="addressId" label="Address"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option>A</Select.Option>
                                        <Select.Option>A</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item name="status" label="Status"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option>A</Select.Option>
                                        <Select.Option>A</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item name="shippingModeId" label="Shipping mode"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option>A</Select.Option>
                                        <Select.Option>A</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="Description"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                    </Form>
                </Modal> */}
            </div >
        </>
    );
}

export default Order;
