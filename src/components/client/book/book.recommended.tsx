import { getBooksAPI } from "@/services/api";
import { FacebookFilled, FilterTwoTone, ReloadOutlined, YoutubeFilled } from "@ant-design/icons"
import { Button, Col, Divider, Pagination, Rate, Row, Tabs } from "antd"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/book.recommended.scss'
import CustomImageTabs from "./custom.image.tab";


const RecommendBook = () => {

    const items = [
        {
            key: 'sort=-updatedAt',
            label: `Dành cho bạn`,
            children: <></>,
        },
        {
            key: "sort=-sold",
            label: `Top Deal Bán Chạy`,
            children: <></>,
        },

    ];

    const addViewedProduct = (productId: string) => {
        const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]").map(Number);

        // Nếu sản phẩm chưa có trong danh sách thì thêm vào
        if (!viewedProducts.includes(productId)) {
            viewedProducts.push(productId);
        }

        // Giữ tối đa 10 sản phẩm gần nhất
        if (viewedProducts.length > 10) {
            viewedProducts.shift(); // Xóa sản phẩm cũ nhất
        }

        localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
    };
    const [sortQuery, setSortQuery] = useState<string>("-sold");
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate();
    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

    }
    const fetchBook = async () => {

        let query = `current=${current}&pageSize=${pageSize}`;

        if (sortQuery) {
            query += `&sort=${sortQuery}`;
        }


        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.items);
            setTotal(res.data.meta.totalItems)
        }

    }

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery]);

    return (

        <>
            <div className="recommend-book-container">


                <Row>
                    <CustomImageTabs
                        onTabChange={(value: any) => { setSortQuery(value) }}
                    />
                </Row>

                <Row className='customize-row-recommended'>

                    {
                        listBook.map((item, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        navigate(`/book/${item.id}`)
                                        addViewedProduct(item.id)
                                    }

                                    }
                                    className="column-recommended" key={`book-${index}`}>
                                    <div className='wrapper-recommended'>
                                        <div className='thumbnail-recommended'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                        </div>
                                        <div className='text-recommended' title={item.mainText}>{item.mainText}</div>
                                        <div className='price-recommended'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                        </div>
                                        <div className='rating-recommended'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                            <span>Đã bán {item?.sold ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Row>

                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        responsive
                        onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                    />
                </Row>

            </div>



            <div style={{ marginTop: '15px' }}>
                <Row gutter={[20, 20]}>
                    <footer className="tiki-footer">
                        <div className="footer-container">
                            <Row gutter={[24, 24]}>
                                <Col xs={24} sm={12} md={6} lg={6}>
                                    <div className="footer-column">
                                        <h3>Hỗ trợ khách hàng</h3>
                                        <p className="hotline">Hotline: <strong>1900-6035</strong></p>
                                        <p className="support-time">(1000 đ/phút, 8-21h kể cả T7, CN)</p>
                                        <ul className="footer-links">
                                            <li><a href="#">Các câu hỏi thường gặp</a></li>
                                            <li><a href="#">Gửi yêu cầu hỗ trợ</a></li>
                                            <li><a href="#">Hướng dẫn đặt hàng</a></li>
                                            <li><a href="#">Phương thức vận chuyển</a></li>
                                            <li><a href="#">Chính sách kiểm hàng</a></li>
                                            <li><a href="#">Chính sách đổi trả</a></li>
                                            <li><a href="#">Hướng dẫn trả góp</a></li>
                                            <li><a href="#">Chính sách hàng nhập khẩu</a></li>
                                        </ul>
                                        <p>Hỗ trợ khách hàng: <a href="mailto:hotro@tiki.vn">hotro@tiki.vn</a></p>
                                        <p>Báo lỗi bảo mật: <a href="mailto:security@tiki.vn">security@tiki.vn</a></p>
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={6} lg={6}>
                                    <div className="footer-column">
                                        <h3>Về Tiki</h3>
                                        <ul className="footer-links">
                                            <li><a href="#">Giới thiệu Tiki</a></li>
                                            <li><a href="#">Tiki Blog</a></li>
                                            <li><a href="#">Tuyển dụng</a></li>
                                            <li><a href="#">Chính sách bảo mật thanh toán</a></li>
                                            <li><a href="#">Chính sách bảo mật thông tin cá nhân</a></li>
                                            <li><a href="#">Chính sách giải quyết khiếu nại</a></li>
                                            <li><a href="#">Điều khoản sử dụng</a></li>
                                            <li><a href="#">Giới thiệu Tiki Xu</a></li>
                                            <li><a href="#">Tiếp thị liên kết cùng Tiki</a></li>
                                            <li><a href="#">Bán hàng doanh nghiệp</a></li>
                                            <li><a href="#">Điều kiện vận chuyển</a></li>
                                        </ul>
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={6} lg={6}>
                                    <div className="footer-column">
                                        <h3>Hợp tác và liên kết</h3>
                                        <ul className="footer-links">
                                            <li><a href="#">Quy chế hoạt động Sàn GDTMĐT</a></li>
                                            <li><a href="#">Bán hàng cùng Tiki</a></li>
                                        </ul>

                                        <h3 className="certificate-title">Chứng nhận bởi</h3>
                                        <div className="certificates">
                                            <a href="#"><img src="/images/bo-cong-thuong.png" alt="Bộ Công Thương" /></a>
                                            <a href="#"><img src="/images/bct.png" alt="Đã đăng ký Bộ Công Thương" /></a>
                                            <a href="#"><img src="/images/dmca-badge.png" alt="DMCA protected" /></a>
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={6} lg={6}>
                                    <div className="footer-column">
                                        <h3>Phương thức thanh toán</h3>
                                        <div className="payment-methods">
                                            <img src="/images/payment-methods.png" alt="Phương thức thanh toán" />
                                        </div>

                                        <h3>Dịch vụ giao hàng</h3>
                                        <div className="delivery-service">
                                            <img src="/images/tikinow.png" alt="TikiNOW" />
                                        </div>

                                        <h3>Kết nối với chúng tôi</h3>
                                        <div className="social-links">
                                            <a href="#" className="social-icon facebook"><FacebookFilled /></a>
                                            <a href="#" className="social-icon youtube"><YoutubeFilled /></a>
                                            <a href="#" className="social-icon zalo">Zalo</a>
                                        </div>

                                        <h3>Tải ứng dụng trên điện thoại</h3>
                                        <div className="mobile-apps">
                                            <div className="qr-code">
                                                <img src="/images/qr-code.png" alt="QR Code" />
                                            </div>
                                            <div className="app-links">
                                                <a href="#"><img src="/images/app-store.png" alt="App Store" /></a>
                                                <a href="#"><img src="/images/google-play.png" alt="Google Play" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            <div className="company-info">
                                <h3>Công ty TNHH TI KI</h3>
                                <p>Tòa nhà số 52 đường Út Tịch, Phường 4, Quận Tân Bình, Thành phố Hồ Chí Minh</p>
                                <p>Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.</p>
                                <p>Hotline: <a href="tel:19006035">1900 6035</a></p>
                            </div>
                        </div>
                    </footer>

                </Row>

            </div>


        </>








    )


}


export default RecommendBook