'use client';

import { Card, Tag, Button, Empty, Row, Col, Statistic, Input, Select, Badge } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    EyeOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    UserOutlined,
    DollarOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    ToolOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { PartnerProperty } from '@/types/profile';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const { Search } = Input;

export default function MyPropertiesPage() {
    // TODO: Fetch partner properties from API
    const mockProperties: PartnerProperty[] = [
        {
            id: 'prop-001',
            buildingName: 'Sunrise Tower',
            apartmentNumber: 'A-305',
            address: '123 Main Street',
            city: 'Ho Chi Minh City',
            district: 'District 1',
            totalArea: '75',
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            status: 'occupied',
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            ],
            baseRentPrice: 1200,
            currentTenant: {
                id: 'user-001',
                name: 'Nguyen Van A',
                email: 'nguyenvana@email.com',
                phone: '+84 901 234 567',
            },
            contractEndDate: '2026-12-31',
            monthlyRevenue: 1200,
        },
        {
            id: 'prop-002',
            buildingName: 'Green Valley Residences',
            apartmentNumber: 'B-102',
            address: '456 Le Loi Boulevard',
            city: 'Ho Chi Minh City',
            district: 'District 3',
            totalArea: '55',
            numberOfBedrooms: 1,
            numberOfBathrooms: 1,
            status: 'available',
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            ],
            baseRentPrice: 800,
            monthlyRevenue: 0,
        },
        {
            id: 'prop-003',
            buildingName: 'The Metropolitan',
            apartmentNumber: 'C-501',
            address: '789 Nguyen Hue Street',
            city: 'Ho Chi Minh City',
            district: 'District 1',
            totalArea: '110',
            numberOfBedrooms: 3,
            numberOfBathrooms: 2,
            status: 'occupied',
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            ],
            baseRentPrice: 2000,
            currentTenant: {
                id: 'user-002',
                name: 'Tran Thi B',
                email: 'tranthib@email.com',
                phone: '+84 902 345 678',
            },
            contractEndDate: '2026-06-30',
            monthlyRevenue: 2000,
        },
        {
            id: 'prop-004',
            buildingName: 'Harbor View',
            apartmentNumber: 'D-210',
            address: '321 Vo Thi Sau',
            city: 'Ho Chi Minh City',
            district: 'District 3',
            totalArea: '68',
            numberOfBedrooms: 2,
            numberOfBathrooms: 1,
            status: 'maintenance',
            images: null,
            baseRentPrice: 950,
            monthlyRevenue: 0,
        },
        {
            id: 'prop-005',
            buildingName: 'Sunrise Tower',
            apartmentNumber: 'A-408',
            address: '123 Main Street',
            city: 'Ho Chi Minh City',
            district: 'District 1',
            totalArea: '80',
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            status: 'reserved',
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            ],
            baseRentPrice: 1300,
            monthlyRevenue: 0,
        },
    ];
    const properties = mockProperties;
    const loading = false;
    const [search, setSearch] = useState('');
    type ApartmentStatusValue = PartnerProperty['status'];
    const statusValues: ApartmentStatusValue[] = ['available', 'occupied', 'maintenance', 'reserved', 'inactive'] as ApartmentStatusValue[];
    const [statusFilter, setStatusFilter] = useState<ApartmentStatusValue | 'all'>('all');
    const t = useTranslations('Profile.properties');

    const getStatusColor = (status: ApartmentStatusValue) => {
        const colors: Record<ApartmentStatusValue, string> = {
            available: 'green',
            occupied: 'blue',
            maintenance: 'orange',
            reserved: 'purple',
            inactive: 'default',
        };
        return colors[status];
    };

    const getStatusIcon = (status: ApartmentStatusValue) => {
        const icons: Record<ApartmentStatusValue, React.ReactNode> = {
            available: <CheckCircleOutlined />,
            occupied: <UserOutlined />,
            maintenance: <ToolOutlined />,
            reserved: <AppstoreOutlined />,
            inactive: <StopOutlined />,
        };
        return icons[status];
    };

    const stats = useMemo(() => ({
        total: properties.length,
        available: properties.filter((p) => p.status === 'available').length,
        occupied: properties.filter((p) => p.status === 'occupied').length,
        maintenance: properties.filter((p) => p.status === 'maintenance').length,
        totalRevenue: properties
            .filter((p) => p.monthlyRevenue)
            .reduce((s, p) => s + (p.monthlyRevenue ?? 0), 0),
    }), [properties]);

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            const matchSearch =
                search === '' ||
                p.buildingName.toLowerCase().includes(search.toLowerCase()) ||
                p.apartmentNumber.toLowerCase().includes(search.toLowerCase()) ||
                p.address.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [properties, search, statusFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Add property')}>
                    {t('addProperty')}
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                    <Card className="text-center">
                        <Statistic
                            title={t('stats.total')}
                            value={stats.total}
                            prefix={<HomeOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center bg-green-50 border-green-200">
                        <Statistic
                            title={t('stats.available')}
                            value={stats.available}
                            styles={{ content: { color: '#16a34a' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center bg-blue-50 border-blue-200">
                        <Statistic
                            title={t('stats.occupied')}
                            value={stats.occupied}
                            styles={{ content: { color: '#2563eb' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center bg-purple-50 border-purple-200">
                        <Statistic
                            title={t('stats.monthlyRevenue')}
                            value={stats.totalRevenue}
                            prefix={<DollarOutlined />}
                            precision={0}
                            styles={{ content: { color: '#7c3aed' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="flex flex-wrap gap-3 items-center">
                <Search
                    placeholder={t('searchPlaceholder')}
                    allowClear
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-72"
                />
                <Select<ApartmentStatusValue | 'all'>
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-40"
                    options={[
                        { value: 'all', label: t('allStatuses') },
                        ...statusValues.map((s) => ({
                            value: s,
                            label: t(`status.${s}`),
                        })),
                    ]}
                />
            </div>

            {filtered.length === 0 ? (
                <Empty description={properties.length === 0 ? t('noProperties') : t('noResults')} className="py-12" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filtered.map((property) => (
                        <Col key={property.id} xs={24} sm={12} lg={8}>
                            <Card
                                className="h-full hover:shadow-md transition-shadow duration-200"
                                cover={
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        {property.images && property.images.length > 0 ? (
                                            <Image
                                                src={property.images[0]}
                                                alt={`${property.buildingName} ${property.apartmentNumber}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <HomeOutlined className="text-4xl text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Tag
                                                color={getStatusColor(property.status)}
                                                icon={getStatusIcon(property.status)}
                                                className="font-medium"
                                            >
                                                {t(`status.${property.status}`)}
                                            </Tag>
                                        </div>
                                        {property.images && property.images.length > 1 && (
                                            <div className="absolute bottom-3 right-3">
                                                <Badge
                                                    count={`+${property.images.length - 1}`}
                                                    color="rgba(0,0,0,0.5)"
                                                />
                                            </div>
                                        )}
                                    </div>
                                }
                                actions={[
                                    <Button
                                        key="view"
                                        type="link"
                                        icon={<EyeOutlined />}
                                        onClick={() => console.log('View property', property.id)}
                                    >
                                        {t('view')}
                                    </Button>,
                                    <Button
                                        key="edit"
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => console.log('Edit property', property.id)}
                                    >
                                        {t('edit')}
                                    </Button>,
                                ]}
                            >
                                <div className="mb-2">
                                    <p className="text-base font-bold leading-tight truncate">{property.buildingName}</p>
                                    <p className="text-sm text-gray-500 font-medium">Unit {property.apartmentNumber}</p>
                                </div>

                                <div className="flex items-start gap-1 mb-3">
                                    <EnvironmentOutlined className="text-gray-400 mt-0.5 shrink-0 text-sm" />
                                    <p className="text-sm text-muted line-clamp-2">
                                        {property.address}, {property.district}, {property.city}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                    <span>{property.numberOfBedrooms} {t('beds')}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{property.numberOfBathrooms} {t('baths')}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{property.totalArea} m²</span>
                                </div>

                                <div className="flex items-center justify-between border-t pt-3">
                                    <span className="text-blue-600 font-bold text-base">
                                        ${property.baseRentPrice.toLocaleString()}<span className="text-xs font-normal text-muted">/mo</span>
                                    </span>
                                    {property.currentTenant ? (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <UserOutlined className="text-xs" />
                                            <span className="truncate max-w-24" title={property.currentTenant.name}>
                                                {property.currentTenant.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-green-600 font-medium">{t('vacant')}</span>
                                    )}
                                </div>

                                {property.contractEndDate && (
                                    <div className="mt-2 text-xs text-muted">
                                        {t('contractEnds')}: {new Date(property.contractEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
