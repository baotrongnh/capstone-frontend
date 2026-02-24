'use client';

import { Card, Descriptions, Tag, Statistic, Row, Col, Empty, Divider } from 'antd';
import {
    HomeOutlined,
    ThunderboltOutlined,
    FireOutlined,
    DollarOutlined,
    CalendarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { MyApartmentProps } from '@/types/profile';
import { ApartmentStatus } from '@/types/apartment';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function MyApartment({ apartment, loading = false }: MyApartmentProps) {
    const t = useTranslations('Profile.apartment');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        );
    }

    if (!apartment) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">
                        {t('subtitle')}
                    </p>
                </div>
                <Empty
                    description={t('noApartment')}
                    className="py-12"
                />
            </div>
        );
    }

    const getStatusColor = (status: ApartmentStatus) => {
        const colors = {
            available: 'green',
            rented: 'blue',
            maintenance: 'orange',
            unavailable: 'red'
        };
        return colors[status];
    };

    const getStatusText = (status: ApartmentStatus) => {
        return t(`status.${status}`);
    };

    const electricityUsage = apartment.currentElectricReading - apartment.previousElectricReading;
    const waterUsage = apartment.currentWaterReading - apartment.previousWaterReading;
    const electricityCost = electricityUsage * apartment.electricityUnitPrice;
    const waterCost = waterUsage * apartment.waterUnitPrice;
    const totalUtilityCost = electricityCost + waterCost;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">
                    {t('subtitle')}
                </p>
            </div>

            {/* Apartment Images */}
            {apartment.images && apartment.images.length > 0 && (
                <Card className="overflow-hidden" styles={{ body: { padding: 0 } }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                        {apartment.images.slice(0, 3).map((image, index) => (
                            <div key={index} className="relative h-64 bg-gray-100">
                                <Image
                                    src={image}
                                    alt={`${apartment.buildingName} - Image ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Apartment Information */}
            <Card title={<span className="flex items-center gap-2"><HomeOutlined /> {t('apartmentInfo')}</span>}>
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 3, lg: 3 }} size="middle">
                    <Descriptions.Item label={t('buildingName')} span={1}>{apartment.buildingName}</Descriptions.Item>
                    <Descriptions.Item label={t('apartmentNumber')} span={1}>
                        <span className="font-semibold">{apartment.apartmentNumber}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('statusLabel')} span={1}>
                        <Tag color={getStatusColor(apartment.status)}>{getStatusText(apartment.status)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('address')} span={3}>
                        <div className="flex items-start gap-2">
                            <EnvironmentOutlined className="text-muted mt-1" />
                            <span>{apartment.address}, {apartment.district}, {apartment.city}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('totalArea')} span={1}>{apartment.totalArea} m²</Descriptions.Item>
                    <Descriptions.Item label={t('bedrooms')} span={1}>{apartment.numberOfBedrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('bathrooms')} span={1}>{apartment.numberOfBathrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('rentPrice')} span={3}>
                        <span className="text-lg font-semibold text-blue-600">
                            ${apartment.baseRentPrice.toLocaleString()}{t('perMonth')}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Contract Information */}
            {apartment.contract && (
                <Card title={<span className="flex items-center gap-2"><CalendarOutlined /> {t('contractInfo')}</span>}>
                    <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                        <Descriptions.Item label={t('startDate')}>
                            {new Date(apartment.contract.startDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('endDate')}>
                            {new Date(apartment.contract.endDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('monthlyRent')}>
                            ${apartment.contract.monthlyRent.toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('depositAmount')}>
                            ${apartment.contract.depositAmount.toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('contractStatus')}>
                            <Tag color={apartment.contract.status === 'active' ? 'green' : 'red'}>
                                {apartment.contract.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}

            {/* Utility Usage */}
            <Card
                title={<span className="flex items-center gap-2"><ThunderboltOutlined /> {t('utilityUsage')}</span>}
                extra={<span className="text-sm text-muted">{t('currentBillingPeriod')}</span>}
            >
                <Row gutter={[16, 16]}>
                    {/* Electricity */}
                    <Col xs={24} sm={12}>
                        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                    <ThunderboltOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t('electricity')}</h3>
                                    <p className="text-sm text-muted">kWh</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('previousReading')}</span>
                                    <span className="font-medium">{apartment.previousElectricReading} kWh</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('currentReading')}</span>
                                    <span className="font-medium">{apartment.currentElectricReading} kWh</span>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('usage')}</span>
                                    <span className="font-bold text-orange-600">{electricityUsage} kWh</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('unitPrice')}</span>
                                    <span className="font-medium">${apartment.electricityUnitPrice}/kWh</span>
                                </div>
                                <div className="flex justify-between items-center bg-orange-100 p-3 rounded-lg mt-3">
                                    <span className="font-semibold">{t('totalCost')}</span>
                                    <span className="font-bold text-xl text-orange-600">
                                        ${electricityCost.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Water */}
                    <Col xs={24} sm={12}>
                        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FireOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t('water')}</h3>
                                    <p className="text-sm text-muted">m³</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('previousReading')}</span>
                                    <span className="font-medium">{apartment.previousWaterReading} m³</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('currentReading')}</span>
                                    <span className="font-medium">{apartment.currentWaterReading} m³</span>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('usage')}</span>
                                    <span className="font-bold text-blue-600">{waterUsage} m³</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">{t('unitPrice')}</span>
                                    <span className="font-medium">${apartment.waterUnitPrice}/m³</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-100 p-3 rounded-lg mt-3">
                                    <span className="font-semibold">{t('totalCost')}</span>
                                    <span className="font-bold text-xl text-blue-600">
                                        ${waterCost.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Total Summary */}
                <Card className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <Row gutter={16} align="middle">
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={t('totalUtilityCost')}
                                value={totalUtilityCost}
                                precision={2}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#7c3aed', fontWeight: 'bold' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={t('monthlyRent')}
                                value={apartment.baseRentPrice}
                                precision={2}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#059669' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={t('thisMonth')}
                                value={apartment.baseRentPrice + totalUtilityCost}
                                precision={2}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.5rem' }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Card>
        </div>
    );
}
