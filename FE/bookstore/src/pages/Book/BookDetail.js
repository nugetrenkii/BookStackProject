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
import { GetBookById, UpdateBook } from "../../axios/BookAPI.js";
import dayjs from 'dayjs';

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import TextArea from "antd/lib/input/TextArea.js";
import { GetTags } from "../../axios/TagAPI.js";
import { GetAuthors } from "../../axios/AuthorAPI.js";
import { GetPublishers } from "../../axios/PublisherAPI.js";
import { UploadImageAPI } from "../../axios/ImageAPI.js";
dayjs.extend(weekday);
dayjs.extend(localeData);
// dayjs.locale("en");
dayjs.locale("vi");


const { Title } = Typography;
function BookDetail() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState();
    const [book, setBook] = useState()
    const [tags, setTag] = useState()
    const [authors, setAuthor] = useState()
    const [publishers, setPublisher] = useState()
    const [form] = Form.useForm()
    const params = useParams()
    const [wait, setWait] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            // description:
            //     'Bạn đã xóa thành công book.',
        });
    };

    useEffect(() => {
        fecthData(params?.id)
    }, [])

    const fecthData = async (id) => {
        var res = await GetBookById(id)
        setBook(res?.data)
        var data = []
        res?.data?.tags.forEach((item, index) => {
            data.push(item.id)
        });
        form.setFieldsValue({
            title: res?.data?.title,
            description: res?.data?.description,
            numberOfPages: res?.data?.numberOfPages,
            language: res?.data?.language,
            count: res?.data?.count,
            price: res?.data?.price,
            image: res?.data?.image,
            publisherId: res?.data?.publisher?.id,
            authorId: res?.data?.author?.id,
            tags: data,
            // tags
            publishDate: dayjs(res?.data?.publishDate?.slice(0, 10))
        })
        setImageURL(res?.data?.image)

        var res = await GetTags(1, 10000, "", "ID")
        if (res?.code == 200)
            setTag(res?.data)

        var res = await GetAuthors(1, 10000, "", "ID")
        if (res?.code == 200)
            setAuthor(res?.data)

        var res = await GetPublishers(1, 10000, "", "ID")
        if (res?.code == 200)
            setPublisher(res?.data)

    }

    const onFinish = async (values) => {
        setWait(true)
        if (values.image.file) {
            var url = await UploadImageAPI(values.image.file)
            console.log((url));
        }

        var book = {
            title: values.title,
            description: values.description,
            numberOfPages: values.numberOfPages,
            language: values.language,
            count: values.count,
            price: values.price,
            image: url ? url : imageURL,
            publisherId: values.publisherId,
            authorId: values.authorId,
            tagIds: values.tags,
            publishDate: dayjs(values?.dob).toJSON().slice(0, 10)
        }
        // console.log(params?.id);
        // console.log(book);
        var res = await UpdateBook(params?.id, book)
        if (res?.code == 200) {
            openNotificationWithIcon('success', "Thành công")
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        else
            openNotificationWithIcon('error', "Thất bại")

        setWait(false)
    }

    return (
        <>
            {
                wait && <Loading />
            }
            {contextHolder}

            {/* <Row gutter={[24, 0]}>
                <Col xs={24} md={16} className="mb-24">
                    <Select defaultValue={form.authorId}>
                        <Select.Option >sfdfsdfsd</Select.Option>
                    </Select>
                </Col>
            </Row> */}
            <Row gutter={[24, 0]}>
                <Col xs={24} md={16} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Book Information</h6>}
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
                            <Form.Item name="title" label="Title"
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
                            <Form.Item name="description" label="Description"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'string',
                                    },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>

                            <Form.Item name="image" label="Image">
                                <Upload
                                    multiple={false}
                                    listType="picture"
                                    beforeUpload={() => false}
                                    defaultFileList={[]}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>

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
                                    <Form.Item label="Publish date" name="publishDate"
                                        rules={[{ required: true }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item name="count" label="Count"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={1} max={100} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item name="price" label="Price"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={10000} max={10000000} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="language" label="Language"
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

                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item name="authorId" label="Author"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select defaultValue={form.authorId}>
                                            {
                                                authors?.map((author, index) => (
                                                    <Select.Option value={author?.id}>{author?.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Publisher" name="publisherId"
                                        rules={[{ required: true }]}
                                    >
                                        <Select defaultValue={form.publisherId}>
                                            {
                                                publishers?.map((publisher, index) => (
                                                    <Select.Option value={publisher?.id}>{publisher?.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Form.Item label="Tag" name="tags"
                                rules={[{ required: true }]}
                            >
                                <Select mode="multiple"
                                    defaultValue={form.tags}
                                >
                                    {
                                        tags?.map((tag, index) => (
                                            <Select.Option value={tag?.id}>{tag?.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

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
                                title={<h6 className="font-semibold m-0">Image</h6>}
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

export default BookDetail;
