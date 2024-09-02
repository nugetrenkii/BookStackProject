import './Rating.css'
import { Card, Col, Image, Row, message } from 'antd'
import React, { useEffect, useState } from 'react'
import Menu from '../../components/Menu/Menu'
import Waiting from '../Waiting/Waiting'
import { useNavigate, useParams } from 'react-router-dom'
import { GetOrderById } from '../../axios/OrderAPI'
import TextArea from 'antd/es/input/TextArea'
import { StarFilled } from '@ant-design/icons'
import { GetBookById } from '../../axios/BookAPI'
import { CreateRating } from '../../axios/RateAPI'

function Rating() {
    const navigate = useNavigate()
    const [wait, setWait] = useState(false)
    const [book, setBook] = useState([])
    const [rate, setRate] = useState(5)
    const [comment, setComment] = useState("")
    const param = useParams()
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi',
        });
    };

    useEffect(() => {
        fecthData()
    }, [])
    const fecthData = async () => {
        setWait(true)
        var res = await GetBookById(param?.id)
        setBook(res?.data)
        setWait(false)
    }

    const handleRating = async () => {
        setWait(true)
        var rating = {
            rate: rate,
            comment: comment,
            userId: sessionStorage.getItem("userId"),
            bookId: param?.id
        }

        var res = await CreateRating(rating)
        if (res?.code == 200) {
            success()
            setTimeout(() => {
                window.history.back()
            }, 2000);
        }
        setWait(false)
    }
    return (
        <div className='book-detail-main'
            style={{
                marginTop: 20
            }}>
            {
                wait ? <Waiting /> : <></>
            }
            {contextHolder}
            <Row gutter={[24, 0]} className="mb-24">
                <Col span={24} md={24}>
                    <Card style={{
                        borderRadius: "0px"
                    }}
                        title={(
                            <div>
                                ĐÁNH GIÁ SẢN PHẨM
                            </div>
                        )}
                    >
                        <div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <Image preview={false} src={book?.image} style={{
                                    height: "250px"
                                }} />
                                <div style={{
                                    fontSize: "25px"
                                }}>
                                    {book?.title}
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <div style={{
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                }}>
                                    {
                                        [1, 2, 3, 4, 5].map((value) => (
                                            <span style={{
                                                fontSize: "35px",
                                                cursor: "pointer"
                                            }}
                                                onClick={() => setRate(value)}>
                                                {
                                                    rate >= value ? <StarFilled style={{ color: "#fc3" }} /> : <StarFilled style={{ color: "grey" }} />
                                                }
                                            </span>
                                        ))
                                    }
                                </div>
                                <div style={{
                                    width: "100%"
                                }}>
                                    <TextArea style={{
                                        borderRadius: "0px",
                                        fontSize: "20px"
                                    }}
                                        maxLength={255}
                                        rows={3}
                                        onChange={(e) => setComment(e.target.value)} />
                                </div>
                                <div>
                                    <button style={{
                                        marginTop: "20px",
                                        height: "35px",
                                        width: "180px",
                                        padding: "0px 10px",
                                        background: "rgb(253, 56, 56)",
                                        border: "2px solid rgba(253, 56, 56,0.5)",
                                        color: "#fff",
                                        borderRadius: "5px"
                                    }} onClick={handleRating} >Đánh giá</button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div >
    )
}

export default Rating