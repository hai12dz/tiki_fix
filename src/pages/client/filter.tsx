import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row } from 'antd';
import { filterBookWithFullInfoAPI, getFullCategories } from '@/services/api';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void;
    queryFiler: string
    setQueryFilter: (v: string) => void
    listBrand: IBrands[]
    listSupplier: ISupplier[]
    setListBook: (v: IBookTable[]) => void
    pageSize: number
    setTotal: (v: number) => void
    listFullCategory: ICategory[]

}

const FilterProduct = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, listBrand, listSupplier, pageSize, setListBook, setTotal, listFullCategory } = props;
    const [brand, setBrand] = useState<string>("");
    const [supplier, setSupplier] = useState<string>("");
    const [showFullBrandList, setShowFullBrandList] = useState(false);
    const [showFullSupplierList, setShowFullSupplierList] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("")


    const [form] = Form.useForm();

    const handleOk = async (values: any) => {
        handleCancel();
        let query = `current=1&pageSize=${pageSize}`;

        if (brand) query += `&brand=${brand}`;
        if (category) query += `&nameCategory=${category}`;
        if (supplier) query += `&supplier=${supplier}`;

        const minPrice = values.minPrice;
        const maxPrice = values.maxPrice;
        if (minPrice !== undefined) query += `&priceBottom=${minPrice}`;
        if (maxPrice !== undefined) query += `&priceTop=${maxPrice}`;

        console.log("API Query:", query); // Debug query string trước khi gọi API

        const res = await filterBookWithFullInfoAPI(query);
        setTotal(res.data!.meta.totalItems)

        setListBook(res.data?.items || []);
    };


    const handleCancel = () => {
        form.resetFields();
        setSelectedBrands([]);
        setSelectedSuppliers([]);
        setIsModalOpen(false);
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    const setPriceRange = (min: number, max: number) => {
        form.setFieldsValue({ minPrice: min, maxPrice: max });
    };

    const onChangeCheckBox = (type: "brand" | "supplier" | "category", name: string) => {
        if (type === "brand") {
            setSelectedBrands(prev => {
                const updatedBrands = prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name];
                setBrand(updatedBrands.join(",")); // Cập nhật giá trị chuỗi
                return updatedBrands;
            });
        } else if (type === "supplier") {
            setSelectedSuppliers(prev => {
                const updatedSuppliers = prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name];
                setSupplier(updatedSuppliers.join(",")); // Cập nhật giá trị chuỗi
                return updatedSuppliers;
            });
        } else if (type === "category") {
            setSelectedCategories(prev => {
                const updatedCategories = prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name];
                setCategory(updatedCategories.join(",")); // Cập nhật category filter
                return updatedCategories;
            });
        }
    };


    return (
        <Modal bodyStyle={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }} title="Tất cả bộ lọc" open={isModalOpen} onOk={async () => {
            try {
                const values = await form.validateFields(); // Lấy giá trị form
                handleOk(values); // Truyền values vào handleOk
            } catch (error) {
                console.error("Validation failed:", error);
            }
        }} onCancel={handleCancel}>
            <Divider />
            <div style={{ marginBottom: '10px' }}>
                <h3>Giá</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Button style={{ border: '0.5px solid #666' }} type="text" onClick={() => setPriceRange(0, 60000)}>Dưới 60.000</Button>
                    <Button style={{ border: '0.5px solid #666' }} type="text" onClick={() => setPriceRange(60000, 140000)}>60.000 - 140.000</Button>
                    <Button style={{ border: '0.5px solid #666' }} type="text" onClick={() => setPriceRange(140000, 280000)}>140.000 - 280.000</Button>
                    <Button style={{ border: '0.5px solid #666' }} type="text" onClick={() => setPriceRange(280000, 10000000)}>Trên 280.000</Button>
                </div>
                <Form form={form} name="control-hooks" onFinish={handleOk} style={{ maxWidth: 600 }}>
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>Tự nhập khoảng giá</div>
                    <Row gutter={16} align="middle">
                        <Col span={10}>
                            <Form.Item name="minPrice">
                                <InputNumber placeholder="Từ" addonAfter="₫" controls style={{ width: "100%" }}
                                    formatter={value => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                                    parser={value => value?.replace(/\./g, "") || ""} />
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: "center", paddingBottom: '30px' }}>
                            <span>-</span>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="maxPrice">
                                <InputNumber placeholder="Đến" addonAfter="₫" controls style={{ width: "100%" }}
                                    formatter={value => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                                    parser={value => value?.replace(/\./g, "") || ""} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider />
            <h3>Thể loại</h3>
            <Row gutter={[16, 8]}>
                {(showFullBrandList ? listFullCategory : listFullCategory.slice(0, 4)).map((items, index) => (
                    <Col key={index} span={12}>
                        <Checkbox onChange={() => onChangeCheckBox("category", items.name)} checked={selectedCategories.includes(items.name)}>
                            {items.name}
                        </Checkbox>
                    </Col>
                ))}
            </Row>
            {listBrand.length > 5 && (
                <p onClick={() => setShowFullBrandList(!showFullBrandList)} style={{ color: "black", textDecoration: "underline", cursor: "pointer", marginTop: 10, marginBottom: 10 }}>
                    {showFullBrandList ? "Thu gọn" : "Xem thêm"}
                </p>
            )}
            <Divider />

            <h3>Thương hiệu</h3>
            <Row gutter={[16, 8]}>
                {(showFullBrandList ? listBrand : listBrand.slice(0, 5)).map((items, index) => (
                    <Col key={index} span={12}>
                        <Checkbox onChange={() => onChangeCheckBox("brand", items.name)} checked={selectedBrands.includes(items.name)}>{items.name}</Checkbox>
                    </Col>
                ))}
            </Row>
            {listBrand.length > 5 && (
                <p onClick={() => setShowFullBrandList(!showFullBrandList)} style={{ color: "black", textDecoration: "underline", cursor: "pointer", marginTop: 10, marginBottom: 10 }}>
                    {showFullBrandList ? "Thu gọn" : "Xem thêm"}
                </p>
            )}
            <Divider />
            <h3>Nhà cung cấp</h3>
            <Row gutter={[16, 8]}>
                {(showFullSupplierList ? listSupplier : listSupplier.slice(0, 5)).map((items, index) => (
                    <Col key={index} span={12}>
                        <Checkbox onChange={() => onChangeCheckBox("supplier", items.name)} checked={selectedSuppliers.includes(items.name)}>{items.name}</Checkbox>
                    </Col>
                ))}
            </Row>
            {listSupplier.length > 5 && (
                <p onClick={() => setShowFullSupplierList(!showFullSupplierList)} style={{ color: "black", textDecoration: "underline", cursor: "pointer", marginTop: 10, marginBottom: 10 }}>
                    {showFullSupplierList ? "Thu gọn" : "Xem thêm"}
                </p>
            )}
            <Divider />
        </Modal>
    );
};

export default FilterProduct;
