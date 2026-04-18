'use client'

import { useFullAddress } from '@/hooks/query/useAddress'
import { useIotBoardsByApartment, useUpdateDoorPin, useUserApartmentDetail } from '@/hooks/query/useUserApartment'
import { ChangeHousePasswordSubmitPayload, UserApartmentDetailItem } from '@/types/userApartment'
import { toDisplayText } from '@/utils/format'
import { buildApartmentIotDevices, resolveDoorPinTargetFromBoards } from '@/utils/iot'
import {
    APARTMENT_STATUS_COLORS,
    buildMyApartmentQuickSummaryRows,
    parseApartmentImages,
    toApartmentStatus,
    toSafeNumber,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import { getIotBoards } from '@/lib/services/userApartment.service'
import { App, Breadcrumb, Empty, Tag } from 'antd'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ChangeHousePasswordModal } from '../../components/change-house-password-modal'
import { MyApartmentHero } from '../../components/apartment/my-apartment-hero'
import { MyApartmentInformationTabs } from '../../components/apartment/my-apartment-information-tabs'

export default function MyApartmentDetailPage() {
    const t = useTranslations('Profile.apartment')
    const locale = useLocale()
    const { message } = App.useApp()
    const params = useParams<{ id: string }>()
    const userApartmentId = typeof params?.id === 'string' ? params.id : ''

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

    const { data, isLoading } = useUserApartmentDetail(userApartmentId)
    const { mutate: updateHousePassword, isPending: isUpdatingHousePassword } = useUpdateDoorPin()

    const rawApartment = data?.data as UserApartmentDetailItem | undefined
    const apartment = rawApartment?.apartment
    const apartmentId = rawApartment?.apartmentId

    const { data: iotBoardsResponse, isLoading: isIotDevicesLoading } = useIotBoardsByApartment(apartmentId)

    const iotDevices = useMemo(
        () => buildApartmentIotDevices(iotBoardsResponse?.data, apartmentId),
        [apartmentId, iotBoardsResponse?.data],
    )

    const fullAddress = useFullAddress(
        apartment?.streetAddress ?? undefined,
        apartment?.provinceCode ?? undefined,
        apartment?.wardCode ?? undefined,
    )

    const apartmentStatus = toApartmentStatus(apartment?.status)
    const apartmentStatusLabel = toUserApartmentStatusLabel(apartmentStatus, t)
    const displayAddress = fullAddress || apartment?.streetAddress || '-'

    const rentPrice = toSafeNumber(apartment?.baseRentPrice)
    const totalArea = toSafeNumber(apartment?.totalArea)
    const depositAmount = toSafeNumber(apartment?.depositAmount)

    const apartmentName = apartment?.buildingName ?? apartment?.apartmentNumber ?? '-'
    const apartmentImages = parseApartmentImages(apartment?.images)

    const amenities = (apartment?.apartmentAmenities ?? [])
        .map((item) => toDisplayText(item.amenity?.name ?? item.amenity?.code))
        .filter((amenity) => amenity !== '-')

    const quickSummaryRows = buildMyApartmentQuickSummaryRows({
        t,
        apartment,
        rawApartment,
        totalArea,
        depositAmount,
        locale,
    })

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true)
    }

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false)
    }

    const handleChangeHousePassword = async (payload: ChangeHousePasswordSubmitPayload) => {
        if (!apartmentId) {
            message.error(t('doorDeviceNotFound'))
            return
        }

        try {
            const iotBoardsResponse = await getIotBoards({ apartmentId })
            const doorPinTarget = resolveDoorPinTargetFromBoards(iotBoardsResponse?.data, apartmentId)

            if (!doorPinTarget) {
                message.error(t('doorDeviceNotFound'))
                return
            }

            updateHousePassword(
                {
                    boardId: doorPinTarget.boardId,
                    deviceId: doorPinTarget.deviceId,
                    payload,
                },
                {
                    onSuccess: () => {
                        setIsChangePasswordModalOpen(false)
                    },
                },
            )
        } catch {
            message.error(t('doorBoardsLoadFailed'))
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div>{t('loading')}</div>
            </div>
        )
    }

    if (!rawApartment) {
        return (
            <div className="space-y-6">
                <Breadcrumb
                    style={{ marginBottom: 24 }}
                    items={[
                        {
                            title: <Link href="/profile/my-apartment">{t('title')}</Link>,
                        },
                        {
                            title: t('title'),
                        },
                    ]}
                />

                <div className="rounded-lg border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-stone-900">{t('title')}</h2>
                    <p className="mt-1 text-sm text-stone-600">{t('subtitle')}</p>
                </div>
                <Empty description={t('noApartment')} className="rounded-lg border border-dashed border-stone-300 bg-white py-14" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Breadcrumb
                style={{ marginBottom: 24 }}
                items={[
                    {
                        title: <Link href="/profile/my-apartment">{t('title')}</Link>,
                    },
                    {
                        title: toDisplayText(apartment?.apartmentNumber),
                    },
                ]}
            />

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
                    <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Tag color={APARTMENT_STATUS_COLORS[apartmentStatus] ?? 'default'} className="px-3! py-1! text-sm! font-medium!">
                        {t('statusLabel')}: {apartmentStatusLabel}
                    </Tag>
                    <Tag color={rawApartment.isPrimaryTenant ? 'blue' : 'default'} className="px-3! py-1! text-sm! font-medium!">
                        {rawApartment.isPrimaryTenant ? t('primaryTenant') : t('secondaryTenant')}
                    </Tag>
                </div>
            </div>

            <MyApartmentHero
                t={t}
                locale={locale}
                apartmentName={apartmentName}
                displayAddress={displayAddress}
                apartmentNumber={apartment?.apartmentNumber}
                floorNumber={apartment?.floorNumber}
                rentPrice={rentPrice}
                apartmentImages={apartmentImages}
                quickSummaryRows={quickSummaryRows}
            />

            <MyApartmentInformationTabs
                t={t}
                locale={locale}
                rawApartment={rawApartment}
                apartment={apartment}
                displayAddress={displayAddress}
                totalArea={totalArea}
                depositAmount={depositAmount}
                amenities={amenities}
                iotDevices={iotDevices}
                isIotDevicesLoading={isIotDevicesLoading}
                onOpenChangePasswordModal={handleOpenChangePasswordModal}
            />

            <ChangeHousePasswordModal
                open={isChangePasswordModalOpen}
                isSubmitting={isUpdatingHousePassword}
                onClose={handleCloseChangePasswordModal}
                onSubmit={handleChangeHousePassword}
            />
        </div>
    )
}
