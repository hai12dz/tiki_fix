import React from 'react';
import { Rate, Progress, Button } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import 'styles/CustomerReview.scss';


const CustomerReview = () => {
    const reviewData = {
        averageRating: 4.7,
        totalReviews: 47,
        ratingDistribution: [
            { stars: 5, count: 38 },
            { stars: 4, count: 6 },
            { stars: 3, count: 1 },
            { stars: 2, count: 0 },
            { stars: 1, count: 2 }
        ],
        productHighlights: {
            title: 'Về sản phẩm:',
            subtitle: '(6 tích cực, 2 tiêu cực)',
            positives: [
                'Sách đẹp, nội dung ý nghĩa, dễ tiếp cận với mọi người.',
                'Gói hàng cẩn thận, giá cả hợp lý.',
                'Được bạn bè recommend, thu được nhiều giá trị khi đọc.'
            ],
            negatives: [
                'Sách bé, giấy vàng loại kém chất lượng.'
            ]
        },
        serviceHighlights: {
            title: 'Về dịch vụ:',
            subtitle: '(4 tích cực, 1 tiêu cực)',
            positives: [
                'Giao hàng nhanh, đóng gói cẩn thận.',
                'Dịch bệnh nhưng giao hàng khá nhanh.',
                'Dịch vụ hỗ trợ sau bán hàng tốt.'
            ],
            negatives: [
                'Có nhận xét về đóng gói sơ sài và giao hàng chậm.'
            ]
        }
    };

    return (
        <div className="customer-review">
            <h2 className="customer-review__title">Khách hàng đánh giá</h2>

            <div className="customer-review__content">
                <div className="customer-review__summary">
                    <h3 className="customer-review__subtitle">Tổng quan</h3>

                    <div className="customer-review__rating">
                        <div className="customer-review__rating-score">
                            <span className="customer-review__rating-number">{reviewData.averageRating}</span>
                            <div className="customer-review__rating-stars">
                                <Rate disabled defaultValue={reviewData.averageRating} allowHalf />
                                <span className="customer-review__rating-count">({reviewData.totalReviews} đánh giá)</span>
                            </div>
                        </div>

                        <div className="customer-review__distribution">
                            {reviewData.ratingDistribution.map((item) => (
                                <div key={item.stars} className="customer-review__distribution-item">
                                    <div className="customer-review__distribution-stars">
                                        <Rate style={{ fontSize: 9 }} disabled defaultValue={item.stars} count={item.stars} />
                                    </div>
                                    <Progress
                                        percent={item.count / reviewData.totalReviews * 100}
                                        showInfo={false}
                                        strokeColor="#fadb14"
                                        trailColor="#f0f0f0"
                                        className="customer-review__distribution-bar"
                                    />
                                    <span className="customer-review__distribution-count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="customer-review__details">
                    <div className="customer-review__ai-summary">
                        <span className="customer-review__ai-icon">🤖</span>
                        <span className="customer-review__ai-text">Trợ lý AI tổng hợp từ các đánh giá mới nhất</span>
                    </div>

                    <div className="customer-review__highlights">
                        <div className="customer-review__highlights-section">
                            <div className="customer-review__highlights-header">
                                <span className="customer-review__highlights-title">{reviewData.productHighlights.title}</span>
                                <span className="customer-review__highlights-subtitle">{reviewData.productHighlights.subtitle}</span>
                            </div>
                            <ul className="customer-review__highlights-list">
                                {reviewData.productHighlights.positives.map((item, index) => (
                                    <li key={`product-positive-${index}`} className="customer-review__highlights-item customer-review__highlights-item--positive">
                                        <span className="customer-review__highlights-icon">+</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                                {reviewData.productHighlights.negatives.map((item, index) => (
                                    <li key={`product-negative-${index}`} className="customer-review__highlights-item customer-review__highlights-item--negative">
                                        <span className="customer-review__highlights-icon">−</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="customer-review__highlights-section">
                            <div className="customer-review__highlights-header">
                                <span className="customer-review__highlights-title">{reviewData.serviceHighlights.title}</span>
                                <span className="customer-review__highlights-subtitle">{reviewData.serviceHighlights.subtitle}</span>
                            </div>
                            <ul className="customer-review__highlights-list">
                                {reviewData.serviceHighlights.positives.map((item, index) => (
                                    <li key={`service-positive-${index}`} className="customer-review__highlights-item customer-review__highlights-item--positive">
                                        <span className="customer-review__highlights-icon">+</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                                {reviewData.serviceHighlights.negatives.map((item, index) => (
                                    <li key={`service-negative-${index}`} className="customer-review__highlights-item customer-review__highlights-item--negative">
                                        <span className="customer-review__highlights-icon">−</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="customer-review__feedback">
                        <Button icon={<LikeOutlined />} className="customer-review__feedback-button" />
                        <Button icon={<DislikeOutlined />} className="customer-review__feedback-button" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReview;