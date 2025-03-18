import { useState } from 'react';
import { SearchOutlined, HomeOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Badge, Popover, Empty, message, Input, Dropdown, Space, Avatar } from 'antd';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';
import { isMobile } from 'react-device-detect';
import './app.new.header.scss';

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

    const {
        isAuthenticated, user, setUser, setIsAuthenticated,
        carts, setCarts
    } = useCurrentApp();

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("carts");
            message.success("Đăng xuất thành công!")
        }
    };

    let items = [
        {
            label: <label onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => (
        <div className='pop-cart-body'>
            <div className='pop-cart-content'>
                {carts?.map((book, index) => (
                    <div className='book' key={`book-${index}`}>
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                        <div className='name-container'>{book?.detail?.mainText}</div>
                        <div className='price'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                        </div>
                    </div>
                ))}
            </div>
            {carts.length > 0 ?
                <div className='pop-cart-footer'>
                    <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                </div>
                :
                <Empty description="Không có sản phẩm trong giỏ hàng" />
            }
        </div>
    );

    return (
        <>
            {/* Promo banner */}
            <div className="promo-banner">
                <span>Freeship đơn từ 45k, giảm nhiều hơn cùng <strong>FREESHIP XTRA</strong></span>
            </div>

            {/* Main header */}
            <div className="header-container">
                {/* Logo, search and user controls */}
                <div className="main-header">
                    <div className="logo-container" onClick={() => navigate('/')}>
                        <img style={{ width: '96px', height: '40px' }} src="/images/logotiki.png" alt="Tiki Logo" />
                        <span className="slogan">Tốt & Nhanh</span>
                    </div>

                    <div className="search-container">
                        <Input
                            className="search-input"
                            prefix={<SearchOutlined />}
                            placeholder="Freeship đơn từ 45k"
                            value={props.searchTerm}
                            onChange={(e) => props.setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">Tìm kiếm</button>
                    </div>

                    <div className="user-controls">
                        <div className="control-item" onClick={() => navigate('/')}>
                            <HomeOutlined className="control-icon" />
                            <div>Trang chủ</div>
                        </div>

                        {!isAuthenticated ? (
                            <div className="control-item" onClick={() => navigate('/login')}>
                                <UserOutlined className="control-icon" />
                                <div>Tài khoản</div>
                            </div>
                        ) : (
                            <Dropdown menu={{ items }} trigger={['click']} className="control-item">
                                <div >
                                    <Avatar src={urlAvatar} size="small" />
                                    <div>Tài khoản</div>
                                </div>
                            </Dropdown>
                        )}

                        <div className="control-item cart-item">
                            {!isMobile ? (
                                <Popover
                                    className="popover-carts"
                                    placement="bottomRight"
                                    title="Sản phẩm mới thêm"
                                    content={contentPopover}
                                    trigger="click"
                                >
                                    <Badge count={carts?.length ?? 0} size="small" showZero offset={[-15, -2]} className="badge-wrapper" >
                                        <FiShoppingCart className="control-icon" />
                                        <div>Giỏ hàng</div>
                                    </Badge>

                                </Popover>
                            ) : (
                                <Badge count={carts?.length ?? 0} size="small" showZero onClick={() => navigate("/order")}>
                                    <FiShoppingCart className="control-icon" />
                                    <div>Giỏ hàng</div>
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="categories-container">
                    <div className="categories">
                        <Link to="#" className="category-link">điện gia dụng</Link>
                        <Link to="#" className="category-link">xe cộ</Link>
                        <Link to="#" className="category-link">mẹ & bé</Link>
                        <Link to="#" className="category-link">khỏe đẹp</Link>
                        <Link to="#" className="category-link">nhà cửa</Link>
                        <Link to="#" className="category-link">sách</Link>
                        <Link to="#" className="category-link">thể thao</Link>
                        <Link to="#" className="category-link">harry potter</Link>
                        <Link to="#" className="category-link">suối nguồn</Link>
                        <Link to="#" className="category-link">trái đất chuyện mình</Link>
                    </div>
                    <div className="location">


                        <EnvironmentOutlined style={{ marginRight: 5 }} />
                        Giao đến:&nbsp;&nbsp;
                        <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                            Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội
                        </span>

                    </div>
                </div>

                {/* Service commitments */}
                <div className="service-commitments">
                    <div className="commitment-item">Cam kết</div>
                    <div className="commitment-item"><img src="/images/hangthat.png" alt="" /> 100% hàng thật</div>
                    <div className="commitment-item"><img src="/images/freemoidon.png" alt="" /> Freeship mọi đơn</div>
                    <div className="commitment-item"><img src="/images/hoanhang.png" alt="" /> Hoàn 200% nếu hàng giả</div>
                    <div className="commitment-item"><img src="/images/doitra30ngay.png" alt="" /> 30 ngày đổi trả</div>
                    <div className="commitment-item"><img src="/images/giaonhanh24h.png" alt="" /> Giao nhanh 2h</div>
                    <div className="commitment-item"><img src="/images/giasieure.png" alt="" /> Giá siêu rẻ</div>
                </div>
            </div>

            <ManageAccount isModalOpen={openManageAccount} setIsModalOpen={setOpenManageAccount} />
        </>
    );
};

export default AppHeader;