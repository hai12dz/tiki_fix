import { getBooksAPI } from "@/services/api";
import { Pagination, Rate } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/booksp.scss';
import ExpandableDescription from "./ExpandableDescription";
interface IProps {
    currentBook: IBookTable | null;
}


const BookInDetail = (props: IProps) => {
    const { currentBook } = props
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const [listBook, setListBook] = useState<IBookTable[]>([]);

    useEffect(() => {
        fetchBook()
    }, [current, pageSize])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.items);
            setTotal(res.data.meta.totalItems)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: any) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    return (
        <div className="homepage-container-book">
            <div className="customize-row-book">
                {listBook.map((item, index) => (
                    <div
                        onClick={() => navigate(`/book/${item.id}`)}
                        className="column-book"
                        key={`book-${index}`}
                    >
                        <div className="wrapper-book">
                            <div className="thumbnail">
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt={item.mainText} />
                            </div>
                            <div className="text single-line">
                                {item.mainText}
                            </div>
                            <div className="book-info">
                                <div className="rating">
                                    <Rate value={5} disabled style={{ fontSize: '0.75rem', color: '#ffce3d' }} />
                                </div>

                            </div>
                            <div>
                                <p className="price-text">
                                    <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}</b>
                                </p>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                />
            </div>
            <div className="product-info">
                <div className="safe-shopping">
                    <h3>An tâm mua sắm</h3>
                    <div className="guarantee-item">
                        <span className="icon">📋</span>
                        <span>Được đồng kiểm khi nhận hàng</span>
                    </div>
                    <div className="guarantee-item">
                        <span className="icon">🔄</span>
                        <span>Được hoàn tiền 200% nếu là hàng giả.</span>
                    </div>
                    <div className="guarantee-item">
                        <span className="icon">🔄</span>
                        <span>Đổi trả miễn phí trong 30 ngày. Được đổi ý.</span>
                        <div className="details-link">
                            <a href="#">Chi tiết</a>
                        </div>
                    </div>
                </div>

                <div className="product-details">
                    <h3>Thông tin chi tiết</h3>
                    <div className="detail-row">
                        <div className="detail-label">Bookcare</div>
                        <div className="detail-value">Có</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Công ty phát hành</div>
                        <div className="detail-value">{currentBook?.supplier.name}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Ngày xuất bản</div>
                        <div className="detail-value">
                            {currentBook?.createdAt
                                ? new Date(currentBook.createdAt).toLocaleString("vi-VN", {
                                    timeZone: "Asia/Ho_Chi_Minh",
                                })
                                : "N/A"}
                        </div>


                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Kích thước</div>
                        <div className="detail-value">13 × 20,5cm</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Dịch Giả</div>
                        <div className="detail-value">{currentBook?.author}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Loại bìa</div>
                        <div className="detail-value">Bìa mềm</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Số trang</div>
                        <div className="detail-value">358</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Nhà xuất bản</div>
                        <div className="detail-value">Nhà Xuất Bản Dân Trí</div>
                    </div>
                </div>

                <ExpandableDescription />
            </div>
        </div>

    )
}

export default BookInDetail;