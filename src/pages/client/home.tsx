import MobileFilter from '@/components/client/book/mobile.filter';
import { getBooksAPI, getBrandsAPI, getCategoryAPI, getFullCategories, getNameCategoryAPI, getSuppliersAPI } from '@/services/api';
import { FilterOutlined, FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import {
    Row, Col, Form, Checkbox, Divider, InputNumber,
    Button, Rate, Tabs, Pagination, Spin
} from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import 'styles/home.scss';
import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Space } from 'antd';
import FilterProduct from './filter';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};


const HomePage = () => {
    const [searchTerm] = useOutletContext() as any;


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

    const filteredBooks = useMemo(() => {
        return listBook.filter((book) =>
            book.mainText.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, listBook]); // ✅ Chỉ tính toán lại khi `searchTerm` hoặc `listBook` thay đổi


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


    const menuItems: MenuProps['items'] = [
        {
            key: '1',
            label: 'Item 1',
        },
        {
            key: '2',
            label: 'Item 2',
        },
        {
            key: '3',
            label: 'Item 3',
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



    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: "hidden" }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span>
                                        <span style={{ fontWeight: 500 }}> Khám phá theo danh mục</span>
                                    </span>

                                </div>
                                <Divider />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >
                                    <Form.Item
                                        name="category"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Row>

                                            {listCategory.map((item, index) => (
                                                <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                    <Row>
                                                        {/* Phần Category cha */}
                                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ fontWeight: 'bold' }}>{item.label}</div>

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
                                                                        <DownOutlined />
                                                                    </Space>
                                                                </a>

                                                            </div>
                                                        </div>
                                                    </Row>


                                                    {/* Phần hiển thị khi click vào */}
                                                    {nameCategory[item.label] && nameCategory[item.label].length > 0 && (
                                                        <div style={{ paddingLeft: '20px', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                            {nameCategory[item.label].map((subItem, subIndex) => (
                                                                <div key={subIndex}>{subItem}</div>
                                                            ))}
                                                        </div>
                                                    )}

                                                </Col>

                                            ))}


                                        </Row>
                                    </Form.Item>

                                </Form>
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
                                                                <img onClick={() => { setCategory(items.name) }}
                                                                    src={items.url}
                                                                    alt="English Books"
                                                                    style={{ width: "80%", height: "80%", objectFit: "cover" }}
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
                                        <h3>Tất cả sản phẩm</h3>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <div >
                                                <p>Thương hiệu</p>
                                                <div style={{ display: "flex", gap: "5px" }}>
                                                    {listBrand.slice(0, 4).map((items, index) => (
                                                        <Button key={index} style={{ border: "1px solid" }} type="text">
                                                            {items.name}
                                                        </Button>
                                                    ))}
                                                </div>

                                            </div>
                                            <div >
                                                <p>Nhà cung cấp</p>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {listSupplier.slice(0, 4).map((items, index) => (
                                                        <Button key={index} style={{ border: "1px solid" }} type="text">
                                                            {items.name}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>

                                                <Button onClick={() => { setIsModalOpen(true) }} style={{ border: '1px solid' }} type="text"> <FilterOutlined /> Tất cả</Button>

                                            </div>

                                        </div>

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
                                        {filteredBooks?.map((item, index) => {
                                            return (
                                                <div
                                                    onClick={() => navigate(`/book/${item._id}`)}
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
                                        })}
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
                        </Col>
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
                category={category}
                setCategory={setCategory}
                listBrand={listBrand}
                listSupplier={listSupplier}

            />



        </>
    )
}

export default HomePage;