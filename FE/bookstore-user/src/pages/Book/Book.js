
import { Button, Card, Carousel, Checkbox, Col, Image, Input, List, Pagination, Radio, Row, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { GetBookTags, GetBooks } from '../../axios/BookAPI';
import "./Book.css"
import Waiting from '../Waiting/Waiting';
import { GetTags } from '../../axios/TagAPI';
const data = [
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 5',
    },
    {
        title: 'Title 6',
    },
];
const contentStyle = {
    margin: 0,
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    background: '#364d79',
    borderRadius: "10px"
};
function Book(props) {
    const location = useLocation();
    const [wait, setWait] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [key, setkey] = useState(location?.state?.search? location?.state?.search : "")
    const [tagId, setTagId] = useState(location?.state?.key? location?.state?.key : 0)
    const [sortBy, setSortBy] = useState("ID")
    const [priceSort, setPriceSort] = useState([])
    const [books, setBook] = useState([])
    const [tags, setTag] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        fecthData(page, key, sortBy, tagId)
    }, [page])

    const fecthData = async (page, key, sortBy, tagId) => {
        // console.log("fsdfsd" );

        setWait(true)
        var res = await GetBookTags(page, 15, key, sortBy, tagId)
        if (res?.code == 200) {
            setBook(res?.data)
            setTotal(res?.total)
        }

        var res = await GetTags(1, 10000, "", "ID")
        if (res?.code == 200) {
            setTag(res?.data)
        }

        setWait(false)
    }
    return (
        <>
            {
                wait ? <Waiting /> : <></>
            }
            <div className='book-main'
                style={{
                    marginTop: 20
                }}>
                <Row gutter={[24, 0]}>
                    <Col span={24} md={6} className="mb-24">
                        <Card
                            title={
                                (<h3 style={{
                                    margin: 0
                                }}>BỘ LỌC</h3>)
                            }
                            bordered={false}
                            className="book-filter"
                            // bodyStyle={{
                            //     display: 'none',
                            // }}
                            style={{
                                borderRadius: 0
                            }}
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <div style={{
                                    marginBottom: "10px"
                                }}>Tên sản phẩm</div>
                                <Input
                                defaultValue={key}
                                    onChange={(e) => setkey(e.target.value)}
                                    className='book-filter-name'
                                    placeholder='Tên sản phẩm' style={{
                                        borderRadius: "2px",
                                        marginBottom: "10px"
                                    }}>

                                </Input>
                                <div style={{
                                    marginBottom: "10px"
                                }}>Danh mục sản phẩm</div>
                                <Select style={{
                                    borderRadius: "2px",
                                    marginBottom: "10px"
                                }}
                                    showSearch
                                    // placeholder = "Tất cả"
                                    optionFilterProp="children"
                                    defaultValue={tagId}
                                    onChange={(e) => setTagId(e)}
                                // onSearch={onSearch}
                                >
                                    <Select.Option value={0}>
                                        Tất cả
                                    </Select.Option>
                                    {
                                        tags?.map((tag, index) => (
                                            <Select.Option value={tag?.id}>
                                                {tag?.name}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                                {/* <Input
                                    onChange={(e) => setkey(e.target.value)}
                                    className='book-filter-name'
                                    placeholder='Tên sản phẩm' style={{
                                        borderRadius: "2px",
                                        marginBottom: "10px"
                                    }}>

                                </Input> */}
                                <div style={{
                                    marginBottom: "10px"
                                }}>Giá</div>
                                <Radio.Group>
                                    <Radio value={"PRICE"} onChange={() => setSortBy("PRICE")}>Giá tăng dần</Radio>
                                    <Radio value={"PRICE_DEC"} onChange={() => setSortBy("PRICE_DEC")}>Giá giảm dần</Radio>
                                </Radio.Group>
                                {/* <Checkbox onChange={() => setSortBy("PRICE")}></Checkbox>
                                <Checkbox onChange={() => setSortBy("PRICE_DEC")}></Checkbox> */}
                                {/* <Checkbox checked={priceSort[1]} onChange={() => setPriceSort([false, true, false, false, false])}>100.000 ₫ - 200.000 ₫</Checkbox>
                                <Checkbox checked={priceSort[2]} onChange={() => setPriceSort([false, false, true, false, false])}>200.000 ₫ - 400.000 ₫</Checkbox>
                                <Checkbox checked={priceSort[3]} onChange={() => setPriceSort([false, false, false, true, false])}>400.000 ₫ - 500.000 ₫</Checkbox>
                                <Checkbox checked={priceSort[4]} onChange={() => setPriceSort([false, false, false, false, true])}>500.000 ₫ Trở lên</Checkbox> */}
                                <button style={{
                                    marginTop: "24px",
                                    height: "35px",
                                    width: "100%",
                                    padding: "0px 10px",
                                    background: "rgb(253, 56, 56)",
                                    border: "2px solid rgba(253, 56, 56,0.5)",
                                    color: "#fff",
                                    borderRadius: "5px"
                                }} onClick={() => fecthData(page, key, sortBy, tagId)}>Tìm kiếm sản phẩm</button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={24} md={18} className="mb-24">
                        <Card style={{
                            borderRadius: 0
                        }}
                            className='book-card-list-book'
                            title={
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <span
                                    // className='home-icon-list-book'
                                    />
                                    <h3 style={{
                                        margin: 0
                                    }}>DANH SÁCH SẢN PHẨM</h3>
                                </div>
                            }
                        >
                            <List
                                className='book-list-book'
                                grid={{
                                    gutter: 12,
                                    xs: 1,
                                    sm: 2,
                                    md: 2,
                                    lg: 3,
                                    xl: 4,
                                    xxl: 5,
                                }}
                                dataSource={books}

                                renderItem={(item) => (
                                    <List.Item>
                                        <Link to={`/book/${item?.id}`}>
                                            <Card bordered={false}
                                                style={{
                                                    // outline: "none",
                                                    borderRadius: 0
                                                }}
                                                className='book-item'
                                            >
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        // alignItems:'center'
                                                    }}>
                                                        <Image src={item?.image} preview={false}
                                                            height={215}
                                                            width={170}
                                                            style={{
                                                                objectFit: "cover"
                                                            }}
                                                        ></Image>
                                                        <div
                                                        >
                                                            <div
                                                                className='book-item-title'
                                                            >{item?.title}</div>
                                                            <div
                                                                className='book-item-detail-price'
                                                            >
                                                                {Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND',
                                                                }).format(item?.price)}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </List.Item>
                                )}
                            />
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                {/* <Button style={{
                                color: "#C92127",
                                border: "2px solid #C92127",
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "40px",
                                width: "150px"
                            }}>Xem thêm</Button> */}
                                <Pagination
                                    current={page}
                                    onChange={(e) => setPage(e)}
                                    total={total}
                                    className='book-pagination'
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Book