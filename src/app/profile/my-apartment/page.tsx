'use client'

import { useFullAddress } from '@/hooks/query/useAddress'
import { useUpdateMyHousePassword, useUserApartment } from '@/hooks/query/useUserApartment'
import { formatLocaleDate, toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import {
    APARTMENT_STATUS_COLORS,
    ApartmentStatus,
    formatFurnishing,
    toApartmentStatus,
    toReadableStatus,
    toSafeNumber,
} from '@/utils/userApartment'
import {
    DollarOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Empty, Row, Statistic, Table, Tag } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChangeHousePasswordModal } from '../components/change-house-password-modal'
import { ApartmentImageSlider } from '../components/apartment-image-slider'
import { ApartmentVideoTour } from '../components/apartment-video-tour'
import { MyApartmentDetailRow, UserApartmentItem } from '@/types/userApartment'

export default function MyApartmentPage() {
    const t = useTranslations('Profile.apartment')
    const locale = useLocale()
    const [showDoorPassword, setShowDoorPassword] = useState(false)
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
    const { data, isLoading } = useUserApartment()
    const { mutate: updateHousePassword, isPending: isUpdatingHousePassword } = useUpdateMyHousePassword()
    const rawApartment = data?.data?.[0] as UserApartmentItem | undefined
    const apartment = rawApartment?.apartment
    const fullAddress = useFullAddress(
        apartment?.streetAddress ?? undefined,
        apartment?.provinceCode ?? undefined,
        apartment?.wardCode ?? undefined,
    )
    const status = toApartmentStatus(apartment?.status)
    const displayAddress = fullAddress || apartment?.streetAddress || '-'
    const rentPrice = toSafeNumber(apartment?.baseRentPrice)
    const totalArea = toSafeNumber(apartment?.totalArea)
    const depositAmount = toSafeNumber(apartment?.depositAmount)
    const apartmentStatusLabel = apartment?.status
        ? (apartment.status in APARTMENT_STATUS_COLORS ? t(`status.${apartment.status as ApartmentStatus}`) : toReadableStatus(apartment.status))
        : '-'
    const hiddenDoorPassword = rawApartment?.apartmentDoorPassword
        ? (showDoorPassword ? rawApartment.apartmentDoorPassword : '********')
        : '-'
    const apartmentName = apartment?.buildingName ?? apartment?.apartmentNumber ?? '-'
    const amenities = apartment?.amenities ?? []

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true)
    }

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false)
    }

    const handleChangeHousePassword = (newPassword: string) => {
        const userApartmentId = rawApartment?.id ? String(rawApartment.id) : ''

        if (!userApartmentId) {
            return
        }

        updateHousePassword(
            {
                id: userApartmentId,
                payload: { housePassword: newPassword },
            },
            {
                onSuccess: () => {
                    setIsChangePasswordModalOpen(false)
                    setShowDoorPassword(false)
                },
            },
        )
    }

    const detailRows: MyApartmentDetailRow[] = [
        {
            key: 'tenantStatus',
            label: t('tenantStatus'),
            value: toReadableStatus(rawApartment?.status),
        },
        {
            key: 'isPrimaryTenant',
            label: t('isPrimaryTenant'),
            value: rawApartment?.isPrimaryTenant ? t('yes') : t('no'),
        },
        {
            key: 'moveInDate',
            label: t('moveInDate'),
            value: formatLocaleDate(rawApartment?.moveInDate, locale === 'en' ? 'en' : 'vi'),
        },
        {
            key: 'moveOutDate',
            label: t('moveOutDate'),
            value: formatLocaleDate(rawApartment?.moveOutDate, locale === 'en' ? 'en' : 'vi'),
        },
        {
            key: 'apartmentNumber',
            label: t('apartmentNumber'),
            value: toDisplayText(apartment?.apartmentNumber),
        },
        {
            key: 'buildingName',
            label: t('buildingName'),
            value: toDisplayText(apartment?.buildingName),
        },
        {
            key: 'floorNumber',
            label: t('floorNumber'),
            value: toDisplayText(apartment?.floorNumber),
        },
        {
            key: 'address',
            label: t('address'),
            value: toDisplayText(displayAddress),
        },
        {
            key: 'spaceOverview',
            label: t('spaceOverview'),
            value: (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{t('bedrooms')}</span>
                        <div className="font-medium text-slate-900">{toDisplayText(apartment?.numberOfBedrooms)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{t('bathrooms')}</span>
                        <div className="font-medium text-slate-900">{toDisplayText(apartment?.numberOfBathrooms)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{t('totalArea')}</span>
                        <div className="font-medium text-slate-900">{apartment?.totalArea ? `${apartment.totalArea} m²` : '-'}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{t('usableArea')}</span>
                        <div className="font-medium text-slate-900">{apartment?.usableArea ? `${apartment.usableArea} m²` : '-'}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'furnishingStatus',
            label: t('furnishingStatus'),
            value: formatFurnishing(apartment?.furnishingStatus, t),
        },
        {
            key: 'maxConcurrentViewings',
            label: t('maxConcurrentViewings'),
            value: toDisplayText(apartment?.maxConcurrentViewings),
        },
        {
            key: 'apartmentDoorPassword',
            label: t('apartmentDoorPassword'),
            value: (
                <div className="flex w-full items-center justify-between gap-3">
                    <span className="font-mono tracking-wide text-slate-900">{hiddenDoorPassword}</span>

                    <div className="flex items-center gap-2">
                        {rawApartment?.apartmentDoorPassword ? (
                            <Button
                                size="small"
                                type="text"
                                aria-label={showDoorPassword ? t('hideSensitiveData') : t('showSensitiveData')}
                                icon={showDoorPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                style={{ borderRadius: 999, paddingInline: 8 }}
                                onClick={() => setShowDoorPassword((prev) => !prev)}
                            />
                        ) : null}
                        {rawApartment?.id ? (
                            <Button
                                size="small"
                                type="default"
                                icon={<LockOutlined />}
                                style={{
                                    borderRadius: 8,
                                    borderColor: '#c7d2fe',
                                    backgroundColor: '#eef2ff',
                                    color: '#3730a3',
                                    fontWeight: 500,
                                }}
                                onClick={handleOpenChangePasswordModal}
                            >
                                {t('changeHousePassword')}
                            </Button>
                        ) : null}
                    </div>
                </div>
            ),
        },
        {
            key: 'buildingGateCode',
            label: t('buildingGateCode'),
            value: toDisplayText(rawApartment?.buildingGateCode),
        },
        {
            key: 'smartLockPin',
            label: t('smartLockPin'),
            value: toDisplayText(rawApartment?.smartLockPin),
        },
        {
            key: 'mailboxCode',
            label: t('mailboxCode'),
            value: toDisplayText(rawApartment?.mailboxCode),
        },
        {
            key: 'emergencyContactName',
            label: t('emergencyContactName'),
            value: toDisplayText(rawApartment?.emergencyContactName),
        },
        {
            key: 'emergencyContactPhone',
            label: t('emergencyContactPhone'),
            value: toDisplayText(rawApartment?.emergencyContactPhone),
        },
        {
            key: 'amenities',
            label: t('amenities'),
            value: amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                        <Tag key={amenity} color="cyan">
                            {toDisplayText(amenity).replace(/_/g, ' ')}
                        </Tag>
                    ))}
                </div>
            ) : '-',
        },
        {
            key: 'yearBuilt',
            label: t('yearBuilt'),
            value: toDisplayText(apartment?.yearBuilt),
        },
        {
            key: 'description',
            label: t('description'),
            value: toDisplayText(apartment?.description),
        },
    ]

    const loading = isLoading

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
                <div className="rounded-lg border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-stone-900">{t('title')}</h2>
                    <p className="mt-1 text-sm text-stone-600">
                        {t('subtitle')}
                    </p>
                </div>
                <Empty
                    description={t('noApartment')}
                    className="rounded-lg border border-dashed border-stone-300 bg-white py-14"
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
                <div className="flex items-center gap-2">
                    <Tag color={APARTMENT_STATUS_COLORS[status]} className="px-3! py-1! text-sm! font-medium!">
                        {t('statusLabel')}: {apartmentStatusLabel}
                    </Tag>
                    <Tag color={rawApartment?.isPrimaryTenant ? 'blue' : 'default'} className="px-3! py-1! text-sm! font-medium!">
                        {rawApartment?.isPrimaryTenant ? t('primaryTenant') : t('secondaryTenant')}
                    </Tag>
                </div>
            </div>

            <ApartmentImageSlider
                buildingName={apartmentName}
                images={apartment?.images ?? null}
            />

            <Card className="rounded-lg border border-blue-100 bg-white shadow-sm" style={{ marginTop: 4, marginBottom: 18 }}>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-primary">{apartmentName}</h3>
                    <p className="text-sm text-muted">
                        {t('apartmentNumber')}: {toDisplayText(apartment?.apartmentNumber)}
                        {apartment?.floorNumber ? ` · ${t('floorNumber')} ${apartment.floorNumber}` : ''}
                    </p>
                    <p className="text-sm text-muted">{toDisplayText(displayAddress)}</p>
                </div>

                <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-lg border-blue-200 bg-blue-50/60" style={{ marginBottom: 6 }}>
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
                        <Card className="h-full rounded-lg border-emerald-300 bg-yellow-50/70" style={{ marginBottom: 6 }}>
                            <Statistic
                                title={t('totalArea')}
                                value={totalArea}
                                suffix="m²"
                                styles={{ content: { color: '#15803d', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-lg border-yellow-300 bg-emerald-50/70" style={{ marginBottom: 6 }}>
                            <Statistic
                                title={t('depositAmount')}
                                value={depositAmount}
                                prefix={<DollarOutlined />}
                                formatter={(value) => formatPaymentAmount(Number(value ?? 0), locale)}
                                styles={{ content: { color: '#efc103', fontWeight: 700 } }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Card
                className="rounded-lg border-slate-200 bg-white"
                style={{ marginBottom: 18 }}
                title={<span className="text-slate-900">{t('apartmentInfo')}</span>}
            >
                <Table
                    bordered
                    pagination={false}
                    dataSource={detailRows}
                    rowKey="key"
                    columns={[
                        {
                            title: t('apartmentInfo'),
                            dataIndex: 'label',
                            key: 'label',
                            width: '34%',
                            className: 'font-medium text-slate-700',
                        },
                        {
                            title: t('description'),
                            dataIndex: 'value',
                            key: 'value',
                        },
                    ]}
                />
            </Card>

            <Card className="rounded-lg border-slate-200 bg-white" style={{ marginBottom: 8 }}>
                <ApartmentVideoTour
                    videoTourUrl={apartment?.videoTourUrl}
                    title={t('videoTour')}
                    unavailableText={t('videoUnavailable')}
                />
            </Card>

            <ChangeHousePasswordModal
                open={isChangePasswordModalOpen}
                isSubmitting={isUpdatingHousePassword}
                currentPassword={rawApartment?.apartmentDoorPassword ?? undefined}
                onClose={handleCloseChangePasswordModal}
                onSubmit={handleChangeHousePassword}
            />
        </div>
    )
}
