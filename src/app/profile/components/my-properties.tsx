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
import { MyPropertiesProps, PartnerProperty } from '@/types/profile';
import { ApartmentStatus } from '@/types/apartment';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const { Search } = Input;
const { Option } = Select;

export default function MyPropertiesComponent({ properties = [], loading = false }: MyPropertiesProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApartmentStatus | 'all'>('all');
    const t = useTranslations('Profile.properties');

    const getStatusColor = (status: ApartmentStatus) => {
        const colors: Record<ApartmentStatus, string> = {
            [ApartmentStatus.AVAILABLE]: 'green',
            [ApartmentStatus.OCCUPIED]: 'blue',
            [ApartmentStatus.MAINTENANCE]: 'orange',
            [ApartmentStatus.RESERVED]: 'purple',
            [ApartmentStatus.INACTIVE]: 'default',
        };
        return colors[status];
    };

    const getStatusIcon = (status: ApartmentStatus) => {
        const icons: Record<ApartmentStatus, React.ReactNode> = {
            [ApartmentStatus.AVAILABLE]: <CheckCircleOutlined />,
            [ApartmentStatus.OCCUPIED]: <UserOutlined />,
            [ApartmentStatus.MAINTENANCE]: <ToolOutlined />,
            [ApartmentStatus.RESERVED]: <AppstoreOutlined />,
            [ApartmentStatus.INACTIVE]: <StopOutlined />,
        };
        return icons[status];
    };

    const stats = useMemo(() => ({
        total: properties.length,
        available: properties.filter((p) => p.status === ApartmentStatus.AVAILABLE).length,
        occupied: properties.filter((p) => p.status === ApartmentStatus.OCCUPIED).length,
        maintenance: properties.filter((p) => p.status === ApartmentStatus.MAINTENANCE).length,
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
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Add property')}>
                    {t('addProperty')}
                </Button>
            </div>

            {/* Stats row */}
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
                            valueStyle={{ color: '#16a34a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center bg-blue-50 border-blue-200">
                        <Statistic
                            title={t('stats.occupied')}
                            value={stats.occupied}
                            valueStyle={{ color: '#2563eb' }}
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
                            valueStyle={{ color: '#7c3aed' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <Search
                    placeholder={t('searchPlaceholder')}
                    allowClear
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-72"
                />
                <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-40"
                >
                    <Option value="all">{t('allStatuses')}</Option>
                    {Object.values(ApartmentStatus).map((s) => (
                        <Option key={s} value={s}>
                            {t(`status.${s}`)}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Property grid */}
            {filtered.length === 0 ? (
                <Empty description={properties.length === 0 ? t('noProperties') : t('noResults')} className="py-12" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filtered.map((property) => (
                        <Col key={property.id} xs={24} sm={12} lg={8}>
                            <PropertyCard
                                property={property}
                                getStatusColor={getStatusColor}
                                getStatusIcon={getStatusIcon}
                                t={t}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

function PropertyCard({
    property,
    getStatusColor,
    getStatusIcon,
    t,
}: {
    property: PartnerProperty;
    getStatusColor: (s: ApartmentStatus) => string;
    getStatusIcon: (s: ApartmentStatus) => React.ReactNode;
    t: (key: string) => string;
}) {
    const coverImage =
        property.images && property.images.length > 0
            ? property.images[0]
            : null;

    return (
        <Card
            className="h-full hover:shadow-md transition-shadow duration-200"
            cover={
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={`${property.buildingName} ${property.apartmentNumber}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <HomeOutlined className="text-4xl text-gray-300" />
                        </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                        <Tag
                            color={getStatusColor(property.status)}
                            icon={getStatusIcon(property.status)}
                            className="font-medium"
                        >
                            {t(`status.${property.status}`)}
                        </Tag>
                    </div>
                    {/* Image count badge */}
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
            {/* Building + Unit */}
            <div className="mb-2">
                <p className="text-base font-bold leading-tight truncate">{property.buildingName}</p>
                <p className="text-sm text-gray-500 font-medium">Unit {property.apartmentNumber}</p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1 mb-3">
                <EnvironmentOutlined className="text-gray-400 mt-0.5 shrink-0 text-sm" />
                <p className="text-sm text-muted line-clamp-2">
                    {property.address}, {property.district}, {property.city}
                </p>
            </div>

            {/* Key specs */}
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span>{property.numberOfBedrooms} {t('beds')}</span>
                <span className="text-gray-300">|</span>
                <span>{property.numberOfBathrooms} {t('baths')}</span>
                <span className="text-gray-300">|</span>
                <span>{property.totalArea} m²</span>
            </div>

            {/* Rent + tenant */}
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

            {/* Contract end date */}
            {property.contractEndDate && (
                <div className="mt-2 text-xs text-muted">
                    {t('contractEnds')}: {new Date(property.contractEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            )}
        </Card>
    );
}
