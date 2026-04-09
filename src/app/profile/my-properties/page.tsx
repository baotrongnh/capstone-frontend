'use client'

import { usePartnerProperties } from '@/hooks/query/usePartnerProperties'
import { useAuthStore } from '@/stores/auth.store'
import { PartnerPropertyListItem } from '@/types/partnerProperties'
import { formatPaymentAmount } from '@/utils/payment'
import {
    type PartnerPropertyStatusFilter,
    PARTNER_PROPERTY_STATUS_COLORS,
    buildPartnerPropertiesStats,
    filterPartnerProperties,
    toPartnerPropertyAddress,
    toPartnerPropertyStatus,
} from '@/utils/partnerProperties'
import { toDisplayText } from '@/utils/format'
import { getApartmentCoverImage, toSafeNumber, toUserApartmentStatusLabel } from '@/utils/userApartment'
import {
    CheckCircleOutlined,
    EllipsisOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    HomeOutlined,
    SearchOutlined,
    ToolOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Empty, Input, Row, Select, Statistic, Tag, Tooltip } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

const { Search } = Input
const MAX_VISIBLE_AMENITIES = 4

type AmenityListItem = NonNullable<PartnerPropertyListItem['amenities']>[number]

const getAmenityNames = (property: PartnerPropertyListItem) => {
    return (property.amenities ?? [])
        .map((amenity: AmenityListItem) => toDisplayText(amenity.name ?? amenity.code))
        .filter((name) => name !== '-')
}

export default function MyPropertiesPage() {
    const t = useTranslations('Profile.properties')
    const locale = useLocale()
    const router = useRouter()

    const user = useAuthStore((state) => state.user)
    const ownerId = typeof user?.id === 'string' ? user.id : ''

    const { data, isLoading } = usePartnerProperties(ownerId)

    const properties = useMemo(() => data?.data ?? [], [data?.data])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<PartnerPropertyStatusFilter>('all')

    const statusOptions = useMemo(() => {
        const uniqueStatuses = Array.from(new Set(properties.map((item) => toPartnerPropertyStatus(item.status))))

        return [
            { value: 'all' as const, label: t('allStatuses') },
            ...uniqueStatuses.map((status) => ({
                value: status,
                label: toUserApartmentStatusLabel(status, t),
            })),
        ]
    }, [properties, t])

    const stats = useMemo(() => buildPartnerPropertiesStats(properties), [properties])

    const filtered = useMemo(
        () => filterPartnerProperties(properties, search, statusFilter),
        [properties, search, statusFilter],
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                    <Card className="text-center">
                        <Statistic title={t('stats.total')} value={stats.total} prefix={<HomeOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center border-emerald-200 bg-emerald-50">
                        <Statistic
                            title={t('stats.available')}
                            value={stats.available}
                            prefix={<CheckCircleOutlined />}
                            styles={{ content: { color: '#059669' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center border-blue-200 bg-blue-50">
                        <Statistic
                            title={t('stats.occupied')}
                            value={stats.occupied}
                            prefix={<UserOutlined />}
                            styles={{ content: { color: '#2563eb' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center border-amber-200 bg-amber-50">
                        <Statistic
                            title={t('stats.maintenance')}
                            value={stats.maintenance}
                            prefix={<ToolOutlined />}
                            styles={{ content: { color: '#d97706' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="flex flex-wrap items-center gap-3">
                <Search
                    placeholder={t('searchPlaceholder')}
                    allowClear
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-72"
                />
                <Select<PartnerPropertyStatusFilter>
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    className="w-52"
                    options={statusOptions}
                />
            </div>

            {filtered.length === 0 ? (
                <Empty
                    description={properties.length === 0 ? t('noProperties') : t('noResults')}
                    className="rounded-lg border border-dashed border-stone-300 bg-white py-12"
                />
            ) : (
                <Row gutter={[16, 16]}>
                    {filtered.map((property) => {
                        const propertyStatus = toPartnerPropertyStatus(property.status)
                        const propertyStatusLabel = toUserApartmentStatusLabel(propertyStatus, t)
                        const coverImage = getApartmentCoverImage(property.images as unknown)
                        const displayAddress = toPartnerPropertyAddress(property)
                        const rentPrice = toSafeNumber(property.baseRentPrice)
                        const amenityNames = getAmenityNames(property)
                        const visibleAmenities = amenityNames.slice(0, MAX_VISIBLE_AMENITIES)
                        const hiddenAmenities = amenityNames.slice(MAX_VISIBLE_AMENITIES)

                        return (
                            <Col key={property.id} xs={24} sm={12} lg={8}>
                                <Card
                                    className="h-full transition-shadow duration-200 hover:shadow-md"
                                    cover={
                                        <div className="relative h-44 overflow-hidden bg-gray-100">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url('${coverImage}')` }}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
                                            <div className="absolute left-3 bottom-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
                                                {toDisplayText(property.apartmentNumber)}
                                            </div>
                                            <div className="absolute right-3 top-3">
                                                <Tag color={PARTNER_PROPERTY_STATUS_COLORS[propertyStatus] ?? 'default'} className="font-medium">
                                                    {propertyStatusLabel}
                                                </Tag>
                                            </div>
                                        </div>
                                    }
                                    actions={[
                                        <Button
                                            key="view-detail"
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => router.push(`/profile/my-properties/${property.id}`)}
                                        >
                                            {t('viewDetail')}
                                        </Button>,
                                    ]}
                                >
                                    <div className="mb-2">
                                        <p className="truncate text-base leading-tight font-bold">
                                            {toDisplayText(property.buildingName)}
                                        </p>
                                        <p className="text-sm font-medium text-gray-500">
                                            {t('unitLabel')}: {toDisplayText(property.apartmentNumber)}
                                        </p>
                                    </div>

                                    <div className="mb-3 flex items-start gap-1">
                                        <EnvironmentOutlined className="mt-0.5 shrink-0 text-sm text-gray-400" />
                                        <p className="line-clamp-2 text-sm text-muted">{displayAddress}</p>
                                    </div>

                                    <div className="mb-3 flex min-h-8 flex-wrap items-center gap-2">
                                        {visibleAmenities.length > 0 ? (
                                            visibleAmenities.map((amenity, index) => (
                                                <Tag key={`${amenity}-${index}`} className="m-0 rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                                                    {amenity}
                                                </Tag>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}

                                        {hiddenAmenities.length > 0 ? (
                                            <Tooltip title={hiddenAmenities.join(', ')}>
                                                <button
                                                    type="button"
                                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                                                    aria-label="More amenities"
                                                >
                                                    <EllipsisOutlined />
                                                </button>
                                            </Tooltip>
                                        ) : null}
                                    </div>

                                    <div className="border-t pt-3">
                                        <p className="text-lg font-bold text-primary">
                                            {formatPaymentAmount(rentPrice, locale)}
                                            <span className="ml-1 text-xs font-normal text-muted">{t('perMonth')}</span>
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            )}
        </div>
    )
}
