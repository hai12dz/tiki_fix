import React, { useState } from 'react';
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row } from 'antd';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void;
    queryFiler: string
    setQueryFilter: (v: string) => void
    category: string
    setCategory: (v: string) => void
    listBrand: IBrands[]
    listSupplier: ISupplier[]

}
const FilterProduct = (props: IProps) => {

    const { isModalOpen, setIsModalOpen, category, listBrand, listSupplier } = props
    const [brand, setBrand] = useState<string>("")
    const [supplier, setSupplier] = useState<string>("")
    const [showFullList, setShowFullList] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    };

    const onChangeCheckBox = () => {





    }
    return (

        <>

            <Modal bodyStyle={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }} title="Tất cả bộ lọc" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Divider />

                <div style={{ marginBottom: '10px' }}>
                    <div><h3>Giá</h3></div>
                    <div style={{ display: 'flex', flexFlow: 'wrap row', gap: '10px' }}>
                        <Button style={{ border: '0.5px solid #666' }} type='text'>Dưới 60.000</Button>
                        <Button style={{ border: '0.5px solid #666' }} type='text'>60.000 -&gt;140.000</Button>
                        <Button style={{ border: '0.5px solid #666' }} type='text'>140.000 -&gt;280.000</Button>
                        <Button style={{ border: '0.5px solid #666' }} type='text'>Trên 280.000</Button>



                    </div>
                </div>

                <Divider />
                {/* Thương hiệu */}
                <div>
                    <h3>Thương hiệu</h3>
                    <Row gutter={[16, 8]}>
                        {(showFullList ? listBrand : listBrand.slice(0, 5)).map((items, index) => (
                            <Col key={index} span={12}>
                                <Checkbox onChange={onChangeCheckBox}>{items.name}</Checkbox>
                            </Col>
                        ))}
                    </Row>

                    {/* Nút Xem thêm / Thu gọn */}
                    {listBrand.length > 5 && (
                        <p
                            onClick={() => setShowFullList(!showFullList)}
                            style={{ color: "black", textDecoration: "underline", cursor: "pointer", marginTop: 10, marginBottom: 10 }}
                        >
                            {showFullList ? "Thu gọn" : "Xem thêm"}
                        </p>
                    )}
                </div>
                <Divider />
                <div>
                    <h3>Nhà cung cấp</h3>
                    <Row gutter={[16, 8]}>
                        {(showFullList ? listSupplier : listSupplier.slice(0, 5)).map((items, index) => (
                            <Col key={index} span={12}>
                                <Checkbox onChange={onChangeCheckBox}>{items.name}</Checkbox>
                            </Col>
                        ))}
                    </Row>

                    {/* Nút Xem thêm / Thu gọn */}
                    {listSupplier.length > 5 && (
                        <p
                            onClick={() => setShowFullList(!showFullList)}
                            style={{ color: "black", textDecoration: "underline", cursor: "pointer", marginTop: 10, marginBottom: 10 }}
                        >
                            {showFullList ? "Thu gọn" : "Xem thêm"}
                        </p>
                    )}
                </div>
                <Divider />
                <div>

                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                    >
                        <Row gutter={16} align="middle">
                            <Col span={10}>
                                <Form.Item name="minPrice" rules={[{ required: true }]}>
                                    <InputNumber
                                        placeholder="Từ"
                                        addonAfter="₫"
                                        controls
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            {/* Dấu gạch ngang "-" giữa hai input */}
                            <Col span={4} style={{ textAlign: "center", paddingBottom: '30px' }}>
                                <span>-</span>
                            </Col>

                            <Col span={10}>
                                <Form.Item name="maxPrice" rules={[{ required: true }]}>
                                    <InputNumber
                                        placeholder="Đến"
                                        addonAfter="₫"
                                        controls
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>



                    </Form>
                </div>




            </Modal>
        </>
    );
};

export default FilterProduct;