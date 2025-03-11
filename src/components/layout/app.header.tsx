import { useState, useMemo } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, Empty } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';
import { isMobile } from 'react-device-detect';

interface Product {
    id: number;
    name: string;
    image: string;
}

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    products: Product[]; // ✅ Thêm danh sách sản phẩm vào props
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
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

    // ✅ useMemo để tối ưu tìm kiếm sản phẩm
    const filteredProducts = useMemo(() => {
        console.log("🔍 props.products:", props.products); // Kiểm tra dữ liệu sản phẩm
        console.log("🔍 searchTerm:", props.searchTerm);
        return (props.products || []).filter(product =>
            product.name.toLowerCase().includes(props.searchTerm.toLowerCase())
        );
    }, [props.searchTerm, props.products]);


    const contentPopover = () => (
        <div className='pop-cart-body'>
            <div className='pop-cart-content'>
                {carts?.map((book, index) => (
                    <div className='book' key={`book-${index}`}>
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                        <div>{book?.detail?.mainText}</div>
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
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => setOpenDrawer(true)}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo' onClick={() => navigate('/')}>
                                <FaReact className='rotate icon-react' />Hải Đào IT
                            </span>
                            <VscSearchFuzzy className='icon-search' />
                        </div>

                        {/* ✅ Ô tìm kiếm */}
                        <div className="search-container">
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                            {props.searchTerm && (
                                <div className="search-results">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <div key={product.id} className="search-item">
                                                <img src={product.image} alt={product.name} />
                                                <span>{product.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <Empty description="Không tìm thấy sản phẩm" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                {!isMobile ?
                                    <Popover
                                        className="popover-carts"
                                        placement="topRight"
                                        rootClassName="popover-carts"
                                        title={"Sản phẩm mới thêm"}
                                        content={contentPopover}
                                        arrow={true}
                                    >
                                        <Badge count={carts?.length ?? 0} size={"small"} showZero>
                                            <FiShoppingCart className='icon-cart' />
                                        </Badge>
                                    </Popover>
                                    :
                                    <Badge count={carts?.length ?? 0} size={"small"} showZero onClick={() => navigate("/order")}>
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                }
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space>
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />
                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>

            <ManageAccount isModalOpen={openManageAccount} setIsModalOpen={setOpenManageAccount} />
        </>
    );
};

export default AppHeader;
