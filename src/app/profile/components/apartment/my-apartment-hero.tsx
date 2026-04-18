'use client'

import { Card } from 'antd'
import { formatPaymentAmount } from '@/utils/payment'
import { toDisplayText } from '@/utils/format'
import type { MyApartmentHeroProps } from '@/types/userApartment'
import { ApartmentImageSlider } from './apartment-image-slider'

export function MyApartmentHero({
    t,
    locale,
    apartmentName,
    displayAddress,
    apartmentNumber,
    floorNumber,
    rentPrice,
    apartmentImages,
    quickSummaryRows,
}: MyApartmentHeroProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]" style={{ marginBottom: 18 }}>
            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm" styles={{ body: { padding: 10 } }}>
                <ApartmentImageSlider buildingName={apartmentName} images={apartmentImages} />
            </Card>

            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm" styles={{ body: { padding: 0 } }}>
                <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 via-white to-blue-50/50 p-6">
                    <div className="flex h-full flex-col gap-5">
                        <div className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 uppercase">
                            {t('rentPrice')}
                        </div>

                        <div className="flex flex-wrap items-end gap-2">
                            <p className="text-4xl font-bold leading-none text-primary">
                                {formatPaymentAmount(rentPrice, locale)}
                            </p>
                            <p className="pb-1 text-base font-medium text-slate-500">{t('perMonth')}</p>
                        </div>

                        <div className="h-px bg-slate-200" />

                        <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{apartmentName}</h3>
                            <p className="mt-1 text-sm text-slate-500">{toDisplayText(displayAddress)}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                                {t('apartmentNumber')}: {toDisplayText(apartmentNumber)}
                            </span>
                            {floorNumber ? (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                                    {t('floorNumber')}: {toDisplayText(floorNumber)}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-200">
                    {quickSummaryRows.map((item) => (
                        <div key={item.key} className="bg-white px-4 py-3">
                            <p className="text-xs font-medium text-slate-500">{item.label}</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
