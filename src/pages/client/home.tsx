import MobileFilter from '@/components/client/book/mobile.filter';
import { filterBookWithFullInfoAPI, getBooksAPI, getBrandsAPI, getCategoryAPI, getFullCategories, getNameCategoryAPI, getSuppliersAPI } from '@/services/api';
import { FacebookFilled, FilterOutlined, FilterTwoTone, ReloadOutlined, UpOutlined, YoutubeFilled } from '@ant-design/icons';
import { Card, Carousel, Image, List } from 'antd';
import {
    Row, Col, Form, Checkbox, Divider, InputNumber,
    Button, Rate, Tabs, Pagination, Spin
} from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import 'styles/home.scss';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import FilterProduct from './filter';
import _ from "lodash";
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
// Tạo số lượng ngẫu nhiên từ 1 đến tổng số sách


type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};


const HomePage = () => {
    const { Title } = Typography;
    const [searchTerm, setSearchTerm] = useOutletContext() as any;



    const [listCategory, setListCategory] = useState<{
        label: string, value: string
    }[]>([]);

    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
    const [nameCategory, setNameCategory] = useState<{ [key: string]: string[] }>({});
    const [listBrand, setListBrand] = useState<IBrands[]>([])
    const [listSupplier, setListSupplier] = useState<ISupplier[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [queryFiler, setQueryFilter] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [listFullCategory, setListFullCategory] = useState<ICategory[]>([])
    const [form] = Form.useForm();
    const navigate = useNavigate();
    // Change these from string to arrays
    const [brand, setBrand] = useState<string[]>([]);
    const [supplier, setSupplier] = useState<string[]>([]);
    const filteredBooks = useMemo(() => {
        return listBook.filter((book) =>
            book.mainText.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, listBook]); // ✅ Chỉ tính toán lại khi `searchTerm` hoặc `listBook` thay đổi
    const randomCount = Math.floor(Math.random() * listBook.length) + 1;

    // Trộn ngẫu nhiên danh sách và lấy số lượng sản phẩm ngẫu nhiên
    const randomBooks = _.shuffle(listBook).slice(0, randomCount);


    // Format price with Vietnamese currency
    const formatPrice = (price: any) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        initCategory();
    }, []);

    useEffect(() => {
        // Add empty dependency array to prevent infinite rendering

        fetchBrand();
        fetchSupplier();
        fetchFullCategories(); // This function was defined but never called
    }, []);
    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`;
        }

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.items);
            setTotal(res.data.meta.totalItems)
        }
        setIsLoading(false)
    }


    const fetchBrand = async () => {

        const res = await getBrandsAPI();
        setListBrand(res.data!)

    }
    const fetchSupplier = async () => {

        const res = await getSuppliersAPI();
        setListSupplier(res.data!)

    }

    const fetchFullCategories = async () => {
        const res = await getFullCategories()

        setListFullCategory(res.data!)

    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

    }


    const handleChangeFilter = (changedValues: any, values: any) => {
        //only fire if category changes
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`)
            } else {
                //reset data -> fetch all
                setFilter('');
            }
        }

    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`
            }
            setFilter(f);
        }

    }

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];




    // Hàm lấy danh mục con của từng category riêng biệt
    const showCategories = async (categoryName: string) => {

        const query = `name=${categoryName}`;
        const res = await getNameCategoryAPI(query);

        setNameCategory(prevState => ({
            ...prevState,
            [categoryName]: res.data ?? []
        }));
    };

    const filterProduct = async () => {
        let query = `current=1&pageSize=${pageSize}`;
        let isChange: boolean = false;

        // Only add parameters to query if they have values
        if (category && category !== "") {
            isChange = true;
            query += `&nameCategory=${category}`;
        }
        if (brand.length > 0) {
            isChange = true;
            query += `&nameBrand=${brand.join(',')}`;
        }
        if (supplier.length > 0) {
            isChange = true;
            query += `&nameSupplier=${supplier.join(',')}`;
        }

        // If any filter is applied, use the filter API
        if (isChange === true) {
            const res = await filterBookWithFullInfoAPI(query);
            setTotal(res.data!.meta.totalItems)
            setListBook(res.data?.items || []);
        }
        // If NO filters are applied, fetch all books
        else {
            await fetchBook(); // Make sure to await this
        }
    };

    // Modify the useEffect to run when any filter changes
    useEffect(() => {
        // Always run filterProduct whether filters are set or reset
        filterProduct();
    }, [category, brand, supplier]);



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

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: "hidden" }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span className="category-title-big">
                                        <span style={{ fontWeight: 500 }}> Khám phá theo danh mục</span>
                                    </span>
                                </div>
                                <Divider />
                                <Form onFinish={onFinish} form={form} onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}>
                                    <Form.Item name="category" labelCol={{ span: 24 }}>
                                        <Row>
                                            {listCategory.map((item, index) => (
                                                <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                    <Row>
                                                        {/* Phần Category cha */}
                                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div className="category-title" style={{ fontWeight: 'bold' }}>{item.label}</div>
                                                            <div
                                                                style={{
                                                                    display: 'inline-block',
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                    transition: 'background 0.3s ease-in-out',

                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = '#00000020')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                            >
                                                                <a
                                                                    className='text1'

                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setNameCategory((prev) => {
                                                                            const isOpen = prev[item.label]?.length > 0;
                                                                            if (isOpen) {
                                                                                const updatedState = { ...prev };
                                                                                delete updatedState[item.label]; // Xóa danh mục con khỏi state
                                                                                return updatedState;
                                                                            } else {
                                                                                showCategories(item.label);
                                                                                return prev;
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    <Space>
                                                                        {nameCategory[item.label]?.length > 0 ? <UpOutlined /> : <DownOutlined />}
                                                                    </Space>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </Row>

                                                    {/* Phần hiển thị khi click vào */}
                                                    {nameCategory[item.label] && nameCategory[item.label].length > 0 && (
                                                        <div style={{ paddingLeft: '20px', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                            {nameCategory[item.label].map((subItem, subIndex) => (
                                                                <div
                                                                    key={subIndex}
                                                                    className="category-sub-item"
                                                                    style={{
                                                                        padding: '5px 0',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.color = '#1890ff'; // Màu xanh
                                                                        e.currentTarget.style.textDecoration = 'underline #1890ff'; // Gạch chân màu xanh
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.color = '#666'; // Màu ban đầu
                                                                        e.currentTarget.style.textDecoration = 'none'; // Bỏ gạch chân
                                                                    }}
                                                                >
                                                                    {subItem}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Col>
                                            ))}
                                        </Row>
                                    </Form.Item>
                                </Form>
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <div>
                                    <Image src="/images/qc1.png" alt="QC1" style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                                </div>

                                <div className="promo-container">
                                    <Card className="promo-card">
                                        <div>
                                            <img className="card-image" src="/images/qc2.png" alt="Promotional book image" />
                                            <div className="card-content">
                                                <div className="card-title">Top sách bán chạy</div>
                                                <div className="card-sponsor">Tài trợ bởi</div>
                                                <div className="card-sponsor-name">1980 Books Tại Tiki Trading</div>
                                                <div className="card-offer">
                                                    <span className="discount-badge">Giảm 35K</span>
                                                    <Button type='primary'>Xem thêm</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="promo-card">
                                        <div>
                                            <img className="card-image" src="/images/qc3.png" alt="Promotional book image" />
                                            <div className="card-content">
                                                <div className="card-title">Bìa & Sổ Tay Đẹp</div>
                                                <div className="card-sponsor">Tài trợ bởi</div>
                                                <div className="card-sponsor-name">1980 Books Tại Tiki Trading</div>
                                                <div className="card-offer">
                                                    <Button type='primary'>Xem thêm</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </Col>





                        <Col md={20} xs={24} >

                            <Spin spinning={isLoading} tip="Loading...">

                                <Row>
                                    < div

                                        style={{
                                            width: '100%',
                                            border: '1px solid white', // Viền màu xám nhẹ
                                            borderRadius: '5px', // Bo góc 5px
                                            backgroundColor: 'white',
                                            padding: '20px 20px',
                                            marginBottom: '20px', // Tạo khoảng cách giữa phần nền xám phía trên và nội dung bên dưới
                                        }}>
                                        <h1>Nhà Sách Tiki</h1>

                                    </div>
                                </Row>

                                <Row>
                                    < div

                                        style={{

                                            width: '100%',

                                            marginBottom: '20px', // Tạo khoảng cách giữa phần nền xám phía trên và nội dung bên dưới
                                        }}>
                                        <Carousel arrows infinite={true}>
                                            <div className="carousel-slide">
                                                <img src="/images/slide1.png" alt="Slide 1" />
                                                <img src="/images/slide2.png" alt="Slide 2" />
                                            </div>
                                            <div className="carousel-slide">
                                                <img src="/images/slide3.png" alt="Slide 3" />
                                                <img src="/images/slide4.png" alt="Slide 4" />
                                            </div>
                                            <div className="carousel-slide">
                                                <img src="/images/slide5.png" alt="Slide 5" />
                                                <img src="/images/slide6.png" alt="Slide 6" />
                                            </div>
                                            <div className="carousel-slide">
                                                <img src="/images/slide7.png" alt="Slide 7" />
                                                <img src="/images/slide8.png" alt="Slide 8" />
                                            </div>
                                        </Carousel>
                                    </div>
                                </Row>

                                <Row>
                                    <div
                                        style={{
                                            width: "100%",
                                            border: "1px solid #eee",
                                            borderRadius: "8px",
                                            backgroundColor: "white",
                                            padding: "15px",
                                            marginBottom: "20px",

                                        }}
                                    >
                                        <h3 style={{
                                            fontWeight: "bold",
                                            fontSize: "22px",
                                            marginBottom: "20px",
                                            textAlign: "left"
                                        }}>
                                            Khám phá theo danh mục
                                        </h3>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "20px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {

                                                listFullCategory.map((items, index) => {
                                                    return (
                                                        <div key={index} style={{ textAlign: "center" }}>
                                                            <div
                                                                style={{
                                                                    width: "120px",
                                                                    height: "120px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#f5f5f5",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    overflow: "hidden",
                                                                    margin: "0 auto",
                                                                    border: "1px solid #f0f0f0"
                                                                }}
                                                            >
                                                                <img
                                                                    onClick={() => {
                                                                        if (category !== items.name) {
                                                                            setCategory(items.name);
                                                                        } else {

                                                                        }
                                                                    }}
                                                                    src={items.url}
                                                                    alt="English Books"
                                                                    style={{
                                                                        width: "80%",
                                                                        height: "80%",
                                                                        objectFit: "cover",
                                                                        transition: "transform 0.3s ease",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                                />

                                                            </div>
                                                            <p style={{
                                                                fontWeight: "normal",
                                                                fontSize: "16px",
                                                                marginTop: "10px"
                                                            }}>
                                                                {items.name}
                                                            </p>
                                                        </div>
                                                    );
                                                })


                                            }


                                        </div>
                                    </div>
                                </Row>

                                <Row>
                                    < div

                                        style={{
                                            width: '100%',
                                            border: '1px solid white', // Viền màu xám nhẹ
                                            borderRadius: '5px', // Bo góc 5px
                                            backgroundColor: 'white',
                                            padding: '20px 20px',
                                            marginBottom: '20px', // Tạo khoảng cách giữa phần nền xám phía trên và nội dung bên dưới
                                        }}>
                                        <Row>
                                            <div className="filter-section" style={{
                                                width: '100%',
                                                border: '1px solid white',
                                                borderRadius: '5px',
                                                backgroundColor: 'white',
                                                marginBottom: '20px',
                                            }}>
                                                <h3>Tất cả sản phẩm</h3>
                                                <div className="filter-options">
                                                    <div className="filter-category">
                                                        <p>Thương hiệu</p>
                                                        <div className="filter-buttons">
                                                            {listBrand.slice(0, 4).map((items, index) => (
                                                                <Button
                                                                    onClick={() => {
                                                                        if (!brand.includes(items.name)) {
                                                                            setBrand([...brand, items.name]);
                                                                        } else {
                                                                            setBrand(brand.filter(item => item !== items.name));
                                                                        }
                                                                    }}
                                                                    key={index}
                                                                    className={`filter-button ${brand.includes(items.name) ? 'active-filter' : ''}`}
                                                                    type={brand.includes(items.name) ? "primary" : "text"}
                                                                >
                                                                    {items.name}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="filter-category">
                                                        <p>Nhà cung cấp</p>
                                                        <div className="filter-buttons">
                                                            {listSupplier.slice(0, 4).map((items, index) => (
                                                                <Button
                                                                    onClick={() => {
                                                                        if (!supplier.includes(items.name)) {
                                                                            setSupplier([...supplier, items.name]);
                                                                        } else {
                                                                            setSupplier(supplier.filter(item => item !== items.name));
                                                                        }
                                                                    }}
                                                                    key={index}
                                                                    className={`filter-button ${supplier.includes(items.name) ? 'active-filter' : ''}`}
                                                                    type={supplier.includes(items.name) ? "primary" : "text"}
                                                                >
                                                                    {items.name}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>


                                                    <div className="filter-category">
                                                        <p style={{ visibility: 'hidden' }} >Nhà cung cấp</p>

                                                        <Button
                                                            onClick={() => { setIsModalOpen(true) }}
                                                            className="filter-all-button"
                                                            type="text"

                                                        >
                                                            <FilterTwoTone style={{ marginRight: '4px' }} />Lọc tất cả
                                                        </Button>

                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                </Row>


                                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>

                                    <Row >
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => { setSortQuery(value) }}
                                            style={{ overflowX: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }} >
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}> Lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className='customize-row'>
                                        {filteredBooks?.length > 0 ? (
                                            filteredBooks.map((item, index) => {
                                                return (
                                                    <div
                                                        onClick={() => {
                                                            navigate(`/book/${item.id}`)
                                                            addViewedProduct(item.id)
                                                        }

                                                        }
                                                        className="column" key={`book-${index}`}>
                                                        <div className='wrapper'>
                                                            <div className='thumbnail'>
                                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                            </div>
                                                            <div className='text' title={item.mainText}>{item.mainText}</div>
                                                            <div className='price'>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                            </div>
                                                            <div className='rating'>
                                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                                <span>Đã bán {item?.sold ?? 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                padding: '50px 0',
                                                fontSize: '18px',
                                                color: '#666',
                                                border: '1px dashed #ddd',
                                                borderRadius: '8px',
                                                margin: '20px 0'
                                            }}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <ReloadOutlined style={{ fontSize: '32px', color: '#999' }} />
                                                </div>
                                                <p>Chúng tôi không có sản phẩm phù hợp</p>
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setCategory("");
                                                        setBrand([]); // Reset brand filter to empty array
                                                        setSupplier([]); // Reset supplier filter to empty array
                                                        fetchBook();
                                                    }}
                                                    icon={<ReloadOutlined />}
                                                >
                                                    Xem tất cả sản phẩm
                                                </Button>

                                            </div>
                                        )}
                                    </Row>
                                    <div style={{ marginTop: 30 }}></div>
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
                            </Spin>

                            <Row>
                                <div style={{ width: '100%', marginTop: '30px', padding: '10px', background: 'white' }}>

                                    <div>
                                        <h2>Sản Phẩm Đề Xuất</h2>
                                    </div>
                                    <div style={{ marginTop: '30px' }}>
                                        <Row className="customize-row">
                                            {randomBooks.map((item, index) => (
                                                <div
                                                    onClick={() => navigate(`/book/${item.id}`)}
                                                    className="column"
                                                    key={`book-${index}`}
                                                >
                                                    <div className="wrapper">
                                                        <div className="thumbnail">
                                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                        </div>
                                                        <div className="text" title={item.mainText}>{item.mainText}</div>
                                                        <div className="price">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                        </div>
                                                        <div className="rating">
                                                            <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                                            <span>Đã bán {item?.sold ?? 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Row>

                                    </div>
                                </div>

                            </Row>



                        </Col>


                    </Row>

                    <Row gutter={[20, 20]}>



                        <div style={{
                            marginTop: '10px',
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A94FF', margin: 0 }}>SÁCH HAY TIKI KHUYÊN ĐỌC</h2>

                            </div>

                            {/* Book display section */}
                            <div className="book-container">
                                {/* Book items */}
                                {listBook.slice(0, 4).map((item) => (
                                    <div key={item.id} className="book-wrap">
                                        <div className="book-item">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                alt={`Sách hay ${item}`}
                                            />
                                            <h4>{item.mainText}</h4>
                                            <p>{item.price.toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* Text content section with expand/collapse functionality */}
                            <div
                                id="book-recommendation-content"
                                className="collapsed"
                                style={{
                                    padding: '30px',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.5s ease'
                                }}
                            >
                                <p>Nhà sách là một trong những địa điểm gắn liền với tuổi thơ của nhiều người. Nơi đây không chỉ cung cấp cho chúng ta một nguồn kho tàng tri thức quý giá mà còn bày bán rất nhiều món <a href="#" style={{ color: '#1890ff' }}>quà lưu niệm</a> đáng yêu cùng vô vàn món <a href="#" style={{ color: '#1890ff' }}>văn phòng phẩm</a> khác. Cùng Tiki tìm hiểu thêm những điều thú vị tại nhà sách qua bài viết dưới đây nhé.</p>

                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '20px 0 10px' }}>Nhà sách - Thế giới tri thức và tinh hoa nhân loại</h3>

                                <p>Người ta thường nói "sách là một kho tàng vô giá" vì nó chứa đựng nhiều kiến thức bổ ích của nhân loại. Chính vì thế mà nhà sách, nơi được trưng bày hàng nghìn cuốn sách có thể nói là một thế giới tri thức và hội tụ đủ muôn vàng tinh hoa của các nền văn hóa khác nhau.</p>

                                <p>Một vài địa điểm bán sách nổi tiếng và đã xuất hiện từ lâu như nhà sách Fahasa, nhà sách Nhã Nam chắc hẳn là nơi đã lưu giữ kỷ niệm tuổi thơ của nhiều người. Những nhà sách này không chỉ bán mới sách mà còn "bán" cả niềm vui, sự hạnh phúc cho nhiều em nhỏ ở tuổi cắp sách đến trường.</p>

                                <p>Nơi đây có nhiều loại sách khác nhau với đa dạng lĩnh vực từ <a href="#" style={{ color: '#1890ff' }}>kinh tế</a>, văn hóa, nghệ thuật,...cho đến triết học hay <a href="#" style={{ color: '#1890ff' }}>công nghệ</a>. Thêm vào đó, những loại sách bao gồm các kiến thức về ẩm thực, <a href="#" style={{ color: '#1890ff' }}>gia đình</a> cũng có mặt tại đây. Đồng thời, các sách không chỉ dành cho người học sinh, sinh viên mà còn là thiên đường dành cho những ai ham học hỏi và say tìm đến kiến thức.</p>

                                <p>Tham khảo thêm về: <a href="#" style={{ color: '#1890ff' }}>sách</a>, <a href="#" style={{ color: '#1890ff' }}>truyện One Piece</a>, <a href="#" style={{ color: '#1890ff' }}>Truyện One Punch Man</a>, <a href="#" style={{ color: '#1890ff' }}>Tokyo Revengers manga</a>, <a href="#" style={{ color: '#1890ff' }}>Kính Vạn Hoa Chết Chóc</a></p>

                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '20px 0 10px' }}>Tại sao nên chọn nhà sách Tiki?</h3>

                                <p>Bên cạnh những nhà sách truyền thống như nhà sách Fahasa, nhà sách Nhã Nam, nhà sách Phương Nam,...Tiki sẽ là một lựa chọn mới mẻ và thú vị dành cho những ai có sở thích mua sách online. <a href="#" style={{ color: '#1890ff' }}>Nhà sách Tiki</a> sở hữu một kho tàng sách rộng lớn với đa dạng các loại sách khác nhau để các bạn có thể lựa chọn.</p>

                                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                    <li style={{ marginBottom: '5px' }}>Thao tác mua và thanh toán đơn giản</li>
                                </ul>

                                <p>Nếu như những nhà sách truyền thống khiến các bạn thích thú vì có thể tận tay cầm những cuốn sách hay có được cảm giác thoải mái khi dạo vòng quanh những gian sách thì nhà sách trực tuyến Tiki sẽ mang đến cho các bạn sự thuận tiện khi mua sắm.</p>

                                <p>Thay vì phải loay hoay đi khắp nơi để tìm được cuốn sách mình muốn mua, các bạn chỉ cần lên gian hàng sách trực tuyến Tiki gõ tên sách mình cần tìm là nó sẽ xuất hiện ngay. Thêm vào đó, việc thanh toán sau khi mua hàng cũng sẽ vô cùng nhanh chóng và không cần phải chen chúc xếp hàng để chờ đến lượt mình.</p>

                            </div>
                            <Button
                                type="text"
                                style={{
                                    display: 'block',
                                    margin: '10px auto',
                                    textDecoration: 'underline' // Thêm gạch chân dưới chữ
                                }}
                                onClick={() => {
                                    const contentElement = document.getElementById('book-recommendation-content');
                                    const buttonElement = document.getElementById('toggle-content-button');

                                    if (contentElement && buttonElement) {
                                        if (contentElement.classList.contains('collapsed')) {
                                            contentElement.classList.remove('collapsed');
                                            contentElement.classList.add('expanded');
                                            buttonElement.innerText = 'Thu gọn';
                                        } else {
                                            contentElement.classList.remove('expanded');
                                            contentElement.classList.add('collapsed');
                                            buttonElement.innerText = 'Xem thêm';
                                        }
                                    }
                                }}
                                id="toggle-content-button"
                            >
                                Xem thêm
                            </Button>


                        </div>
                        <div>
                            <Image
                                style={{ width: "100%" }}
                                src="/images/footer.png"
                            />
                        </div>
                    </Row>
                    <Row gutter={[20, 20]}>
                        <div style={{
                            width: '100%',
                            backgroundColor: 'white',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '5px'
                        }}>
                            <h2 style={{ borderBottom: '1px solid #efefef', paddingBottom: '10px', fontSize: '22px', fontWeight: 'bold' }}>Thông Tin Danh Mục</h2>

                            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                                <p>Nhà sách là một trong những địa điểm gắn liền với tuổi thơ của nhiều người. Nơi đây không chỉ cung cấp cho chúng ta một nguồn kho tàng tri thức quý giá mà còn bày bán rất nhiều món <a href="#" style={{ color: '#1890ff' }}>quà lưu niệm</a> đáng yêu cùng vô vàn món <a href="#" style={{ color: '#1890ff' }}>văn phòng phẩm</a> khác. Cùng Tiki tìm hiểu thêm những điều thú vị tại nhà sách qua bài viết dưới đây nhé.</p>

                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '20px 0 10px' }}>Nhà sách - Thế giới tri thức và tinh hoa nhân loại</h3>

                                <p>Người ta thường nói "sách là một kho tàng vô giá" vì nó chứa đựng nhiều kiến thức bổ ích của nhân loại. Chính vì thế mà nhà sách, nơi được trưng bày hàng nghìn cuốn sách có thể nói là một thế giới tri thức và hội tụ đủ muôn vàng tinh hoa của các nền văn hóa khác nhau.</p>

                                <p>Một vài địa điểm bán sách nổi tiếng và đã xuất hiện từ lâu như nhà sách Fahasa, nhà sách Nhã Nam chắc hẳn là nơi đã lưu giữ kỷ niệm tuổi thơ của nhiều người. Những nhà sách này không chỉ bán mới sách mà còn "bán" cả niềm vui, sự hạnh phúc cho nhiều em nhỏ ở tuổi cắp sách đến trường.</p>

                                <p>Nơi đây có nhiều loại sách khác nhau với đa dạng lĩnh vực từ <a href="#" style={{ color: '#1890ff' }}>kinh tế</a>, văn hóa, nghệ thuật,...cho đến triết học hay <a href="#" style={{ color: '#1890ff' }}>công nghệ</a>. Thêm vào đó, những loại sách bao gồm các kiến thức về ẩm thực, <a href="#" style={{ color: '#1890ff' }}>gia đình</a> cũng có mặt tại đây. Đồng thời, các sách không chỉ dành cho người học sinh, sinh viên mà còn là thiên đường dành cho những ai ham học hỏi và say tìm đến kiến thức.</p>

                                <p>Tham khảo thêm về: <a href="#" style={{ color: '#1890ff' }}>sách</a>, <a href="#" style={{ color: '#1890ff' }}>truyện One Piece</a>, <a href="#" style={{ color: '#1890ff' }}>Truyện One Punch Man</a>, <a href="#" style={{ color: '#1890ff' }}>Tokyo Revengers manga</a>, <a href="#" style={{ color: '#1890ff' }}>Kính Vạn Hoa Chết Chóc</a></p>

                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '20px 0 10px' }}>Tại sao nên chọn nhà sách Tiki?</h3>

                                <p>Bên cạnh những nhà sách truyền thống như nhà sách Fahasa, nhà sách Nhã Nam, nhà sách Phương Nam,...Tiki sẽ là một lựa chọn mới mẻ và thú vị dành cho những ai có sở thích mua sách online. <a href="#" style={{ color: '#1890ff' }}>Nhà sách Tiki</a> sở hữu một kho tàng sách rộng lớn với đa dạng các loại sách khác nhau để các bạn có thể lựa chọn.</p>

                                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                    <li style={{ marginBottom: '5px' }}>Thao tác mua và thanh toán đơn giản</li>
                                </ul>

                                <p>Nếu như những nhà sách truyền thống khiến các bạn thích thú vì có thể tận tay cầm những cuốn sách hay có được cảm giác thoải mái khi dạo vòng quanh những gian sách thì nhà sách trực tuyến Tiki sẽ mang đến cho các bạn sự thuận tiện khi mua sắm.</p>

                                <p>Thay vì phải loay hoay đi khắp nơi để tìm được cuốn sách mình muốn mua, các bạn chỉ cần lên gian hàng sách trực tuyến Tiki gõ tên sách mình cần tìm là nó sẽ xuất hiện ngay. Thêm vào đó, việc thanh toán sau khi mua hàng cũng sẽ vô cùng nhanh chóng và không cần phải chen chúc xếp hàng để chờ đến lượt mình.</p>
                            </div>
                            <div className='res-footerqq'>
                                <figure>
                                    <img
                                        src="/images/footerqq.png"
                                        alt="QC1"
                                        width="100%"
                                        height="auto"
                                    />
                                    <figcaption>
                                        <i>Nhà sách Tiki - mua sắm dễ dàng, giao hàng nhanh chóng (Nguồn: Tiki)</i>
                                        <div>Xem thêm: <a href="#">sách giáo khoa lớp 10 mới</a>, <a href="#">thần đồng đất việt</a>, <a href="#">hoàng tử bé</a></div>
                                    </figcaption>
                                </figure>
                            </div>




                        </div>

                    </Row>
                    <Row gutter={[20, 20]}>
                        <div className="top-selling-books">
                            <Title level={3} className="section-title">Top Bán Chạy Sản Phẩm Nhà Sách Tiki</Title>
                            <List
                                className="book-list"
                                dataSource={listBook}
                                renderItem={(book, index) => (
                                    <List.Item >
                                        <div className="book-info">
                                            <span className="book-index">{index + 1}.</span>
                                            <Link to={`/book/${book.id}`} className="book-title">
                                                {book.mainText}
                                            </Link>
                                        </div>
                                        <div className="book-price">
                                            {formatPrice(book.price)}
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Row>

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
            </div>
            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />


            <FilterProduct
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                queryFiler={queryFiler}
                setQueryFilter={setQueryFilter}
                listBrand={listBrand}
                listSupplier={listSupplier}
                pageSize={pageSize}
                setListBook={setListBook}
                setTotal={setTotal}
                listFullCategory={listFullCategory}

            />



        </>
    )
}

export default HomePage;