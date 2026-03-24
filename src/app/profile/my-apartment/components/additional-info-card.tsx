import { Card, Descriptions, Tag } from 'antd'
import type { useTranslations } from 'next-intl'

import { formatLocaleDateTime, toDisplayText, toFiniteNumber } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import type { OwnerApartmentExtra } from './types'

type TranslationFn = ReturnType<typeof useTranslations>

type AdditionalInfoCardProps = {
    apartment?: OwnerApartmentExtra
    t: TranslationFn
}

const formatFurnishing = (value: unknown, t: TranslationFn) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return '-'
    }

    const normalized = value.toLowerCase()

    if (normalized === 'fully_furnished') {
        return t('furnishing.fully_furnished')
    }

    if (normalized === 'semi_furnished') {
        return t('furnishing.semi_furnished')
    }

    if (normalized === 'unfurnished') {
        return t('furnishing.unfurnished')
    }

    return value.replace(/_/g, ' ')
}

export function AdditionalInfoCard({ apartment, t }: AdditionalInfoCardProps) {
    const amenities: unknown[] = Array.isArray(apartment?.amenities) ? apartment.amenities : []

    return (
        <Card className="border-slate-200 bg-white" title={t('additionalInfo')}>
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="middle">
                <Descriptions.Item label={t('apartmentId')}>{toDisplayText(apartment?.id)}</Descriptions.Item>
                <Descriptions.Item label={t('floorNumber')}>{toDisplayText(apartment?.floorNumber)}</Descriptions.Item>
                <Descriptions.Item label={t('maxConcurrentViewings')}>{toDisplayText(apartment?.maxConcurrentViewings)}</Descriptions.Item>

                <Descriptions.Item label={t('newWardCode')}>{toDisplayText(apartment?.newWardCode)}</Descriptions.Item>
                <Descriptions.Item label={t('rating')}>{toDisplayText(apartment?.rating)}</Descriptions.Item>

                <Descriptions.Item label={t('latitude')}>{toDisplayText(apartment?.latitude)}</Descriptions.Item>
                <Descriptions.Item label={t('longitude')}>{toDisplayText(apartment?.longitude)}</Descriptions.Item>
                <Descriptions.Item label={t('usableArea')}>{apartment?.usableArea ? `${apartment.usableArea} m²` : '-'}</Descriptions.Item>

                <Descriptions.Item label={t('furnishingStatus')}>{formatFurnishing(apartment?.furnishingStatus, t)}</Descriptions.Item>
                <Descriptions.Item label={t('depositAmount')}>
                    {apartment?.depositAmount ? formatPaymentAmount(toFiniteNumber(apartment.depositAmount), 'vi') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('yearBuilt')}>{toDisplayText(apartment?.yearBuilt)}</Descriptions.Item>

                <Descriptions.Item label={t('ownerName')}>{toDisplayText(apartment?.owner?.fullName)}</Descriptions.Item>
                <Descriptions.Item label={t('ownerCompany')}>{toDisplayText(apartment?.owner?.companyName)}</Descriptions.Item>
                <Descriptions.Item label={t('ownerId')}>{toDisplayText(apartment?.ownerId)}</Descriptions.Item>

                <Descriptions.Item label={t('approvedByOperatorId')} span={{ xs: 1, sm: 2, md: 3 }}>
                    {toDisplayText(apartment?.approvedByOperatorId)}
                </Descriptions.Item>
                <Descriptions.Item label={t('approvedAt')}>{formatLocaleDateTime(apartment?.approvedAt, 'vi')}</Descriptions.Item>
                <Descriptions.Item label={t('createdAt')}>{formatLocaleDateTime(apartment?.createdAt, 'vi')}</Descriptions.Item>
                <Descriptions.Item label={t('updatedAt')}>{formatLocaleDateTime(apartment?.updatedAt, 'vi')}</Descriptions.Item>

                <Descriptions.Item label={t('videoTourUrl')} span={{ xs: 1, sm: 2, md: 3 }}>
                    {typeof apartment?.videoTourUrl === 'string' && apartment.videoTourUrl.trim().length > 0 ? (
                        <a href={apartment.videoTourUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {apartment.videoTourUrl}
                        </a>
                    ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('description')} span={{ xs: 1, sm: 2, md: 3 }}>
                    {toDisplayText(apartment?.description)}
                </Descriptions.Item>
                <Descriptions.Item label={t('amenities')} span={{ xs: 1, sm: 2, md: 3 }}>
                    <div className="flex flex-wrap gap-2">
                        {amenities.length > 0
                            ? amenities.map((amenity: unknown, index: number) => (
                                <Tag key={`${amenity}-${index}`} color="cyan">
                                    {toDisplayText(amenity)}
                                </Tag>
                            ))
                            : '-'}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label={t('roomsCount')}>{apartment?.rooms?.length ?? 0}</Descriptions.Item>
                <Descriptions.Item label={t('iotDevicesCount')}>{apartment?.iotDevices?.length ?? 0}</Descriptions.Item>
                <Descriptions.Item label={t('utilityMetersCount')}>{apartment?.utilityMeters?.length ?? 0}</Descriptions.Item>
            </Descriptions>
        </Card>
    )
}
