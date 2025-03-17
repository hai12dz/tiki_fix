import React, { useState } from 'react';
import { Row } from 'antd';
import 'styles/CustomTabs.scss'; // You'll need to create this CSS file


interface IProps {
    onTabChange: (key: string) => void;
}
const CustomImageTabs = (props: IProps) => {
    const { onTabChange } = props
    const [activeTab, setActiveTab] = useState('price');

    const tabs = [
        {
            key: 'price',
            icon: '/images/danhchoban.png', // Replace with your icon path
            title: 'Dành cho bạn'
        },
        {
            key: '-updatedAt',
            icon: '/images/xakho.png', // Replace with your icon path
            title: 'Sách Xả Kho - 60%'
        },
        {
            key: '-price',
            icon: '/images/banchay.png', // Replace with your icon path
            title: 'Top Deal Bán Chạy'
        },
        {
            key: '-sold',
            icon: '/images/trending.png', // Replace with your icon path
            title: 'Trending'
        }
    ];

    const handleTabClick = (tabKey: string) => {
        if (tabKey !== activeTab) { // Chỉ cập nhật nếu khác tab hiện tại
            setActiveTab(tabKey);
            onTabChange(tabKey);
        }
    };


    return (
        <Row className="custom-tabs-container">
            {tabs.map((tab) => (
                <div
                    key={tab.key}
                    className={`custom-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.key)}
                >
                    <div className="tab-icon">
                        <img src={tab.icon} alt={tab.title} />
                    </div>
                    <div className="tab-title">{tab.title}</div>
                </div>
            ))}
        </Row>
    );
};

export default CustomImageTabs;