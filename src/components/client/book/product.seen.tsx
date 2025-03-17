import { Carousel, Rate } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/product.seen.scss'
interface IProps {
    listBookViewed: IBookTable[] | null;
}

const ProductSeen = (props: IProps) => {
    const { listBookViewed } = props
    const navigate = useNavigate();
    return (
        <div >


            <div className="product-seen-container">
                <div style={{ paddingLeft: '30px' }}>
                    <h2>Sản phẩm bạn đã xem</h2>
                </div>
                <div className="row-book-seen">


                    {listBookViewed!.map((item, index) => (
                        <div
                            onClick={() => navigate(`/book/${item.id}`)}
                            className="column-book-seen"
                            key={`book-${index}`}
                        >
                            <div className="wrapper-book-seen">
                                <div className="thumbnail-seen">
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt={item.mainText} />
                                </div>
                                <div className="text-seen single-line">
                                    {item.mainText}
                                </div>
                                <div className="book-info-seen">
                                    <div className="rating-seen">
                                        <Rate value={5} disabled style={{ fontSize: '0.75rem', color: '#ffce3d' }} />
                                    </div>

                                </div>
                                <div>
                                    <p className="price-text-seen">
                                        <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}</b>
                                    </p>

                                </div>
                            </div>
                        </div>
                    ))}


                </div>



            </div>

            <div
                className="carousel-seen">
                <h2
                    style={{ paddingLeft: '20px' }}
                >Thương hiệu liên quan</h2>
                <Carousel arrows infinite={true}>
                    <div className="carousel-slide-seen">
                        <img src="/images/seen-cr1.png" alt="Slide 1" />
                        <img src="/images/seen-cr2.png" alt="Slide 2" />
                    </div>
                    <div className="carousel-slide-seen">
                        <img src="/images/seen-cr3.png" alt="Slide 3" />
                        <img src="/images/seen-cr2.png" alt="Slide 4" />
                    </div>

                </Carousel>





            </div>










        </div>
    )


}


export default ProductSeen