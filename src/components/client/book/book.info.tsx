import { Row, Col, Rate, Divider, Typography, Space, Tag } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface IProps {
    currentBook: IBookTable | null;
}

const BookInfo = (props: IProps) => {
    const { currentBook } = props;
    const { Text, Title, Paragraph } = Typography;

    return (
        <div className="book-info-container">
            <div className='author'>
                Tác giả: <a href='#'>{currentBook?.author}</a>
            </div>
            <div className='title'>
                <Title level={4}>{currentBook?.mainText}</Title>
            </div>
            <div className='rating'>
                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                <span className='sold'>
                    <Divider type="vertical" />
                    Đã bán {currentBook?.sold ?? 0}
                </span>
            </div>

            <div className="book-details">
                <Row className="detail-item">
                    <Col span={8} className="detail-label">Nhà xuất bản:</Col>
                    <Col span={16} className="detail-content">{currentBook?.category}</Col>
                </Row>
                <Row className="detail-item">
                    <Col span={8} className="detail-label">Năm xuất bản:</Col>
                    <Col span={16} className="detail-content">{currentBook?.updatedAt ? new Date(currentBook.updatedAt).getFullYear() : 'N/A'}</Col>
                </Row>
                <Row className="detail-item">
                    <Col span={8} className="detail-label">Số trang:</Col>
                    <Col span={16} className="detail-content">{Math.floor(Math.random() * 300) + 100}</Col>
                </Row>
                <Row className="detail-item">
                    <Col span={8} className="detail-label">Kích thước:</Col>
                    <Col span={16} className="detail-content">14 x 20.5 cm</Col>
                </Row>
                <Row className="detail-item">
                    <Col span={8} className="detail-label">Loại bìa:</Col>
                    <Col span={16} className="detail-content">Bìa mềm</Col>
                </Row>
                <Row className="detail-item">
                    <Col span={8} className="detail-label">SKU:</Col>
                    <Col span={16} className="detail-content">{currentBook?.id}</Col>
                </Row>
            </div>

            <div className="book-warranty" style={{ marginTop: '20px' }}>
                <div className="warranty-title" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chính sách đổi trả</div>
                <div className="warranty-item">
                    <CheckCircleFilled style={{ color: '#2dc258', marginRight: '8px' }} />
                    <span>Đổi trả trong 30 ngày nếu sản phẩm lỗi</span>
                </div>
                <div className="warranty-item">
                    <CheckCircleFilled style={{ color: '#2dc258', marginRight: '8px' }} />
                    <span>Sản phẩm mới 100%</span>
                </div>
                <div className="warranty-item">
                    <CheckCircleFilled style={{ color: '#2dc258', marginRight: '8px' }} />
                    <span>Bảo hành chính hãng</span>
                </div>
            </div>

            <div className="book-description" style={{ marginTop: '20px' }}>
                <div className="description-title" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Mô tả sản phẩm</div>
                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
                    {`"${currentBook?.mainText}" là cuốn sách của tác giả ${currentBook?.author} được xuất bản bởi ${currentBook?.category}. Cuốn sách mang đến cho người đọc những trải nghiệm tuyệt vời với nội dung phong phú và ý nghĩa sâu sắc. Đây là một tác phẩm không thể bỏ qua cho những ai yêu thích văn học.`}
                </Paragraph>
            </div>

            <div className="book-tags" style={{ marginTop: '20px' }}>
                <Space size={[0, 8]} wrap>
                    <Tag color="default">Sách hay</Tag>
                    <Tag color="default">{currentBook?.category}</Tag>
                    <Tag color="default">{currentBook?.author}</Tag>
                    <Tag color="default">Bestseller</Tag>
                </Space>
            </div>
        </div>
    );
}

export default BookInfo;