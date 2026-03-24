'use client'

import { Card, Descriptions, Tag, Statistic, Row, Col, Empty } from 'antd'
import {
    BgColorsOutlined,
    HomeOutlined,
    ThunderboltOutlined,
    DollarOutlined,
    CalendarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons'
import { useMyApartment } from '@/hooks/query/useMyApartment'
import type { ApartmentStatus, UserApartment } from '@/types/profile'
import { useAuthStore } from '@/stores/auth.store'
import { formatPaymentAmount } from '@/utils/payment'
import { AdditionalInfoCard } from './components/additional-info-card'
import { ApartmentGallery } from './components/apartment-gallery'
import type { OwnerApartmentExtra, OwnerApartmentItem } from './components/types'
import { UtilityUsageCard } from './components/utility-usage-card'
import { useTranslations } from 'next-intl'

const APARTMENT_STATUS_COLORS: Record<ApartmentStatus, string> = {
    available: 'green',
    occupied: 'blue',
    maintenance: 'orange',
    reserved: 'purple',
    inactive: 'red',
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

const toApartmentStatus = (status: unknown): ApartmentStatus => {
    if (typeof status !== 'string') {
        return 'inactive'
    }

    return status in APARTMENT_STATUS_COLORS ? (status as ApartmentStatus) : 'inactive'
}

const mapToUserApartment = (item: OwnerApartmentItem): UserApartment => {
    const resolvedAddress = item.newAddress ?? item.oldAddress

    return {
        id: item.id ?? '',
        buildingName: item.buildingName ?? '',
        apartmentNumber: item.apartmentNumber ?? '',
        address: item.address ?? resolvedAddress?.fullAddress ?? '',
        city: resolvedAddress?.provinceName ?? '',
        district: resolvedAddress?.districtName ?? '',
        totalArea: String(item.totalArea ?? ''),
        numberOfBedrooms: toNumber(item.numberOfBedrooms),
        numberOfBathrooms: toNumber(item.numberOfBathrooms),
        status: toApartmentStatus(item.status),
        images: item.images ?? null,
        baseRentPrice: toNumber(item.baseRentPrice),
        currentElectricReading: 0,
        previousElectricReading: 0,
        currentWaterReading: 0,
        previousWaterReading: 0,
        electricityUnitPrice: 0,
        waterUnitPrice: 0,
    }
}

export default function MyApartmentPage() {
    const user = useAuthStore((s) => s.user)
    const isHydrated = useAuthStore((s) => s.isHydrated)
    const id = user?.id ?? ''
    const t = useTranslations('Profile.apartment')
    const { data: ownerApartments, isLoading } = useMyApartment(isHydrated ? id : '')
    const rawApartment = ownerApartments?.[0] as OwnerApartmentExtra | undefined
    const apartment = ownerApartments?.length
        ? mapToUserApartment(ownerApartments[0])
        : null

    const loading = !isHydrated || isLoading

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        )
    }

    if (!apartment) {
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

    const electricityUsage = apartment.currentElectricReading - apartment.previousElectricReading
    const waterUsage = apartment.currentWaterReading - apartment.previousWaterReading
    const electricityCost = electricityUsage * apartment.electricityUnitPrice
    const waterCost = waterUsage * apartment.waterUnitPrice
    const totalUtilityCost = electricityCost + waterCost
    const totalThisMonth = apartment.baseRentPrice + totalUtilityCost

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
                </div>
                <Tag color={APARTMENT_STATUS_COLORS[apartment.status]} className="px-3! py-1! text-sm! font-medium!">
                    {t('statusLabel')}: {t(`status.${apartment.status}`)}
                </Tag>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-blue-200 bg-blue-50/60" style={{ margin: 0 }}>
                            <Statistic
                                title={t('rentPrice')}
                                value={apartment.baseRentPrice}
                                formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                                suffix={t('perMonth')}
                                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-yellow-300 bg-yellow-50/70" style={{ margin: 0 }}>
                            <Statistic
                                title={t('totalUtilityCost')}
                                value={totalUtilityCost}
                                formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                                styles={{ content: { color: '#efc103', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full border-emerald-300 bg-emerald-50/70" style={{ margin: 0 }}>
                            <Statistic
                                title={t('thisMonth')}
                                value={totalThisMonth}
                                formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                                styles={{ content: { color: '#15803d', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card className="overflow-hidden border-blue-200 bg-white" styles={{ body: { padding: 0 } }}>
                <ApartmentGallery buildingName={apartment.buildingName} images={apartment.images} />
            </Card>

            <Card
                className="border-blue-200 bg-linear-to-br from-blue-50 to-sky-50"
                title={<span className="flex items-center gap-2 text-blue-900"><HomeOutlined /> {t('apartmentInfo')}</span>}
            >
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 3, lg: 3 }} size="middle">
                    <Descriptions.Item label={t('buildingName')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{apartment.buildingName}</Descriptions.Item>
                    <Descriptions.Item label={t('apartmentNumber')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                        <span className="font-semibold">{apartment.apartmentNumber}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('statusLabel')} span={{ xs: 1, sm: 2, md: 1, lg: 1 }}>
                        <Tag color={APARTMENT_STATUS_COLORS[apartment.status]}>{t(`status.${apartment.status}`)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('address')} span={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                        <div className="flex items-start gap-2">
                            <EnvironmentOutlined className="mt-1 text-stone-500" />
                            <span>{apartment.address}, {apartment.district}, {apartment.city}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('totalArea')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{apartment.totalArea} m²</Descriptions.Item>
                    <Descriptions.Item label={t('bedrooms')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{apartment.numberOfBedrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('bathrooms')} span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>{apartment.numberOfBathrooms}</Descriptions.Item>
                    <Descriptions.Item label={t('rentPrice')} span={{ xs: 1, sm: 1, md: 3, lg: 3 }}>
                        <span className="text-lg font-semibold text-primary">
                            {formatPaymentAmount(apartment.baseRentPrice, 'vi')}{t('perMonth')}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <AdditionalInfoCard apartment={rawApartment} t={t} />

            <Card
                className="border-blue-200 bg-linear-to-b from-blue-50 to-cyan-50"
                title={t('totalUtilityCost')}
                style={{ marginTop: 16, marginBottom: 16 }}
            >
                <div className="flex w-full flex-row items-stretch justify-between gap-2 overflow-x-auto">
                    <Statistic
                        title={t('electricity')}
                        value={electricityCost}
                        prefix={<ThunderboltOutlined />}
                        formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                        styles={{ content: { color: '#a16207', fontWeight: 700, fontSize: 20 } }}
                    />
                    <div className="mx-1 w-px self-stretch bg-slate-200" />
                    <Statistic
                        title={t('water')}
                        value={waterCost}
                        prefix={<BgColorsOutlined />}
                        formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                        styles={{ content: { color: '#0369a1', fontWeight: 700, fontSize: 20 } }}
                    />
                    <div className="mx-1 w-px self-stretch bg-slate-200" />
                    <Statistic
                        title={t('totalUtilityCost')}
                        value={totalUtilityCost}
                        prefix={<DollarOutlined />}
                        formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                        styles={{ content: { color: '#efc103', fontWeight: 700, fontSize: 20 } }}
                    />
                    <div className="mx-1 w-px self-stretch bg-slate-200" />
                    <Statistic
                        title={t('thisMonth')}
                        value={totalThisMonth}
                        prefix={<DollarOutlined />}
                        formatter={(value) => formatPaymentAmount(Number(value ?? 0), 'vi')}
                        styles={{ content: { color: '#15803d', fontWeight: 700, fontSize: 22 } }}
                    />
                </div>
            </Card>

            {apartment.contract && (
                <Card
                    className="border-amber-200 bg-linear-to-br from-[#f5edde] to-[#ebdcc4]"
                    title={<span className="flex items-center gap-2 text-amber-900"><CalendarOutlined /> {t('contractInfo')}</span>}
                >
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
                            {formatPaymentAmount(apartment.contract.monthlyRent, 'vi')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('depositAmount')}>
                            {formatPaymentAmount(apartment.contract.depositAmount, 'vi')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('contractStatus')}>
                            <Tag color={apartment.contract.status === 'active' ? 'green' : 'red'}>
                                {apartment.contract.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}

            <UtilityUsageCard
                apartment={apartment}
                electricityUsage={electricityUsage}
                waterUsage={waterUsage}
                electricityCost={electricityCost}
                waterCost={waterCost}
                t={t}
            />
        </div>
    )
}
