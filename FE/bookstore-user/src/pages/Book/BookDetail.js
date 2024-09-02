import { Button, Card, Carousel, Col, Image, List, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GetBookById, GetBookByIds, GetBooksRecomend } from '../../axios/BookAPI';
import "./BookDetail.css";
import AddToCartAPI, { AddToCart } from '../../axios/CartAPI'
import Waiting from '../Waiting/Waiting';
import { GetRatingByBook, GetRatingByUser } from '../../axios/RateAPI';
import { StarFilled } from '@ant-design/icons';
import moment from 'moment';

function BookDetail() {
    const param = useParams()
    const navigate = useNavigate();
    const [book, setBook] = useState()
    const [rating, setRating] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [page, setPage] = useState(1)
    const [wait, setWait] = useState(false)
    const [bookRecomends, setBookRecomend] = useState([])

    useEffect(() => {
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // })
        window.scrollTo(0, 0)
        fecthData()
    }, [param, page])

    const fecthData = async () => {
        setWait(true)

        var res = await GetBookById(param?.id)
        if (res?.code == 200)
            setBook(res?.data)

        var res = await GetRatingByBook(param?.id, page)
        if (res?.code == 200)
            setRating(res?.data)

        var res = await GetBooksRecomend(param?.id)
        if (res?.code == 200) {
            var response = await GetBookByIds(res?.data)
            if (response?.code == 200) setBookRecomend(response?.data)
        }

        console.log(res);
        setWait(false)
    }

    const Add2Cart = async () => {
        setWait(true)
        var userId = localStorage.getItem('user')
        if (!userId) {
            var res = await AddToCart(localStorage.getItem('userId'), param?.id, quantity)
            if (res?.code == 200)
                setTimeout(() => {
                    navigate(`/cart`)
                }, 1000);
        }
        setWait(false)
    }

    const BuyNow = async () => {
        var order = {
            books: [],
            quantities: []
        }
        order.books.push(book)
        order.quantities.push({ count: quantity })

        if (order.books.length > 0) {
            sessionStorage.setItem('order', JSON.stringify(order))
            navigate('/order')
        } else alert("Vui lòng chọn sản phẩm")
    }
    return (
        <div className='book-detail-main'
            style={{
                marginTop: 20
            }}>
            {
                wait ? <Waiting /> : <></>
            }
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card
                        bordered={false}
                        className=""
                    >
                        <div style={{
                            display: "flex"
                        }}>
                            <div style={{
                                width: "40%"
                            }}>
                                <img src={book?.image} style={{
                                    width: "100%",
                                    height: "500px"
                                }}></img>
                            </div>
                            <div style={{
                                width: "60%"
                            }}
                                className='book-detail-information'
                            >
                                <div className='book-detail-name'><h2 style={{ margin: "0px", textTransform: "uppercase" }}>{book?.title}</h2></div>
                                <div className='book-detail-more'>
                                    <div style={{ margin: "20px 0px", display: "flex", alignItems: "center" }}>Nhà xuất bản: <div style={{ fontSize: "18px", fontWeight: "400", margin: "0px 0px 0px 10px", fontWeight: "600" }}>{book?.publisher?.name}</div></div>
                                    <div style={{ margin: "20px 0px", display: "flex", alignItems: "center" }}>Năm xuất bản: <div style={{ fontSize: "18px", fontWeight: "400", margin: "0px 0px 0px 10px", fontWeight: "600" }}>{book?.publishDate?.slice(0, 4)}</div></div>
                                    <div style={{ margin: "20px 0px", display: "flex", alignItems: "center" }}>Tác giả: <div style={{ fontSize: "18px", fontWeight: "400", margin: "0px 0px 0px 10px", fontWeight: "600" }}>{book?.author?.name}</div></div>
                                    <div style={{ margin: "20px 0px", display: "flex", alignItems: "center" }}>Ngôn ngữ: <div style={{ fontSize: "18px", fontWeight: "400", margin: "0px 0px 0px 10px", fontWeight: "600" }}>{book?.language}</div></div>
                                    <div style={{ display: "flex", alignItems: "center" }}>Thể loại: {book?.tags?.map((tag, index) => (
                                        <div style={{
                                            border: "1px solid rgba(180,180,180,0.8)",
                                            borderRadius: "2px",
                                            padding: "5px 15px",
                                            margin: "0px 10px",
                                            fontWeight: "600"
                                        }}>{tag?.name}</div>
                                    ))}</div>
                                </div>
                                <div className='book-detail-price'>
                                    {Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(book?.price)}
                                </div>
                                <div className='book-detail-quantity' style={{ margin: "0px 0px 20px 0px" }}>
                                    <div><h4 style={{ fontSize: "18px", margin: "0px" }}>Số lượng</h4></div>
                                    <div style={{
                                        display: "flex",
                                        border: "1px solid rgba(180,180,180,0.8)",
                                        borderRadius: "2px",
                                        height: "35px"

                                    }}>
                                        <button style={{
                                            border: "0",
                                            padding: "0px 20px",
                                            fontSize: "18px",
                                            fontWeight: "600"
                                        }} onClick={() => setQuantity(quantity - 1)} disabled={quantity == 1 ? true : false}>-</button>
                                        <div style={{
                                            width: "80px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "18px",
                                            fontWeight: "600"
                                        }}>{quantity}</div>
                                        <button style={{
                                            border: "0",
                                            padding: "0px 20px",
                                            fontSize: "18px",
                                            fontWeight: "600"
                                        }} onClick={() => setQuantity(quantity + 1)} disabled={quantity == book?.count ? true : false}>+</button>
                                    </div>
                                </div>
                                <div className='book-detail-button'>
                                    <button style={{
                                        height: "35px",
                                        width: "180px",
                                        padding: "0px 10px",
                                        background: "rgb(253, 56, 56)",
                                        border: "2px solid rgba(253, 56, 56,0.5)",
                                        color: "#fff",
                                        borderRadius: "5px"
                                    }} onClick={Add2Cart}>Thêm vào giỏ hàng</button>
                                    <button style={{
                                        height: "35px",
                                        width: "180px",
                                        background: "#fff",
                                        padding: "0px 10px",
                                        border: "2px solid rgb(253, 56, 56)",
                                        color: "rgba(253, 56, 56)",
                                        borderRadius: "5px",
                                        marginLeft: "20px"
                                    }} onClick={BuyNow}>Mua ngay</button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card
                        bordered={false}
                        className="book-detail-description"
                    >
                        <div>
                            <h2 style={{ margin: "0px", textTransform: "uppercase" }}>MÔ TẢ NỘI DUNG</h2>
                        </div>
                        <div>
                            {book?.description}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card
                        bordered={false}
                        className="book-detail-description"
                    >
                        <div>
                            <h2 style={{ margin: "0px", textTransform: "uppercase" }}>ĐÁNH GIÁ SẢN PHẨM</h2>
                        </div>
                        <div>
                            <div style={{ display: "flex", flexDirection: "column", width: "120px", alignItems: "center" }}>
                                <div style={{
                                    fontSize: "25px",
                                    fontWeight: "700"
                                }}>
                                    <span style={{
                                        fontSize: "50px"
                                    }}>{rating?.average ? rating?.average?.toFixed(1) : 0}</span>/5
                                </div>
                                <div>
                                    {
                                        [1, 2, 3, 4, 5].map((value) => (
                                            <span style={{
                                                fontSize: "20px",
                                                cursor: "pointer"
                                            }}>
                                                {
                                                    rating?.average >= value ? <StarFilled style={{ color: "#fc3" }} /> : <StarFilled style={{ color: "grey" }} />
                                                }
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div style={{
                            borderTop: "2px solid #b0b0b0",
                            marginTop: "24px"
                        }}>
                            {
                                rating?.ratings?.map((rate, index) => (
                                    <div style={{ display: "flex", marginTop: "10px" }}>
                                        <div style={{ width: "170px", marginRight: "10px", display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: "600" }}>
                                                {rate?.user?.firstName + " " + rate?.user?.lastName}
                                            </span>
                                            <span>
                                                {moment(rate?.create?.slice(0, 10)).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                        <div style={{ width: "calc(100%-180px)" }}>
                                            {
                                                [1, 2, 3, 4, 5].map((value) => (
                                                    <span style={{
                                                        fontSize: "16px",
                                                        cursor: "pointer"
                                                    }}>
                                                        {
                                                            rate?.rate >= value ? <StarFilled style={{ color: "#fc3" }} /> : <StarFilled style={{ color: "grey" }} />
                                                        }
                                                    </span>
                                                ))
                                            }
                                            <div>
                                                {rate?.comment}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Card>
                </Col>
            </Row>


            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                        borderRadius: 0
                    }}
                        className='book-details-card-list-book'
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span className='book-details-icon-list-book'></span>
                                <h3 style={{
                                    margin: 0
                                }}>CÓ THỂ BẠN CŨNG THÍCH</h3>
                            </div>
                        }
                    >
                        <List
                            className='book-details-list-book'
                            grid={{
                                gutter: 12,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 4,
                                xl: 5,
                                xxl: 5,
                            }}
                            dataSource={bookRecomends}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card bordered={false}
                                        style={{
                                            // outline: "none",
                                            borderRadius: 0
                                        }}
                                        className='book-details-book'
                                    >
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}>
                                            <div style={{
                                                cursor: "pointer"
                                            }}
                                                onClick={() => navigate(`/book/${item?.id}`)}>
                                                <Image src={item?.image} preview={false}
                                                    height={240}
                                                    width={190}
                                                    style={{
                                                        objectFit: "cover"
                                                    }}
                                                ></Image>
                                                <div className='book-details-book-detail'>
                                                    <Link
                                                        className='book-details-book-title'
                                                    >
                                                        {item?.title}
                                                    </Link>
                                                    <div className='book-details-book-detail-price'>
                                                        {Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(item?.price)}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Button style={{
                                color: "#C92127",
                                border: "2px solid #C92127",
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "40px",
                                width: "150px",
                                marginTop: "14px"
                            }}
                                onClick={() => navigate("/book")}
                            >Xem thêm</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                    }}
                        className='book-detail-recomment'
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span className='book-detail-recomment-icon'></span>
                                <h3 style={{
                                    margin: 0
                                }}>SÁCH NỔI BẬT</h3>
                            </div>
                        }
                    >
                        <List
                            className='book-detail-recomment-list'
                            grid={{
                                gutter: 12,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 4,
                                xl: 5,
                                xxl: 5,
                            }}
                            dataSource={books}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/book/${item?.id}`}>
                                        <Card bordered={false}
                                            style={{
                                                borderRadius: 0
                                            }}
                                            className='book-detail-recomment-book'
                                        // onClick={()=>navigate(`book/${item?.id}`)}
                                        >
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                            }}>
                                                <div>
                                                    <Image src={item?.image} preview={false}
                                                        height={240}
                                                        width={190}
                                                    ></Image>
                                                    <div className='book-detail-recomment-book-info'>
                                                        <Link to=""
                                                            className='book-detail-recomment-book-title'
                                                        >{item?.title}</Link>
                                                        <div className='book-detail-recomment-book-price'>
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
                            <Button style={{
                                color: "#C92127",
                                border: "2px solid #C92127",
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "40px",
                                width: "150px"
                            }}
                                onClick={() => navigate("/book")}
                            >Xem thêm</Button>
                        </div>
                    </Card>
                </Col>
            </Row> */}
        </div>
    )
}

export default BookDetail