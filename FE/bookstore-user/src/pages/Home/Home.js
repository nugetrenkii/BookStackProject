import { Button, Card, Carousel, Col, Image, List, Radio, Row, Space, Statistic, Table, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { ToTopOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css"
import { GetBookById, GetBookByIds, GetBooks, GetBooksRecomend, GetTopOrderedBooks, GetTopRatedBooks } from '../../axios/BookAPI';
import { GetTags } from '../../axios/TagAPI';
import banner1 from '../../assets/images/Banner1.png';
import banner2 from '../../assets/images/Banner2.png';
import banner3 from '../../assets/images/Banner3.png';
import card1 from '../../assets/images/Card1.png';
import card2 from '../../assets/images/Card2.png';
import card3 from '../../assets/images/Card3.png';
import card4 from '../../assets/images/Card4.png';

const contentStyle = {
    margin: 0,
    height: '400px',
    color: '#000',
    lineHeight: '400px',
    textAlign: 'center',
    background: '#000',
    borderRadius: "5px",
    width: "100%",
    objectFit: "contain"
};
const data = [
    {
        title: 'Văn học',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/tpkds1.jpg',
    },
    {
        title: 'Tiểu thuyết',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Ti_u_Thuy_t.jpg',
    },
    {
        title: 'Thiếu nhi',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/thieunhis2.jpg',
    },
    {
        title: 'Kinh tế',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/9786043654370.jpg',
    },
    {
        title: 'Tâm lý',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Thao_t_ng.jpg',
    },
    {
        title: 'Tâm linh',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/T_m_linh.jpg',
    },
    {
        title: 'Truyện',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/_am_m_.jpg'
    },
    {
        title: 'Ngoại ngữ',
        image: 'https://cdn0.fahasa.com/media/catalog/product/9/7/9781108430425.jpg'
    },
];
function Home() {
    const navigate = useNavigate();
    const [books, setBook] = useState([])
    const [bookRecomends, setBookRecomend] = useState([])
    const [bookSale, setBookSale] = useState([])
    const [tags, setTag] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var res = await GetBooks(1, 5, "", "CREATE")
        if (res?.code == 200) setBook(res?.data)

        var res = await GetTopRatedBooks(5)
        if (res?.code == 200) {
            setBookRecomend(res?.data);
        }

        var res = await GetTopOrderedBooks(5)
        if (res?.code == 200) {
            setBookSale(res?.data);
        }

        var res = await GetTags(1, 10000, "", "ID")
        if (res?.code == 200) setTag(res?.data)
    }
    return (
        <div className='home-main tabled'
            style={{
                marginTop: 20
            }}>
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card
                        bordered={false}
                        className="header-solid h-full ant-invoice-card"
                        bodyStyle={{
                            padding: '0px',
                            borderRadius: "0px"
                        }}
                        cover={
                            <Carousel autoplay>
                                <div>
                                    <img src={banner1} style={contentStyle}></img>
                                </div>
                                <div>
                                    <img src={banner2} style={contentStyle}></img>
                                </div>
                                <div>
                                    <img src={banner3} style={contentStyle}></img>
                                </div>
                            </Carousel>
                        }
                    >
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]} className="mb-24">
                <Col xs={24} md={24}>
                    <Card
                        title={
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <span className='home-icon-tag' style={{
                                    marginRight: "10px"
                                }}></span>
                                <h3 style={{
                                    margin: 0
                                }}>
                                    DANH MỤC SẢN PHẨM
                                </h3>
                            </div>
                        }
                        bordered={false}
                        className="home-card-list-tag"
                        style={{
                            borderRadius: 0
                        }}
                    >
                        <List
                            className='home-list-tag'
                            grid={{
                                gutter: 12,
                                xs: 2,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 8,
                                xxl: 8,
                            }}
                            dataSource={tags}
                            renderItem={(tag, index) => (
                                <List.Item>
                                    <Card bordered={false} style={{
                                        outline: "none",
                                        boxShadow: "none",
                                    }}>
                                        <Link state={{ key: tag.id}} to={{ pathname: '/book' }} style={{ color: "#000" }}>
                                            <div
                                                className='home-tag-item'
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}>
                                                    <Image
                                                        src={data[index] ? data[index].image : data[0].image}
                                                        preview={false}
                                                        height={80}
                                                        width={80}
                                                    ></Image>
                                                <span href=""
                                                    className='home-tag-title'
                                                >{tag.name}</span>
                                            </div>
                                        </Link>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={6}>
                    <Card
                        style={{ borderRadius: "0px" }}
                        bordered={false}
                        className="header-solid h-full ant-invoice-card"
                        bodyStyle={{
                            padding: '0px'
                        }}
                    >
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            preview={false}
                            // height={210}
                            width={"100%"}
                            src={card1}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card
                        style={{ borderRadius: "0px" }}
                        bordered={false}
                        className="header-solid h-full ant-invoice-card"
                        bodyStyle={{
                            padding: '0px'
                        }}
                    >
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            preview={false}
                            // height={210}
                            width={"100%"}
                            src={card2}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card
                        style={{ borderRadius: "0px" }}
                        bordered={false}
                        className="header-solid h-full ant-invoice-card"
                        bodyStyle={{
                            padding: '0px'
                        }}
                    >
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            preview={false}
                            // height={210}
                            width={"100%"}
                            src={card3}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card
                        style={{ borderRadius: "0px" }}
                        bordered={false}
                        className="header-solid h-full ant-invoice-card"
                        bodyStyle={{
                            padding: '0px'
                        }}
                    >
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            preview={false}
                            // height={210}
                            width={"100%"}
                            src={card4}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                        borderRadius: 0
                    }}
                        className='home-card-list-book'
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span className='home-icon-list-book new'></span>
                                <h3 style={{
                                    margin: 0
                                }}>SÁCH MỚI</h3>
                            </div>
                        }
                    >
                        <List
                            className='home-list-book'
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
                                    <Card bordered={false}
                                        style={{
                                            // outline: "none",
                                            borderRadius: 0
                                        }}
                                        className='home-book'
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
                                                <div className='home-book-detail'>
                                                    <Link
                                                        className='home-book-title'
                                                    >
                                                        {item?.title}
                                                    </Link>
                                                    <div className='home-book-detail-price'>
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
                                width: "150px"
                            }}
                                onClick={() => navigate("/book")}
                            >Xem thêm</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                        borderRadius: 0
                    }}
                        className='home-card-list-book'
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span className='home-icon-list-book most'></span>
                                <h3 style={{
                                    margin: 0
                                }}>SÁCH NỔI BẬT</h3>
                            </div>
                        }
                    >
                        <List
                            className='home-list-book'
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
                                        className='home-book'
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
                                                <div className='home-book-detail'>
                                                    <Link
                                                        className='home-book-title'
                                                    >
                                                        {item?.title}
                                                    </Link>
                                                    <div className='home-book-detail-price'>
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
                                width: "150px"
                            }}
                                onClick={() => navigate("/book")}
                            >Xem thêm</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                        borderRadius: 0
                    }}
                        className='home-card-list-book'
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span className='recomend'></span>
                                <h3 style={{
                                    margin: 0
                                }}>SÁCH BÁN CHẠY</h3>
                            </div>
                        }
                    >
                        <List
                            className='home-list-book'
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
                                        className='home-book'
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
                                                <div className='home-book-detail'>
                                                    <Link
                                                        className='home-book-title'
                                                    >
                                                        {item?.title}
                                                    </Link>
                                                    <div className='home-book-detail-price'>
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
                                width: "150px"
                            }}
                                onClick={() => navigate("/book")}
                            >Xem thêm</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Home