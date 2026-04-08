'use client'

import { useUserApartment } from '@/hooks/query/useUserApartment'
import { formatLocaleDate, toDisplayText } from '@/utils/format'
import {
    APARTMENT_STATUS_COLORS,
    ApartmentStatus,
    getApartmentCoverImage,
    toApartmentStatus,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import {
    CheckCircleOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    HomeOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Empty, Input, Row, Select, Statistic, Tag } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

const { Search } = Input
type ApartmentStatusFilter = 'all' | ApartmentStatus

export default function MyApartmentPage() {
    const t = useTranslations('Profile.apartment')
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading } = useUserApartment()

    const apartments = useMemo(() => data?.data ?? [], [data?.data])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<ApartmentStatusFilter>('all')

    const statusOptions = useMemo(() => {
        const uniqueStatuses = Array.from(new Set(apartments.map((item) => toApartmentStatus(item.apartment?.status))))

        return [
            { value: 'all' as const, label: t('allStatuses') },
            ...uniqueStatuses.map((status) => ({ value: status, label: toUserApartmentStatusLabel(status, t) })),
        ]
    }, [apartments, t])

    const stats = useMemo(
        () => ({
            total: apartments.length,
            primaryTenant: apartments.filter((item) => item.isPrimaryTenant).length,
            secondaryTenant: apartments.filter((item) => !item.isPrimaryTenant).length,
            activeAssignments: apartments.filter((item) => item.status === 'active').length,
        }),
        [apartments],
    )

    const filtered = useMemo(
        () =>
            apartments.filter((item) => {
                const apartment = item.apartment
                const apartmentSearchText = [
                    apartment?.buildingName,
                    apartment?.apartmentNumber,
                    apartment?.streetAddress,
                ]
                    .filter((value): value is string => typeof value === 'string')
                    .join(' ')
                    .toLowerCase()

                const matchSearch = search.trim().length === 0 || apartmentSearchText.includes(search.trim().toLowerCase())
                const apartmentStatus = toApartmentStatus(apartment?.status)
                const matchStatus = statusFilter === 'all' || apartmentStatus === statusFilter

                return matchSearch && matchStatus
            }),
        [apartments, search, statusFilter],
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
                    <Card className="text-center border-blue-200 bg-blue-50">
                        <Statistic
                            title={t('stats.primaryTenant')}
                            value={stats.primaryTenant}
                            prefix={<UserOutlined />}
                            styles={{ content: { color: '#2563eb' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center border-cyan-200 bg-cyan-50">
                        <Statistic
                            title={t('stats.secondaryTenant')}
                            value={stats.secondaryTenant}
                            styles={{ content: { color: '#0891b2' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="text-center border-emerald-200 bg-emerald-50">
                        <Statistic
                            title={t('stats.activeAssignments')}
                            value={stats.activeAssignments}
                            prefix={<CheckCircleOutlined />}
                            styles={{ content: { color: '#059669' } }}
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
                <Select<ApartmentStatusFilter>
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    className="w-48"
                    options={statusOptions}
                />
            </div>

            {filtered.length === 0 ? (
                <Empty
                    description={apartments.length === 0 ? t('noApartment') : t('noResults')}
                    className="rounded-lg border border-dashed border-stone-300 bg-white py-12"
                />
            ) : (
                <Row gutter={[16, 16]}>
                    {filtered.map((item) => {
                        const apartment = item.apartment
                        const apartmentStatus = toApartmentStatus(apartment?.status)
                        const apartmentStatusLabel = toUserApartmentStatusLabel(apartmentStatus, t)
                        const coverImage = getApartmentCoverImage(apartment?.images as unknown)

                        return (
                            <Col key={item.id} xs={24} sm={12} lg={8}>
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
                                                {toDisplayText(apartment?.apartmentNumber)}
                                            </div>
                                            <div className="absolute right-3 top-3">
                                                <Tag color={APARTMENT_STATUS_COLORS[apartmentStatus] ?? 'default'} className="font-medium">
                                                    {apartmentStatusLabel}
                                                </Tag>
                                            </div>
                                        </div>
                                    }
                                    actions={[
                                        <Button
                                            key="view-detail"
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => router.push(`/profile/my-apartment/${item.id}`)}
                                        >
                                            {t('viewDetail')}
                                        </Button>,
                                    ]}
                                >
                                    <div className="mb-2">
                                        <p className="truncate text-base leading-tight font-bold">
                                            {toDisplayText(apartment?.buildingName)}
                                        </p>
                                        <p className="text-sm font-medium text-gray-500">
                                            {t('apartmentNumber')}: {toDisplayText(apartment?.apartmentNumber)}
                                        </p>
                                    </div>

                                    <div className="mb-3 flex items-start gap-1">
                                        <EnvironmentOutlined className="mt-0.5 shrink-0 text-sm text-gray-400" />
                                        <p className="line-clamp-2 text-sm text-muted">{toDisplayText(apartment?.streetAddress)}</p>
                                    </div>

                                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                        <Tag color={item.isPrimaryTenant ? 'blue' : 'default'}>
                                            {item.isPrimaryTenant ? t('primaryTenant') : t('secondaryTenant')}
                                        </Tag>
                                        <Tag color={APARTMENT_STATUS_COLORS[apartmentStatus] ?? 'default'}>{apartmentStatusLabel}</Tag>
                                    </div>

                                    <div className="border-t pt-3 text-xs text-muted space-y-1">
                                        <p>
                                            {t('moveInDate')}: {formatLocaleDate(item.moveInDate, locale === 'en' ? 'en' : 'vi')}
                                        </p>
                                        <p>
                                            {t('moveOutDate')}: {formatLocaleDate(item.moveOutDate, locale === 'en' ? 'en' : 'vi')}
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
