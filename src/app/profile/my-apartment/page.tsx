'use client'

import { Card, Col, Descriptions, Empty, Row, Statistic, Tag } from 'antd'
import {
    HomeOutlined,
    EnvironmentOutlined,
    StarOutlined,
    DollarOutlined,
    BorderOutlined,
} from '@ant-design/icons'
import { useMyApartment } from '@/hooks/query/useMyApartment'
import { useAuthStore } from '@/stores/auth.store'
import { formatPaymentAmount } from '@/utils/payment'
import { AdditionalInfoCard } from './components/additional-info-card'
import { ApartmentGallery } from './components/apartment-gallery'
import type { OwnerApartmentItem } from './components/types'
import { useTranslations } from 'next-intl'
import { useFullAddress } from '@/hooks/query/useAddress'

type ApartmentStatus = 'available' | 'occupied' | 'rented' | 'maintenance' | 'reserved' | 'unavailable' | 'inactive'

const APARTMENT_STATUS_COLORS: Record<ApartmentStatus, string> = {
    available: 'green',
    occupied: 'blue',
    rented: 'geekblue',
    maintenance: 'orange',
    reserved: 'purple',
    unavailable: 'volcano',
    inactive: 'red',
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

const toOptionalNumber = (value: unknown): number | undefined => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

const toApartmentStatus = (status: unknown): ApartmentStatus => {
    if (typeof status !== 'string') {
        return 'inactive'
    }

    return status in APARTMENT_STATUS_COLORS ? (status as ApartmentStatus) : 'inactive'
}

export default function MyApartmentPage() {
    const user = useAuthStore((s) => s.user)
    const isHydrated = useAuthStore((s) => s.isHydrated)
    const id = user?.id ?? ''
    const t = useTranslations('Profile.apartment')
    const { data: ownerApartments, isLoading } = useMyApartment(isHydrated ? id : '')
    const rawApartment = ownerApartments?.[0] as OwnerApartmentItem | undefined
    const streetAddress = rawApartment?.streetAddress ?? undefined
    const provinceCode = toOptionalNumber(rawApartment?.provinceCode)
    const wardCode = toOptionalNumber(rawApartment?.wardCode)
    const fullAddress = useFullAddress(streetAddress, provinceCode, wardCode)
    const status = toApartmentStatus(rawApartment?.status)
    const displayAddress = fullAddress || streetAddress || '-'
    const rentPrice = toNumber(rawApartment?.baseRentPrice)
    const totalArea = toNumber(rawApartment?.totalArea)
    const rating = rawApartment?.rating ?? '-'

    const loading = !isHydrated || isLoading

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        )
    }

    if (!rawApartment) {
        return (
            <div className="space-y-6">
                <div className="rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-stone-900">{t('title')}</h2>
                    <p className="mt-1 text-sm text-stone-600">
                        {t('subtitle')}
                    </p>
                </div>
                <Empty
                    description={t('noApartment')}
                    className="rounded-2xl border border-dashed border-stone-300 bg-white py-14"
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
                </div>
                <Tag color={APARTMENT_STATUS_COLORS[status]} className="px-3! py-1! text-sm! font-medium!">
                    {t('statusLabel')}: {t(`status.${status}`)}
                </Tag>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-blue-200 bg-blue-50/60" style={{ margin: 0 }}>
                            <Statistic
                                title={t('rentPrice')}
                                value={rentPrice}
                                formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                                suffix={t('perMonth')}
                                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-yellow-300 bg-yellow-50/70" style={{ margin: 0 }}>
                            <Statistic
                                title={t('totalArea')}
                                value={totalArea}
                                prefix={<BorderOutlined />}
                                suffix="m²"
                                styles={{ content: { color: '#efc103', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-emerald-300 bg-emerald-50/70" style={{ margin: 0 }}>
                            <Statistic
                                title={t('rating')}
                                value={rating}
                                prefix={<StarOutlined />}
                                styles={{ content: { color: '#15803d', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card className="overflow-hidden border-blue-200 bg-white" styles={{ body: { padding: 0 } }}>
                <ApartmentGallery buildingName={rawApartment.buildingName ?? rawApartment.apartmentNumber} images={rawApartment.images ?? null} />
            </Card>

            <Card
                className="border-blue-200 bg-linear-to-br from-blue-50 to-sky-50"
                title={<span className="flex items-center gap-2 text-blue-900"><HomeOutlined /> {t('apartmentInfo')}</span>}
            >
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 3, lg: 3 }} size="middle">
                    <Descriptions.Item label={t('buildingName')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                        {rawApartment.buildingName ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('apartmentNumber')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                        <span className="font-semibold">{rawApartment.apartmentNumber}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('statusLabel')} span={{ xs: 1, sm: 2, md: 1, lg: 1 }}>
                        <Tag color={APARTMENT_STATUS_COLORS[status]}>{t(`status.${status}`)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('address')} span={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                        <div className="flex items-start gap-2">
                            <EnvironmentOutlined className="mt-1 text-stone-500" />
                            <span>{displayAddress}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('totalArea')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{rawApartment.totalArea} m²</Descriptions.Item>
                    <Descriptions.Item label={t('bedrooms')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{rawApartment.numberOfBedrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('bathrooms')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{rawApartment.numberOfBathrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('furnishingStatus')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                        {rawApartment.furnishingStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('rentPrice')} span={{ xs: 1, sm: 1, md: 3, lg: 3 }}>
                        <span className="text-lg font-semibold text-primary">
                            {formatPaymentAmount(rentPrice, 'vi')}{t('perMonth')}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <AdditionalInfoCard apartment={rawApartment} t={t} />

            <Card className="border-emerald-200 bg-emerald-50/60">
                <Statistic
                    title={t('depositAmount')}
                    value={toNumber(rawApartment.depositAmount)}
                    prefix={<DollarOutlined />}
                    formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                />
            </Card>
        </div>
    )
}
