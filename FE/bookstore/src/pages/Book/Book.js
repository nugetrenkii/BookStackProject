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
    Form,
    Modal,
    Space,
    Input,
    InputNumber,
    DatePicker,
    Select,
} from "antd";

import { PlusOutlined, ToTopOutlined } from "@ant-design/icons";
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
import { CreateBook, DeleteBook, GetBooks } from "../../axios/BookAPI";
import { CheckCircleOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditTwoTone, SearchOutlined, UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { GetTags } from "../../axios/TagAPI";
import { GetAuthors } from "../../axios/AuthorAPI";
import { GetPublishers } from "../../axios/PublisherAPI";
import { CreateOrder } from "../../axios/OrderAPI";
import { UploadImageAPI } from "../../axios/ImageAPI";
import Loading from "../../components/loading/Loading";

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
        title: "TITLE",
        dataIndex: "title",
        key: "title",
        width: "30%",
    },
    {
        title: "DESCRIPTION",
        key: "description",
        dataIndex: "description",
    },
    {
        title: "COUNT",
        key: "count",
        dataIndex: "count",
    },
    {
        title: "AUTHOR",
        key: "author",
        dataIndex: "author",
    },
    {
        title: "PUBLISHER",
        key: "publisher",
        dataIndex: "publisher",
    },
    {
        title: "",
        key: "function",
        dataIndex: "function",
    },
];

function Book() {
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
    const history = useHistory()
    const [books, setBook] = useState()
    const [tags, setTag] = useState()
    const [authors, setAuthor] = useState()
    const [publishers, setPublisher] = useState()
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
        console.log("fetch");
        fetchData(page, key);
    }, [page])

    const fetchData = async (page, key) => {
        setLoading(true)
        var res = await GetBooks(page, 10, key, "ID")
        console.log(res)
        var data = []
        res.data.map((item, index) => (
            data.push({
                key: index,
                id: item?.id,
                title: (
                    <>
                        <a href="/book">
                            <Avatar.Group>
                                <Avatar
                                    className="shape-avatar"
                                    shape="square"
                                    size={40}
                                    src={item?.image}
                                ></Avatar>
                                <div className="avatar-info">
                                    {
                                        item?.isDeleted == true ?
                                            // <span style={{ textDecoration: 'line-through', color: '#ff4d4f' }}>{item?.name}</span>
                                            <Title level={5} style={{ textDecoration: 'line-through', color: '#ff4d4f' }}>{item?.title}</Title>
                                            :
                                            // <span style={{ color: '#4096ff' }}>{item?.name}</span>
                                            <Title level={5} style={{ color: '#4096ff' }}>{item?.title}</Title>
                                    }
                                    {/* <Title level={5}>{item?.title}</Title> */}
                                </div>
                            </Avatar.Group>{" "}
                        </a>
                    </>
                ),
                description: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.description?.slice(0, 50)}</span>
                        </div>
                    </>
                ),
                count: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.count}</span>
                        </div>
                    </>
                ),
                author: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.author?.name}</span>
                        </div>
                    </>
                ),
                publisher: (
                    <>
                        <div className="ant-employed">
                            <span>
                                {
                                    item?.publisher?.name
                                }
                            </span>
                        </div>
                    </>
                ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("book/" + item?.id)}
                        />
                        {
                            (item?.isDeleted == false) ?
                                <Popconfirm title="Bạn muốn xóa sách này?"
                                    onConfirm={() => handleDeleteBook(item?.id)}
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
        setBook(data)
        setTotal(res?.total)
        
        var res = await GetTags(1, 10000, "", "ID")
        if (res?.code == 200)
            setTag(res?.data)

        var res = await GetAuthors(1, 10000, "", "ID")
        if (res?.code == 200)
            setAuthor(res?.data)

        var res = await GetPublishers(1, 10000, "", "ID")
        if (res?.code == 200)
            setPublisher(res?.data)

        setLoading(false)
    }

    const handleDeleteBook = async (id) => {
        console.log(id)
        var res = await DeleteBook(id)
        console.log(res)
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
        var url = await UploadImageAPI(a.image.file)
        var book = {
            title: a.title,
            description: a.description,
            language: a.language,
            price: a.price,
            publishDate: a.publishDate.toJSON(),
            numberOfPages: a.numberOfPages,
            count: a.count,
            publisherId: a.publisherId,
            authorId: a.authorId,
            tagIds: a.tagIds,
            image : url,
        }
        var res = await CreateBook(book)
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
                            title="Books Table"
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
                                    dataSource={books}
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
                <Modal title="Form create book" open={isModalOpen}
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
                        <Form.Item name="title" label="Title"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    max: 255
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="description" label="Description"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    // max: 255
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item name="language" label="Language"
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
                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item name="price" label="Price"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber min={10000} max={10000000} />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item name="publishDate" label="Publish date"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item name="numberOfPages" label="Number of pages"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber min={1} max={2500} />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item name="count" label="Count"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber min={1} max={100} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item name="publisherId" label="Publisher"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select >
                                        {
                                            publishers?.map((publisher, index) => (
                                                <Select.Option value={publisher?.id}>{publisher?.name}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item name="authorId" label="Author"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select>
                                        {
                                            authors?.map((author, index) => (
                                                <Select.Option value={author?.id}>{author?.name}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="tagIds" label="Tag"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select mode="multiple">
                                {
                                    tags?.map((tag, index) => (
                                        <Select.Option value={tag?.id}>{tag?.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item name="image" label="Image"
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
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default Book;
