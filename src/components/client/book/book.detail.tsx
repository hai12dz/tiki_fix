import { Row, Col, Rate, Divider, App, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import 'styles/book.scss';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { Link, useNavigate } from 'react-router-dom';
import BookInfo from './book.info';
import { fetchViewedProductsAPI, getSuppliersAPI } from '@/services/api';
import BookInDetail from './book.support';
import CustomerReview from './CustomerReview';
import ProductSeen from './product.seen';
import RecommendBook from './book.recommended';

interface IProps {
    currentBook: IBookTable | null;
}

type UserAction = "MINUS" | "PLUS"

const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const refGallery = useRef<ImageGallery>(null);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);

    const { setCarts, user } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [listBookViewed, setListBookViewd] = useState<IBookTable[]>([])


    useEffect(() => {
        fetchViewedProducts()
    }, [])

    const fetchViewedProducts = async () => {
        const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]");

        if (viewedProducts.length > 0) {
            try {
                const response = await fetchViewedProductsAPI(viewedProducts)
                setListBookViewd(response.data!)
            } catch (error) {
                console.error("Lỗi khi fetch sản phẩm đã xem:", error);
            }
        }
    };

    useEffect(() => {
        if (currentBook) {
            //build images 
            const images = [];
            if (currentBook.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleChangeButton = (type: UserAction) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này.")
            return;
        }
        //update localStorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            //check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?.id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity =
                    carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook.id,
                    detail: currentBook
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts));

            //sync React Context
            setCarts(carts);
        } else {
            //create
            const data = [{
                _id: currentBook?.id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            //sync React Context
            setCarts(data);
        }

        if (isBuyNow) {
            navigate("/order")
        } else
            message.success("Thêm sản phẩm vào giỏ hàng thành công.")
    }

    return (
        <div style={{ background: '#efefef', }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, padding: '20px 0', margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Trang Chủ</Link>,
                        },
                        {
                            title: 'Xem chi tiết sách',
                        },
                    ]}
                />
                <div style={{ borderRadius: 5, position: 'relative' }}>
                    <Row gutter={[20, 20]}>
                        <Col md={17} sm={24}>

                            <Row gutter={[30, 0]}> {/* Thêm Row để chứa 2 cột con */}
                                <Col md={11} sm={24}

                                    style={{
                                        marginRight: '25px',
                                        backgroundColor: '#fff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'sticky',
                                        top: 20,  // Thêm khoảng cách từ trên xuống
                                        height: 'fit-content',
                                        borderRadius: '10px',

                                    }}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        renderLeftNav={() => <></>}
                                        renderRightNav={() => <></>}
                                        slideOnThumbnailOver={true}
                                        onClick={() => handleOnClickImage()}
                                    />
                                </Col>
                                <Col md={12} sm={24} style={{ borderRadius: '10px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                    <BookInfo currentBook={currentBook} />
                                </Col>
                            </Row>

                            <Row style={{ marginTop: '15px' }} gutter={[20, 15]}> {/* Thêm Row để chứa 2 cột con */}
                                <Col md={24} sm={24} style={{ borderRadius: '10px', background: '#fff', display: 'flex', flexDirection: 'column', position: 'sticky' }}>
                                    <Row gutter={[20, 20]}>
                                        <Col md={16} sm={0} xs={0}>


                                            <CustomerReview />
                                        </Col>


                                    </Row>
                                </Col>

                            </Row>

                        </Col>
                        <Col md={7} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    showThumbnails={false}
                                />
                            </Col>

                            <Col span={24} style={{ borderRadius: '10px', position: 'sticky', top: 20, height: 'fit-content', background: '#fff' }}>
                                <Row gutter={[8, 0]}>
                                    <Col>
                                        <div>
                                            <img style={{ width: '40px', height: '40px' }} src={`/images/${currentBook?.supplier?.logo}`} alt="" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <Row style={{ marginBottom: '2px' }}>{currentBook?.supplier.name}</Row>
                                        <Row>
                                            <img style={{ width: '72px', height: '20px' }} src="/images/official.png" alt="" />&nbsp; | 4.7 &nbsp; <StarFilled style={{ color: "gold" }} />
                                            &nbsp; (5,5tr+ đánh giá)
                                        </Row>
                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col md={24}>
                                        <div className='quantity'>
                                            <span className='left'>Số lượng</span>
                                            <span className='right'>
                                                <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                                <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                                <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col md={24}>
                                        <div>Tạm tính</div>
                                        <div className='price'>
                                            <span className='currency'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                    Number(currentBook?.price || 0) - (Number(currentBook?.price || 0) * Number(currentBook?.promotion || 0) / 100)
                                                )}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='delivery'>
                                            <div>
                                                <span className='left'>Vận chuyển</span>
                                                <span className='right'>Miễn phí vận chuyển</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <div className='buy'>
                                        <button className='cart' onClick={() => handleAddToCart()}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button onClick={() => handleAddToCart(true)} className='now'>Mua ngay</button>
                                    </div>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </div>
                <div style={{ marginTop: '20px', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={24} sm={0} xs={0}>

                            <ProductSeen
                                listBookViewed={listBookViewed}
                            />

                        </Col>


                    </Row>


                </div>


                <div style={{ marginTop: '20px', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={24} sm={0} xs={0}>

                            <RecommendBook />

                        </Col>


                    </Row>


                </div>

            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div>
    )
}

export default BookDetail;