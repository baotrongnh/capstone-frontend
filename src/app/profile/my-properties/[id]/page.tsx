'use client'

import { useFullAddress } from '@/hooks/query/useAddress'
import { usePartnerPropertyDetail } from '@/hooks/query/usePartnerProperties'
import type { PartnerPropertyDetailItem } from '@/types/partnerProperties'
import { toDisplayText } from '@/utils/format'
import {
    PARTNER_PROPERTY_STATUS_COLORS,
    buildPartnerPropertyQuickSummaryRows,
    toPartnerPropertyAddress,
    toPartnerPropertyStatus,
} from '@/utils/partnerProperties'
import {
    formatFurnishing,
    hasDisplayValue,
    parseApartmentImages,
    toSafeNumber,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import { Breadcrumb, Card, Empty, Table, Tabs, Tag } from 'antd'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { ApartmentVideoTour } from '../../components/apartment/apartment-video-tour'
import { MyApartmentHero } from '../../components/apartment/my-apartment-hero'

type PropertyDetailRow = {
    key: string
    label: string
    value: ReactNode
}

type AmenityItem = NonNullable<PartnerPropertyDetailItem['amenities']>[number]

export default function MyPropertyDetailPage() {
    const tProperties = useTranslations('Profile.properties')
    const tApartment = useTranslations('Profile.apartment')
    const locale = useLocale()

    const params = useParams<{ id: string }>()
    const apartmentId = typeof params?.id === 'string' ? params.id : ''

    const { data, isLoading } = usePartnerPropertyDetail(apartmentId)

    const apartment = data?.data as PartnerPropertyDetailItem | undefined

    const resolvedAddress = useFullAddress(
        apartment?.streetAddress ?? undefined,
        apartment?.provinceCode ?? undefined,
        apartment?.wardCode ?? undefined,
    )

    const mappedAddress = toPartnerPropertyAddress(apartment)
    const displayAddress = mappedAddress !== '-' ? mappedAddress : resolvedAddress || '-'

    const apartmentStatus = toPartnerPropertyStatus(apartment?.status)
    const apartmentStatusLabel = toUserApartmentStatusLabel(apartmentStatus, tApartment)
    const apartmentName = apartment?.buildingName ?? apartment?.apartmentNumber ?? '-'

    const rentPrice = toSafeNumber(apartment?.baseRentPrice)
    const totalArea = toSafeNumber(apartment?.totalArea)
    const depositAmount = toSafeNumber(apartment?.depositAmount)

    const apartmentImages = parseApartmentImages(apartment?.images)

    const amenities: string[] = (apartment?.amenities ?? [])
        .map((item: AmenityItem) => toDisplayText(item.name ?? item.code))
        .filter((name: string) => name !== '-')

    const quickSummaryRows = buildPartnerPropertyQuickSummaryRows({
        t: tApartment,
        apartment,
        locale,
    })

    const detailRows: PropertyDetailRow[] = [
        {
            key: 'apartmentNumber',
            label: tApartment('apartmentNumber'),
            value: toDisplayText(apartment?.apartmentNumber),
        },
        {
            key: 'buildingName',
            label: tApartment('buildingName'),
            value: toDisplayText(apartment?.buildingName),
        },
        ...(hasDisplayValue(apartment?.floorNumber)
            ? [
                {
                    key: 'floorNumber',
                    label: tApartment('floorNumber'),
                    value: toDisplayText(apartment?.floorNumber),
                },
            ]
            : []),
        {
            key: 'address',
            label: tApartment('address'),
            value: toDisplayText(displayAddress),
        },
        {
            key: 'spaceOverview',
            label: tApartment('spaceOverview'),
            value: (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{tApartment('bedrooms')}</span>
                        <div className="font-medium text-slate-900">{toDisplayText(apartment?.numberOfBedrooms)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{tApartment('bathrooms')}</span>
                        <div className="font-medium text-slate-900">{toDisplayText(apartment?.numberOfBathrooms)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">{tApartment('usableArea')}</span>
                        <div className="font-medium text-slate-900">
                            {hasDisplayValue(apartment?.usableArea) ? `${toDisplayText(apartment?.usableArea)} m²` : '-'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'totalArea',
            label: tApartment('totalArea'),
            value: hasDisplayValue(apartment?.totalArea) ? `${totalArea} m²` : '-',
        },
        {
            key: 'depositAmount',
            label: tApartment('depositAmount'),
            value: hasDisplayValue(apartment?.depositAmount)
                ? `${depositAmount.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')} VND`
                : '-',
        },
        {
            key: 'furnishingStatus',
            label: tApartment('furnishingStatus'),
            value: formatFurnishing(apartment?.furnishingStatus, tApartment),
        },
        {
            key: 'maxConcurrentViewings',
            label: tApartment('maxConcurrentViewings'),
            value: toDisplayText(apartment?.maxConcurrentViewings),
        },
        {
            key: 'ownerName',
            label: tApartment('ownerName'),
            value: toDisplayText(apartment?.owner?.fullName),
        },
        {
            key: 'ownerCompany',
            label: tApartment('ownerCompany'),
            value: toDisplayText(apartment?.owner?.companyName),
        },
        {
            key: 'roomsCount',
            label: tApartment('roomsCount'),
            value: toDisplayText(apartment?.rooms?.length),
        },
        {
            key: 'iotDevicesCount',
            label: tApartment('iotDevicesCount'),
            value: toDisplayText(apartment?.iotDevices?.length),
        },
        {
            key: 'utilityMetersCount',
            label: tApartment('utilityMetersCount'),
            value: toDisplayText(apartment?.utilityMeters?.length),
        },
        {
            key: 'amenities',
            label: tApartment('amenities'),
            value: amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                        <Tag key={amenity} color="cyan">
                            {amenity}
                        </Tag>
                    ))}
                </div>
            ) : (
                '-'
            ),
        },
        {
            key: 'yearBuilt',
            label: tApartment('yearBuilt'),
            value: toDisplayText(apartment?.yearBuilt),
        },
        {
            key: 'description',
            label: tApartment('description'),
            value: toDisplayText(apartment?.description),
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{tProperties('loading')}</div>
            </div>
        )
    }

    if (!apartment) {
        return (
            <div className="space-y-6">
                <Breadcrumb
                    style={{ marginBottom: 24 }}
                    items={[
                        {
                            title: <Link href="/profile/my-properties">{tProperties('title')}</Link>,
                        },
                        {
                            title: tProperties('title'),
                        },
                    ]}
                />

                <div className="rounded-lg border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-stone-900">{tProperties('title')}</h2>
                    <p className="mt-1 text-sm text-stone-600">{tProperties('detailSubtitle')}</p>
                </div>
                <Empty description={tProperties('noProperties')} className="rounded-lg border border-dashed border-stone-300 bg-white py-14" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Breadcrumb
                style={{ marginBottom: 24 }}
                items={[
                    {
                        title: <Link href="/profile/my-properties">{tProperties('title')}</Link>,
                    },
                    {
                        title: toDisplayText(apartment?.apartmentNumber),
                    },
                ]}
            />

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{tProperties('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{tProperties('detailSubtitle')}</p>
                </div>
                <Tag color={PARTNER_PROPERTY_STATUS_COLORS[apartmentStatus] ?? 'default'} className="px-3! py-1! text-sm! font-medium!">
                    {tApartment('statusLabel')}: {apartmentStatusLabel}
                </Tag>
            </div>

            <MyApartmentHero
                t={tApartment}
                locale={locale}
                apartmentName={apartmentName}
                displayAddress={displayAddress}
                apartmentNumber={apartment?.apartmentNumber}
                floorNumber={apartment?.floorNumber}
                rentPrice={rentPrice}
                apartmentImages={apartmentImages}
                quickSummaryRows={quickSummaryRows}
            />

            <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm" style={{ marginBottom: 8 }} styles={{ body: { padding: 0 } }}>
                <Tabs
                    defaultActiveKey="propertyInfo"
                    className="[&_.ant-tabs-content-holder]:px-0 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:px-4 [&_.ant-tabs-nav]:pt-2"
                    items={[
                        {
                            key: 'propertyInfo',
                            label: tApartment('apartmentInfo'),
                            children: (
                                <Table
                                    pagination={false}
                                    showHeader={false}
                                    dataSource={detailRows}
                                    rowKey="key"
                                    columns={[
                                        {
                                            dataIndex: 'label',
                                            key: 'label',
                                            width: '34%',
                                            className: 'font-medium text-slate-700',
                                        },
                                        {
                                            dataIndex: 'value',
                                            key: 'value',
                                        },
                                    ]}
                                />
                            ),
                        },
                        {
                            key: 'videoTour',
                            label: tApartment('videoTour'),
                            children: (
                                <div className="p-4 md:p-6">
                                    <ApartmentVideoTour
                                        videoTourUrl={apartment?.videoTourUrl}
                                        title={tApartment('videoTour')}
                                        unavailableText={tApartment('videoUnavailable')}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    )
}
