import React, { useEffect, useState } from 'react'
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
import { DeleteRating, GetRatings } from '../../axios/RatingAPI';
import { CloseOutlined, EditTwoTone } from '@ant-design/icons';
import "./Rating.css"
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "RATE",
        dataIndex: "rate",
        key: "rate",
        width: "5%",
    },
    {
        title: "USER",
        dataIndex: "user",
        key: "user",
        width: "20%",
    },
    {
        title: "BOOK",
        dataIndex: "book",
        key: "book",
        width: "20%",
    },
    {
        title: "COMMENT",
        dataIndex: "comment",
        key: "comment",
        width: "45%",
    },

    {
        title: "",
        key: "function",
        dataIndex: "function",
        width: "5%",
    },
];

function Rating() {
    const [ratings, setRating] = useState([])
    const [page, setPage] = useState(1)
    const [key, setKey] = useState("")
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [wait, setWait] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const history = useHistory()

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Thành công',
        });
    };

    useEffect(() => {
        fetchData(page);
    }, [page])

    const fetchData = async (page) => {
        setLoading(true)
        var res = await GetRatings(page, 10, "", "ID")
        console.log(res)
        var data = []
        res.data.map((item, index) => (
            data.push({
                key: index,
                id: item?.id,
                rate: item?.rate + " Sao",
                user: (
                    <>
                        <div className="ant-employed link-to" onClick={()=>history.push(`/user/${item?.user?.id}`)}>
                            {
                                item?.isDeleted == true ?
                                    <span style={{ textDecoration: 'line-through', color: '#ff4d4f' }}>{item?.user?.lastName + " " + item?.user?.firstName}</span>
                                    :
                                    <span style={{ color: '#4096ff' }}>{item?.user?.lastName + " " + item?.user?.firstName}</span>
                            }
                        </div>
                    </>
                ),
                book: (
                    <>
                        <div className="ant-employed link-to" onClick={()=>history.push(`/book/${item?.book?.id}`)}>
                            {
                                item?.isDeleted == true ?
                                    <span style={{ textDecoration: 'line-through', color: '#ff4d4f' }}>{item?.book?.title}</span>
                                    :
                                    <span style={{ color: '#4096ff' }}>{item?.book?.title}</span>
                            }
                        </div>
                    </>
                ),
                comment: item?.comment,
                function: (
                    <>
                        {
                            (item?.isDeleted == false) ?
                                <Popconfirm title="Bạn muốn xóa rating này?"
                                onConfirm={() => handleDeleteRating(item?.id)}
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

        setRating(data)
        setTotal(res?.total)
        setLoading(false)
    }

    const handleDeleteRating = async (id) => {
        setWait(true)
        var res = await DeleteRating(id)

        if (res?.code == 200) {
            openNotificationWithIcon('success')
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }
        setWait(false)
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
                            title="Ratings Table"
                        // extra={
                        //     <>
                        //         <Space>
                        //             <Input onChange={e => setKey(e.target.value)} />
                        //             <Button type="primary" onClick={handleSearch}>
                        //                 <SearchOutlined style={{ fontSize: 18 }} />
                        //                 Search
                        //             </Button>
                        //             <Button type="success" onClick={showModal}>
                        //                 <PlusOutlined style={{ fontSize: 18 }} />
                        //                 Add
                        //             </Button>
                        //         </Space>
                        //     </>
                        // }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={ratings}
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
                {/* <Modal title="Form create tag" open={isModalOpen}
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
                </Modal> */}
            </div>
        </>
    )
}

export default Rating