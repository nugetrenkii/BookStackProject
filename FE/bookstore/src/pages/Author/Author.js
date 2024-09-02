/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
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
    notification,
    Form,
    Popconfirm,
    Space,
    Input,
    Modal,
} from "antd";

import { CloseOutlined, EditTwoTone, PlusOutlined, SearchOutlined, ToTopOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { CreateAuthor, DeleteAuthor, GetAuthors, UpdateAuthor } from "../../axios/AuthorAPI";

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
        width: "20%",
    },
    {
        title: "NAME",
        dataIndex: "name",
        key: "name",
        width: "60%",
    },

    {
        title: "",
        key: "function",
        dataIndex: "function",
        width: "20%",
    },
];

function Author() {
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
    const history = useHistory()
    const [books, setBook] = useState()
    const [authors, setAuthor] = useState()
    const [isEdit, setIsEdit] = useState()
    const [page, setPage] = useState(1)
    const [key, setKey] = useState("")
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm()
    const [wait, setWait] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Thành công',
        });
    };

    useEffect(() => {
        fetchData(page, key);
    }, [page])

    const fetchData = async (page, key) => {
        setLoading(true)
        var res = await GetAuthors(page, 10, key, "ID")
        console.log(res)
        var data = []
        res.data.map((item, index) => (
            data.push({
                key: index,
                id: item?.id,
                name: (
                    <>
                        <div className="ant-employed">
                            {
                                item?.isDeleted == true ?
                                    <span style={{ textDecoration: 'line-through',color: '#ff4d4f' }}>{item?.name}</span>
                                    :
                                    <span style={{color: '#4096ff'}}>{item?.name}</span>
                            }
                        </div>
                    </>
                ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => showModal(item)}
                        />
                        {
                            (item?.isDeleted == false) ?
                                <Popconfirm title="Bạn muốn xóa author này?"
                                    onConfirm={() => handleDeleteAuthor(item?.id)}
                                >
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

        setAuthor(data)
        setTotal(res?.total)
        setLoading(false)
    }

    const showModal = (item) => {
        if (item != null) {
            form.setFieldsValue(
                {
                    name: item?.name
                }
            )
            setIsEdit(item?.id)
        }
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setWait(true)
        console.log(isEdit)
        var res
        if (isEdit) {
            res = await UpdateAuthor(isEdit, form.getFieldValue().name)
        }
        else {
            var a = form.getFieldValue()
            res = await CreateAuthor(a.name)
        }

        if (res?.code == 200) {
            setIsModalOpen(false);
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
        setWait(false)
    };

    const handleDeleteAuthor = async (id) => {
        setWait(true)
        var res = await DeleteAuthor(id)

        if (res?.code == 200) {
            setIsModalOpen(false);
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 2000);
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
            {contextHolder}
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Authors Table"
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
                                            <PlusOutlined style={{ fontSize: 18 }} />
                                            Add
                                        </Button>
                                    </Space>
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={authors}
                                    loading={loading}
                                    pagination={{
                                        position: ["bottomCenter"],
                                        current: page,
                                        total: total,
                                        showSizeChanger: false,
                                        onChange: (page) => {
                                            setPage(page);
                                        }
                                    }}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal title="Form create author" open={isModalOpen}
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
                        <Form.Item name="name" label="Name"
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
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default Author;
