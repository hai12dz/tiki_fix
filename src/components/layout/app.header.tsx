import { useState, useMemo, useEffect } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, Empty } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { getBooksAPI, logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';
import { isMobile } from 'react-device-detect';
import { HomeOutlined, SmileOutlined } from '@ant-design/icons';



interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const [listBook, setListBook] = useState<IBookTable[]>([]);

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

    const fetchBook = async () => {

        const res = await getBooksAPI('');
        if (res && res.data) {
            setListBook(res.data.items)
        }

    }
    useEffect(() => {

        fetchBook()
    })

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => setOpenDrawer(true)}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo' onClick={() => navigate('/')}>
                                <FaReact className='rotate icon-react' />TIKI LEARN
                            </span>
                            <VscSearchFuzzy className='icon-search' />
                        </div>

                        {/* ✅ Ô tìm kiếm */}
                        <div className="search-container">
                            <img src="/images/iconsearch.png" alt="" />
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />

                        </div>

                        <div>


                            {listBook.slice(0, 5).map((item, index) => (

                                <p>{item.author}</p>

                            ))}


                        </div>

                        <div>
                            <img src="/images/giaoden.png" alt="" />Giao đến: Q.Hoàn Kiếm, P.Hàng Trống, Hà Nội
                        </div>

                        <div>
                            <p>Cam kết</p>
                            <p><img src="/images/hangthat.png" alt="Hàng thật" />100% hàng thật</p>
                            <p><img src="/images/freemoidon.png" alt="Free ship" />Freeship mọi đơn</p>
                            <p><img src="/images/hoanhang.png" alt="Hoàn hàng" />Hoàn 200% nếu hàng giả</p>
                            <p><img src="/images/doitra30ngay.png" alt="Hàng thật" />30 ngày đổi trả</p>
                            <p><img src="/images/giaonhanh24h.png" alt="Hàng thật" />Giao nhanh 2h</p>
                            <p><img src="/images/giasieure.png" alt="Hàng thật" />Giao nhanh 2h</p>


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
                                    (<div >

                                        <span
                                            style={{ marginRight: '10px' }}
                                            onClick={() => navigate('/')}><HomeOutlined /> Trang chủ</span>
                                        <span onClick={() => navigate('/login')}><SmileOutlined /> Tài Khoản</span>


                                    </div>

                                    )
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
