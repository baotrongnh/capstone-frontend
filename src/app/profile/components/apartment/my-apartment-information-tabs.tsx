'use client'

import { MyApartmentDetailRow } from '@/types/userApartment'
import type { MyApartmentInformationTabsProps } from '@/types/userApartment'
import { formatLocaleDate, toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import {
    formatFurnishing,
    hasDisplayValue,
    toContractCategoryLabel,
    toContractMemberStatusLabel,
    toContractMemberTypeLabel,
    toPaymentMethodLabel,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
} from '@ant-design/icons'
import { Button, Card, Table, Tabs, Tag } from 'antd'
import { ApartmentVideoTour } from './apartment-video-tour'

export function MyApartmentInformationTabs({
    t,
    locale,
    rawApartment,
    apartment,
    displayAddress,
    totalArea,
    depositAmount,
    amenities,
    hiddenDoorPassword,
    showDoorPassword,
    onToggleDoorPassword,
    onOpenChangePasswordModal,
}: MyApartmentInformationTabsProps) {
    const rentalContract = rawApartment?.rentalContract
    const contractMembers = rentalContract?.members ?? []
    const emergencyContactName = rawApartment?.emergencyContactName ?? rawApartment?.user?.emergencyContactName
    const emergencyContactPhone = rawApartment?.emergencyContactPhone ?? rawApartment?.user?.emergencyContactPhone

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
                    value: toUserApartmentStatusLabel(rentalContract.status, t),
                },
                {
                    key: 'paymentDueDay',
                    label: t('paymentDueDay'),
                    value: toDisplayText(rentalContract.paymentDueDay),
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
                                        onClick={onToggleDoorPassword}
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
                                        onClick={onOpenChangePasswordModal}
                                    >
                                        {t('changeHousePassword')}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    ),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.buildingGateCode)
            ? [
                {
                    key: 'buildingGateCode',
                    label: t('buildingGateCode'),
                    value: toDisplayText(rawApartment?.buildingGateCode),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.smartLockPin)
            ? [
                {
                    key: 'smartLockPin',
                    label: t('smartLockPin'),
                    value: toDisplayText(rawApartment?.smartLockPin),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.mailboxCode)
            ? [
                {
                    key: 'mailboxCode',
                    label: t('mailboxCode'),
                    value: toDisplayText(rawApartment?.mailboxCode),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.parkingAccessCode)
            ? [
                {
                    key: 'parkingAccessCode',
                    label: t('parkingAccessCode'),
                    value: toDisplayText(rawApartment?.parkingAccessCode),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.wifiName)
            ? [
                {
                    key: 'wifiName',
                    label: t('wifiName'),
                    value: toDisplayText(rawApartment?.wifiName),
                },
            ]
            : []),
        ...(hasDisplayValue(rawApartment?.wifiPassword)
            ? [
                {
                    key: 'wifiPassword',
                    label: t('wifiPassword'),
                    value: toDisplayText(rawApartment?.wifiPassword),
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
