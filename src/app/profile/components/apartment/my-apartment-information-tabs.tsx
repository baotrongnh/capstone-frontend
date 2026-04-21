'use client'

import { MyApartmentDetailRow } from '@/types/userApartment'
import type { MyApartmentInformationTabsProps } from '@/types/userApartment'
import { DEFAULT_IOT_TOPIC_ICON, IOT_TOPIC_ICON_MAP } from '@/constants/iot'
import { formatLocaleDate, toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import {
    toContractStatusLabel,
    formatFurnishing,
    hasDisplayValue,
    toContractCategoryLabel,
    toContractMemberStatusLabel,
    toContractMemberTypeLabel,
    toPaymentMethodLabel,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import { LockOutlined } from '@ant-design/icons'
import { Button, Card, Table, Tabs, Tag } from 'antd'
import { ApartmentVideoTour } from './apartment-video-tour'
import { MyApartmentUtilityUsageTab } from './my-apartment-utility-usage-tab'

export function MyApartmentInformationTabs({
    t,
    locale,
    rawApartment,
    apartment,
    displayAddress,
    totalArea,
    depositAmount,
    amenities,
    iotDevices,
    isIotDevicesLoading,
    onOpenChangePasswordModal,
}: MyApartmentInformationTabsProps) {
    const rentalContract = rawApartment?.rentalContract
    const contractMembers = rentalContract?.members ?? []
    const emergencyContactName = rawApartment?.emergencyContactName ?? rawApartment?.user?.emergencyContactName
    const emergencyContactPhone = rawApartment?.emergencyContactPhone ?? rawApartment?.user?.emergencyContactPhone

    const getIotStateLabel = (state: string | null | undefined) => {
        const normalizedState = (state ?? '').trim().toLowerCase()

        if (normalizedState === 'on') {
            return t('iotStateOn')
        }

        if (normalizedState === 'off') {
            return t('iotStateOff')
        }

        return toDisplayText(state)
    }

    const iotDevicesContent = isIotDevicesLoading
        ? t('loading')
        : iotDevices.length > 0
            ? (
                <div className="space-y-2">
                    {iotDevices.map((device) => {
                        const Icon = IOT_TOPIC_ICON_MAP[device.normalizedTopic] ?? DEFAULT_IOT_TOPIC_ICON
                        const stateLabel = getIotStateLabel(device.state)
                        return (
                            <div key={device.key} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                <div className="flex items-center gap-2 font-medium text-slate-900">
                                    <Icon className="text-primary" />
                                    <span>{toDisplayText(device.deviceName)}</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {`${t('statusLabel')}: ${stateLabel}`}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
            : t('iotDevicesEmpty')

    const detailRows: MyApartmentDetailRow[] = [
        {
            key: 'tenantStatus',
            label: t('tenantStatus'),
            value: toUserApartmentStatusLabel(rawApartment?.status, t),
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
        ...(hasDisplayValue(apartment?.floorNumber)
            ? [
                {
                    key: 'floorNumber',
                    label: t('floorNumber'),
                    value: toDisplayText(apartment?.floorNumber),
                },
            ]
            : []),
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
                        <span className="text-xs text-slate-500">{t('usableArea')}</span>
                        <div className="font-medium text-slate-900">{apartment?.usableArea ? `${apartment.usableArea} m²` : '-'}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'totalArea',
            label: t('totalArea'),
            value: hasDisplayValue(apartment?.totalArea) ? `${totalArea} m²` : '-',
        },
        {
            key: 'depositAmount',
            label: t('depositAmount'),
            value: hasDisplayValue(apartment?.depositAmount)
                ? formatPaymentAmount(depositAmount, locale)
                : '-',
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
            key: 'iotDevices',
            label: t('iotDevices'),
            value: iotDevicesContent,
        },
        ...(rentalContract
            ? [
                {
                    key: 'contractNumber',
                    label: t('contractNumber'),
                    value: toDisplayText(rentalContract.contractNumber),
                },
                {
                    key: 'contractDuration',
                    label: t('contractInfo'),
                    value: `${formatLocaleDate(rentalContract.startDate, locale === 'en' ? 'en' : 'vi')} - ${formatLocaleDate(rentalContract.endDate, locale === 'en' ? 'en' : 'vi')}`,
                },
                {
                    key: 'rentalContractStatus',
                    label: t('contractStatus'),
                    value: toContractStatusLabel(rentalContract.status, t),
                },
                {
                    key: 'paymentMethod',
                    label: t('paymentMethod'),
                    value: toPaymentMethodLabel(rentalContract.paymentMethod, t),
                },
                {
                    key: 'contractCategory',
                    label: t('contractCategory'),
                    value: toContractCategoryLabel(rentalContract.category, t),
                },
                {
                    key: 'contractMembers',
                    label: t('contractMembers'),
                    value:
                        contractMembers.length > 0 ? (
                            <div className="space-y-2">
                                {contractMembers.map((member) => (
                                    <div key={member.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                        <div className="font-medium text-slate-900">{toDisplayText(member.user?.fullName)}</div>
                                        <div className="text-xs text-slate-500">
                                            {toDisplayText(member.user?.phone)} · {toContractMemberTypeLabel(member.memberType, t)} · {toContractMemberStatusLabel(member.status, t)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            '-'
                        ),
                },
            ]
            : []),

        ...(hasDisplayValue(rawApartment?.apartmentDoorPassword)
            ? [
                {
                    key: 'apartmentDoorPassword',
                    label: t('apartmentDoorPassword'),
                    value: (
                        <div className="flex w-full items-center justify-start">
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
                                onClick={onOpenChangePasswordModal}
                            >
                                {t('changeHousePassword')}
                            </Button>
                        </div>
                    ),
                },
            ]
            : []),
        ...(hasDisplayValue(emergencyContactName)
            ? [
                {
                    key: 'emergencyContactName',
                    label: t('emergencyContactName'),
                    value: toDisplayText(emergencyContactName),
                },
            ]
            : []),
        ...(hasDisplayValue(emergencyContactPhone)
            ? [
                {
                    key: 'emergencyContactPhone',
                    label: t('emergencyContactPhone'),
                    value: toDisplayText(emergencyContactPhone),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.notes)
            ? [
                {
                    key: 'notes',
                    label: t('notes'),
                    value: toDisplayText(rawApartment?.notes),
                },
            ]
            : []),
        {
            key: 'amenities',
            label: t('amenities'),
            value: amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                        <Tag key={amenity} color="cyan">
                            {amenity}
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

    return (
        <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm" style={{ marginBottom: 8 }} styles={{ body: { padding: 0 } }}>
            <Tabs
                defaultActiveKey="apartmentInfo"
                className="[&_.ant-tabs-content-holder]:px-0 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:px-4 [&_.ant-tabs-nav]:pt-2"
                items={[
                    {
                        key: 'apartmentInfo',
                        label: t('apartmentInfo'),
                        children: (
                            <Table
                                pagination={false}
                                showHeader={false}
                                dataSource={detailRows}
                                rowKey="key"
                                className="[&_.table-row-no-hover:hover>td]:bg-white! [&_.table-row-no-hover>td.ant-table-cell-row-hover]:bg-white!"
                                rowClassName={(record) =>
                                    record.key === 'spaceOverview' || record.key === 'iotDevices' || record.key === 'contractMembers'
                                        ? 'table-row-no-hover'
                                        : ''
                                }
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
                        key: 'utilityUsage',
                        label: t('utilityUsage'),
                        children: (
                            <MyApartmentUtilityUsageTab
                                t={t}
                                locale={locale}
                                apartmentId={rawApartment?.apartmentId}
                            />
                        ),
                    },
                    {
                        key: 'videoTour',
                        label: t('videoTour'),
                        children: (
                            <div className="p-4 md:p-6">
                                <ApartmentVideoTour
                                    videoTourUrl={apartment?.videoTourUrl}
                                    title={t('videoTour')}
                                    unavailableText={t('videoUnavailable')}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </Card>
    )
}
