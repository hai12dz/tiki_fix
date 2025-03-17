import { useState } from 'react';
import { Row, Col, Space, Typography, Rate, Tag, Divider, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getBooksAPI } from '@/services/api';
import BookInDetail from './book.support';
import LocationSelectorModal from './location.selector.modal';

const { Text, Title, Paragraph } = Typography;
interface IProps {
    currentBook: IBookTable | null;
}

const BookInfo = (props: IProps) => {
    const { currentBook } = props;
    const [popoverVisible, setPopoverVisible] = useState(false);

    // Calculate the discounted price
    const originalPrice = Number(currentBook?.price) || 0;
    const discountPercentage = Number(currentBook?.promotion) || 0;
    const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deliveryLocation, setDeliveryLocation] = useState<string>('Hàng Trống, Q. Hoàn Kiếm, Hà Nội');
    const handleLocationSubmit = (location: any) => {
        setDeliveryLocation(location);
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };



    // Content for the price info popover
    const priceInfoContent = (
        <div className="price-info-popup" style={{ width: '320px' }}>
            <Row gutter={[0, 8]}>
                <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify="space-between">
                            <Col>Giá gốc</Col>
                            <Col>{originalPrice.toLocaleString()}đ</Col>
                        </Row>
                        <Row justify="space-between">
                            <Col>Giá bán</Col>
                            <Col>{discountedPrice.toLocaleString()}đ</Col>
                        </Row>
                        <Row>
                            <Col className="discount-info">Giá đã giảm trực tiếp từ nhà bán</Col>
                        </Row>

                    </Space>
                </Col>
            </Row>
        </div>
    );


    return (
        <div className="book-container p-4">
            <Row gutter={[0, 12]}>
                <Col span={24}>
                    <Space className="space-container">
                        <img
                            style={{ width: '114px', height: '20px' }}
                            src="/images/ctdoitra30ngay.png"
                            alt=""
                        />
                        <img
                            style={{ width: '114px', height: '20px' }}
                            src="/images/ctchinhhang.png"
                            alt=""
                        />
                        <Text type="secondary"><h5>Tác giả: <a href="#">{currentBook?.author}</a></h5></Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Title level={4} className="mb-1">{currentBook?.mainText}</Title>
                </Col>

                <Col span={24}>
                    <Space align="center">
                        <Rate disabled defaultValue={4.5} className="text-yellow-400 text-sm" />
                        <Text>(1523)</Text>
                        <Divider type="vertical" />
                        <Text>Đã bán {currentBook?.sold}+</Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Space align="center">
                        <Text strong className="text-red-500 text-2xl">
                            <Text strong className="text-red-500 text-2xl">

                                {Number(currentBook?.price) - (Number(currentBook?.price) * Number(currentBook?.promotion) / 100)}đ


                            </Text>


                        </Text>

                        <Text delete className="text-gray-500">{currentBook?.price}đ</Text>
                        <Tag color="#ffe4e4" className="rounded-md border-0">
                            <Text className="text-red-500">-{currentBook?.promotion}%</Text>
                        </Tag>
                        <Popover
                            content={priceInfoContent}
                            title="Chi tiết giá"
                            trigger="click"
                            placement="bottomRight"
                        >
                            <InfoCircleOutlined
                                className="text-gray-400 cursor-pointer"
                                onClick={() => setPopoverVisible(!popoverVisible)}
                            />
                        </Popover>
                    </Space>
                </Col>

                <Col span={24}>
                    <Text className="text-gray-500">Giá sau áp dụng mã khuyến mãi</Text>
                </Col>

                <Col span={24}>
                    <Space>
                        <Tag color="#f0f7ff" className="rounded-md border-0">
                            <Text className="text-blue-500">Giảm 10.000đ từ mã khuyến mãi của nhà bán</Text>
                        </Tag>
                    </Space>
                </Col>

                <Col span={24}>
                    <Divider className="my-2" />
                </Col>

                <Col span={24}>
                    <Title level={5} className="mb-1">Thông tin vận chuyển</Title>
                </Col>

                <Col span={24}>
                    <Row>
                        <Col span={18}>
                            <div>
                                <Row>
                                    <Col span={18}>
                                        <Text>Giao đến {deliveryLocation}</Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <Text style={{ color: '#1890ff' }}>
                                            <a href="#" onClick={handleOpenModal}>Đổi</a>
                                        </Text>
                                    </Col>
                                </Row>

                                <LocationSelectorModal
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    onSubmitLocation={handleLocationSubmit}
                                />
                            </div>
                        </Col>

                    </Row>
                </Col>

                <Col span={24} className="my-2">
                    <Space align="center">
                        <img style={{ width: '32px', height: '16px' }} src="/images/now.png" alt="" />
                        <Text strong> Giao siêu tốc 2h</Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Space>
                        <Text>Trước 17h hôm nay:</Text>
                        <Text className="text-green-500">Miễn phí</Text>
                        <Text delete>
                            <span className="text-muted">15.000</span>
                            <sup><small>đ</small></sup>
                        </Text>

                    </Space>
                </Col>

                <Col span={24} className="my-2">
                    <Space align="center">
                        <Text type="secondary" strong> <img style={{ width: '32px', height: '16px' }} src="/images/giaodungsangmai.png" alt="" /> Giao đúng sáng mai</Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Space>
                        <Text>8h - 12h, Ngày mai:</Text>
                        <Text className="text-green-500">Miễn phí</Text>
                        <Text delete>
                            <span className="text-muted">10.000</span>
                            <sup><small>đ</small></sup>
                        </Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Space>
                        <Text strong> <img style={{ width: '32px', height: '16px' }} src="/images/freeship.png" alt="" /> Freeship 10k đơn từ 45k, Freeship 25k đơn từ 100k</Text>

                    </Space>
                </Col>

                <Col span={24}>
                    <Divider className="my-2" />
                </Col>
            </Row>

            <Row>

                <BookInDetail
                    currentBook={currentBook}
                />
            </Row>
        </div>
    );
};

export default BookInfo;