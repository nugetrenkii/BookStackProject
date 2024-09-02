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
    Form,
    notification,
    Space,
    Modal,
    Input,
    Select,
    InputNumber,
    DatePicker,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import ava1 from "../../assets/images/logo-shopify.svg";
import ava2 from "../../assets/images/logo-atlassian.svg";
import ava3 from "../../assets/images/logo-slack.svg";
import ava5 from "../../assets/images/logo-jira.svg";
import ava6 from "../../assets/images/logo-invision.svg";
import face6 from "../../assets/images/face-6.jpeg";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import { CreateUser, DeleteUser, GetUsers } from "../../axios/UserAPI";
import { CheckCircleOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditTwoTone, SearchOutlined, UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loading from "../../components/loading/Loading";
import { UploadImageAPI } from "../../axios/ImageAPI";

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
        title: "NAME",
        dataIndex: "name",
        key: "name",
        width: "25%",
    },
    {
        title: "STATUS",
        key: "status",
        dataIndex: "status",
    },
    {
        title: "EMAIL",
        key: "email",
        dataIndex: "email",
    },
    {
        title: "PHONE",
        key: "phone",
        dataIndex: "phone",
    },
    {
        title: "DAY OF BIRTH",
        key: "dob",
        dataIndex: "dob",
    },
    {
        title: "",
        key: "function",
        dataIndex: "function",
    },
];

function Users() {
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
    const history = useHistory()
    const [users, setUser] = useState()
    const [page, setPage] = useState(1)
    const [key, setKey] = useState("")
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()
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
        console.log("fetch");
        fetchData(page, key);
    }, [page])

    const fetchData = async (page, key) => {
        setLoading(true)
        var res = await GetUsers(page, 10, key, "ID")
        console.log(res)
        var data = []
        res.data.map((item, index) => (
            data.push({
                key: index,
                id: item?.id,
                name: (
                    <>
                        <a href="/user">
                            <Avatar.Group>
                                <Avatar
                                    className="shape-avatar"
                                    shape="square"
                                    size={40}
                                    src={item.avatar}
                                ></Avatar>
                                <div className="avatar-info">
                                    <Title level={5}>{item?.lastName + " " + item?.firstName}</Title>
                                    {/* <p>john@mail.com</p> */}
                                </div>
                            </Avatar.Group>{" "}
                        </a>
                    </>
                ),
                status: (
                    <>
                        {
                            item?.isDeleted ?
                                <Button type="danger" className="tag-primary">
                                    DELETE
                                </Button>
                                :
                                <Button type="primary" className="tag-primary">
                                    ACTIVE
                                </Button>
                        }
                    </>
                ),
                email: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.email}</span>
                        </div>
                    </>
                ),
                phone: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.phone}</span>
                        </div>
                    </>
                ),
                dob: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.dob?.slice(0, 10)}</span>
                        </div>
                    </>
                ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("user/" + item?.id)}
                        />
                        {
                            item?.isDeleted == false ?
                                <Popconfirm title="Bạn muốn xóa người dùng này"
                                    onConfirm={() => handleDeleteUser(item?.id)}>
                                    <CloseOutlined
                                        style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                                    />
                                </Popconfirm>
                                : <></>
                        }
                    </>
                )
            })
        ))

        setUser(data)
        setTotal(res?.total)
        setLoading(false)
    }

    const handleDeleteUser = async (id) => {
        var res = await DeleteUser(id);
        if (res?.code == 200) {
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setWait(true)
        var a = form.getFieldValue()
        var url = await UploadImageAPI(a.avatar.file)
        var user = {
            firstName: a.firstName,
            lastName: a.lastName,
            avatar: url,
            phone: a.phone,
            email: a.email,
            username: a.username,
            password: a.password,
            gender: a.gender,
            dob: a.dob.toJSON()
        }

        var res = await CreateUser(user)
        if (res?.code == 200) {
            setIsModalOpen(false);
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        setWait(false)
    };
    const handleSearch = () => {
        fetchData(page, key)
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>

            {
                wait && <Loading />
            }
            {contextHolder}
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Users Table"
                            extra={
                                <>
                                    <Space>
                                        <Input onChange={e => setKey(e.target.value)} />
                                        <Button type="primary" onClick={handleSearch}>
                                            {/* <SearchOutlined /> */}
                                            <SearchOutlined style={{ fontSize: 18 }} />
                                            Search
                                        </Button>
                                        <Button type="success" onClick={showModal}>
                                            <UserAddOutlined style={{ fontSize: 18 }} />
                                            Add
                                        </Button>
                                    </Space>
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={users}
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
                <Modal title="Form create user" open={isModalOpen}
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

                        <Form.Item name="avatar" label="Avatar"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Upload
                                multiple={false}
                                listType="picture"
                                beforeUpload={() => false}
                                defaultFileList={[]}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                            {/* <Input name="avatar" /> */}
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
                                <Form.Item name="username" label="Username"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'string',
                                            min: 6,
                                            max: 32
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item name="password" label="Password"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'string',
                                            min: 6
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
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
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default Users;
