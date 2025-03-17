import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Radio, Button, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;

// Hardcoded location data
const locationData = {
    provinces: [
        { id: 1, name: 'Hà Nội' },
        { id: 2, name: 'Hồ Chí Minh' },
        { id: 3, name: 'Đà Nẵng' },
    ],
    districts: [
        { id: 1, provinceId: 1, name: 'Hoàn Kiếm' },
        { id: 2, provinceId: 1, name: 'Ba Đình' },
        { id: 3, provinceId: 1, name: 'Đống Đa' },
        { id: 4, provinceId: 1, name: 'Cầu Giấy' },
        { id: 5, provinceId: 2, name: 'Quận 1' },
        { id: 6, provinceId: 2, name: 'Quận 2' },
        { id: 7, provinceId: 2, name: 'Quận 3' },
        { id: 8, provinceId: 3, name: 'Hải Châu' },
        { id: 9, provinceId: 3, name: 'Thanh Khê' },
    ],
    wards: [
        { id: 1, districtId: 1, name: 'Hàng Trống' },
        { id: 2, districtId: 1, name: 'Hàng Bông' },
        { id: 3, districtId: 1, name: 'Hàng Bạc' },
        { id: 4, districtId: 2, name: 'Phúc Xá' },
        { id: 5, districtId: 2, name: 'Trúc Bạch' },
        { id: 6, districtId: 3, name: 'Cát Linh' },
        { id: 7, districtId: 3, name: 'Văn Miếu' },
        { id: 8, districtId: 4, name: 'Dịch Vọng' },
        { id: 9, districtId: 4, name: 'Mai Dịch' },
        { id: 10, districtId: 5, name: 'Bến Nghé' },
        { id: 11, districtId: 5, name: 'Cầu Kho' },
        { id: 12, districtId: 6, name: 'Thảo Điền' },
        { id: 13, districtId: 6, name: 'An Phú' },
        { id: 14, districtId: 7, name: 'Phường 1' },
        { id: 15, districtId: 7, name: 'Phường 2' },
        { id: 16, districtId: 8, name: 'Hòa Thuận Đông' },
        { id: 17, districtId: 8, name: 'Hòa Thuận Tây' },
        { id: 18, districtId: 9, name: 'Tam Thuận' },
        { id: 19, districtId: 9, name: 'Xuân Hà' },
    ]
};
interface IProps {
    onSubmitLocation: (location: any) => void
    isOpen: boolean
    onClose: () => void


}
const LocationSelectorModal = (props: IProps) => {
    // Selection states

    const { isOpen, onClose, onSubmitLocation } = props
    const [selectionMode, setSelectionMode] = useState('default'); // 'default' or 'custom'
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedWard, setSelectedWard] = useState<number | null>(null);

    // Default location (hardcoded)
    const defaultLocation = {
        province: 'Hà Nội',
        district: 'Hoàn Kiếm',
        ward: 'Hàng Trống'
    };

    // Filtered lists based on selections
    const [availableDistricts, setAvailableDistricts] = useState<
        { id: number; provinceId: number; name: string }[]
    >([]);
    const [availableWards, setAvailableWards] = useState<
        { id: number; districtId: number; name: string }[]
    >([]);


    // Update available districts when province changes
    useEffect(() => {
        if (selectedProvince) {
            const filtered = locationData.districts.filter(
                district => district.provinceId === selectedProvince
            );
            setAvailableDistricts(filtered);
            setSelectedDistrict(null);
            setSelectedWard(null);
            setAvailableWards([]);
        }
    }, [selectedProvince]);

    // Update available wards when district changes
    useEffect(() => {
        if (selectedDistrict) {
            const filtered = locationData.wards.filter(
                ward => ward.districtId === selectedDistrict
            );
            setAvailableWards(filtered);
            setSelectedWard(null);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = (value: any) => {
        const provinceId = parseInt(value);
        setSelectedProvince(provinceId);
    };

    const handleDistrictChange = (value: any) => {
        const districtId = parseInt(value);
        setSelectedDistrict(districtId);
    };

    const handleWardChange = (value: any) => {
        const wardId = parseInt(value);
        setSelectedWard(wardId);
    };

    const handleSubmit = () => {
        let locationText = '';

        if (selectionMode === 'default') {
            locationText = `${defaultLocation.ward}, ${defaultLocation.district}, ${defaultLocation.province}`;
        } else {
            const province = locationData.provinces.find(p => p.id === selectedProvince)?.name || '';
            const district = locationData.districts.find(d => d.id === selectedDistrict)?.name || '';
            const ward = locationData.wards.find(w => w.id === selectedWard)?.name || '';
            locationText = `${ward}, ${district}, ${province}`;
        }

        onSubmitLocation(locationText);
        onClose();
    };

    const isSubmitEnabled = () => {
        if (selectionMode === 'default') return true;
        return selectedProvince && selectedDistrict && selectedWard;
    };

    return (
        <Modal
            title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Địa chỉ giao hàng</div>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
        >
            <div style={{ marginBottom: 16 }}>
                <p>Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đồng gói, vận chuyển một cách chính xác nhất.</p>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Button type="primary" style={{ width: '80%', backgroundColor: '#ffd60a', color: '#000', border: 'none' }}>
                    Đăng nhập để chọn địa chỉ giao hàng
                </Button>
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <span>hoặc</span>
            </div>

            <Radio.Group
                onChange={(e) => setSelectionMode(e.target.value)}
                value={selectionMode}
                style={{ width: '100%' }}
            >
                <div style={{ margin: '8px 0', padding: '8px', border: selectionMode === 'default' ? '1px solid #40a9ff' : '1px solid #d9d9d9', borderRadius: '4px' }}>
                    <Radio value="default" style={{ width: '100%' }}>
                        {defaultLocation.ward}, Quận {defaultLocation.district}, {defaultLocation.province}
                    </Radio>
                </div>

                <div style={{ margin: '8px 0', padding: '8px', border: selectionMode === 'custom' ? '1px solid #40a9ff' : '1px solid #d9d9d9', borderRadius: '4px' }}>
                    <Radio value="custom" style={{ width: '100%', marginBottom: 16 }}>
                        Chọn khu vực giao hàng khác
                    </Radio>

                    {selectionMode === 'custom' && (
                        <div style={{ paddingLeft: 24 }}>
                            <Row gutter={[0, 16]}>
                                <Col span={8}>
                                    <div>Tỉnh/Thành phố</div>
                                </Col>
                                <Col span={16}>
                                    <Select
                                        placeholder="Vui lòng chọn tỉnh/thành phố"
                                        style={{ width: '100%' }}
                                        onChange={handleProvinceChange}
                                        suffixIcon={<DownOutlined />}
                                    >
                                        {locationData.provinces.map(province => (
                                            <Option key={province.id} value={province.id}>{province.name}</Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>

                            <Row gutter={[0, 16]}>
                                <Col span={8}>
                                    <div>Quận/Huyện</div>
                                </Col>
                                <Col span={16}>
                                    <Select
                                        placeholder="Vui lòng chọn quận/huyện"
                                        style={{ width: '100%' }}
                                        onChange={handleDistrictChange}
                                        disabled={!selectedProvince}
                                        suffixIcon={<DownOutlined />}
                                    >
                                        {availableDistricts.map(district => (
                                            <Option key={district.id} value={district.id}>{district.name}</Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>

                            <Row gutter={[0, 16]}>
                                <Col span={8}>
                                    <div>Phường/Xã</div>
                                </Col>
                                <Col span={16}>
                                    <Select
                                        placeholder="Vui lòng chọn phường/xã"
                                        style={{ width: '100%' }}
                                        onChange={handleWardChange}
                                        disabled={!selectedDistrict}
                                        suffixIcon={<DownOutlined />}
                                    >
                                        {availableWards.map(ward => (
                                            <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            </Radio.Group>

            <div style={{ marginTop: 20 }}>
                <Button
                    type="primary"
                    block
                    style={{
                        backgroundColor: isSubmitEnabled() ? '#ff4d4f' : '#f5f5f5',
                        borderColor: isSubmitEnabled() ? '#ff4d4f' : '#d9d9d9',
                        color: isSubmitEnabled() ? '#fff' : '#bfbfbf'
                    }}
                    disabled={!isSubmitEnabled()}
                    onClick={handleSubmit}
                >
                    GIAO ĐẾN ĐỊA CHỈ NÀY
                </Button>
            </div>
        </Modal>
    );
};

export default LocationSelectorModal;