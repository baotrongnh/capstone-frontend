'use client'

import { useFullAddress } from '@/hooks/query/useAddress'
import { useUpdateMyHousePassword, useUserApartmentDetail } from '@/hooks/query/useUserApartment'
import { UserApartmentDetailItem } from '@/types/userApartment'
import { toDisplayText } from '@/utils/format'
import {
    APARTMENT_STATUS_COLORS,
    buildMyApartmentQuickSummaryRows,
    parseApartmentImages,
    toApartmentStatus,
    toSafeNumber,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'
import { Empty, Tag } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ChangeHousePasswordModal } from '../../components/change-house-password-modal'
import { MyApartmentHero } from '../../components/my-apartment-hero'
import { MyApartmentInformationTabs } from '../../components/my-apartment-information-tabs'

export default function MyApartmentDetailPage() {
    const t = useTranslations('Profile.apartment')
    const locale = useLocale()
    const params = useParams<{ id: string }>()
    const userApartmentId = typeof params?.id === 'string' ? params.id : ''

    const [showDoorPassword, setShowDoorPassword] = useState(false)
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

    const { data, isLoading } = useUserApartmentDetail(userApartmentId)
    const { mutate: updateHousePassword, isPending: isUpdatingHousePassword } = useUpdateMyHousePassword()

    const rawApartment = data?.data as UserApartmentDetailItem | undefined
    const apartment = rawApartment?.apartment

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

    const hiddenDoorPassword = rawApartment?.apartmentDoorPassword
        ? showDoorPassword
            ? rawApartment.apartmentDoorPassword
            : '********'
        : '-'

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true)
    }

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false)
    }

    const handleChangeHousePassword = (newPassword: string) => {
        const targetId = rawApartment?.id ? String(rawApartment.id) : userApartmentId

        if (!targetId) {
            return
        }

        updateHousePassword(
            {
                id: targetId,
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
                hiddenDoorPassword={hiddenDoorPassword}
                showDoorPassword={showDoorPassword}
                onToggleDoorPassword={() => setShowDoorPassword((prev) => !prev)}
                onOpenChangePasswordModal={handleOpenChangePasswordModal}
            />

            <ChangeHousePasswordModal
                open={isChangePasswordModalOpen}
                isSubmitting={isUpdatingHousePassword}
                currentPassword={rawApartment.apartmentDoorPassword ?? undefined}
                onClose={handleCloseChangePasswordModal}
                onSubmit={handleChangeHousePassword}
            />
        </div>
    )
}
