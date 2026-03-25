import { BgColorsOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Card, Col, Divider, Row } from 'antd'
import type { useTranslations } from 'next-intl'

import type { UserApartment } from '@/types/profile'
import { formatPaymentAmount } from '@/utils/payment'

type TranslationFn = ReturnType<typeof useTranslations>

type UtilityUsageCardProps = {
    apartment: UserApartment
    electricityUsage: number
    waterUsage: number
    electricityCost: number
    waterCost: number
    t: TranslationFn
}

export function UtilityUsageCard({
    apartment,
    electricityUsage,
    waterUsage,
    electricityCost,
    waterCost,
    t,
}: UtilityUsageCardProps) {
    return (
        <Card
            className="border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50"
            title={
                <span className="flex items-center gap-2 text-blue-900">
                    <ThunderboltOutlined /> {t('utilityUsage')}
                </span>
            }
            extra={<span className="text-sm text-stone-600">{t('currentBillingPeriod')}</span>}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <Card className="border-yellow-300 bg-linear-to-br from-yellow-50 to-amber-50">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                                <ThunderboltOutlined style={{ color: '#ffffff', fontSize: 24 }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-600">{t('electricity')}</h3>
                                <p className="text-sm text-stone-600">kWh</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('previousReading')}</span>
                                <span className="font-medium">{apartment.previousElectricReading} kWh</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('currentReading')}</span>
                                <span className="font-medium">{apartment.currentElectricReading} kWh</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('usage')}</span>
                                <span className="font-bold text-yellow-500">{electricityUsage} kWh</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('unitPrice')}</span>
                                <span className="font-medium">{formatPaymentAmount(apartment.electricityUnitPrice, 'vi')}/kWh</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between rounded-lg bg-yellow-100 p-3">
                                <span className="font-semibold">{t('totalCost')}</span>
                                <span className="text-xl font-bold text-yellow-500">{formatPaymentAmount(electricityCost, 'vi')}</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12}>
                    <Card className="border-sky-300 bg-linear-to-br from-sky-50 to-cyan-50">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400">
                                <BgColorsOutlined style={{ color: '#ffffff', fontSize: 24 }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-sky-700">{t('water')}</h3>
                                <p className="text-sm text-stone-600">m³</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('previousReading')}</span>
                                <span className="font-medium">{apartment.previousWaterReading} m³</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('currentReading')}</span>
                                <span className="font-medium">{apartment.currentWaterReading} m³</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('usage')}</span>
                                <span className="font-bold text-sky-700">{waterUsage} m³</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{t('unitPrice')}</span>
                                <span className="font-medium">{formatPaymentAmount(apartment.waterUnitPrice, 'vi')}/m³</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between rounded-lg bg-sky-100 p-3">
                                <span className="font-semibold">{t('totalCost')}</span>
                                <span className="text-xl font-bold text-sky-700">{formatPaymentAmount(waterCost, 'vi')}</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    )
}
