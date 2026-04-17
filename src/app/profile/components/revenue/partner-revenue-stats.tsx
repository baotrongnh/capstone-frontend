"use client"

import { BankOutlined, DollarCircleOutlined, HomeOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic, Typography } from 'antd'

import type { PartnerRevenueStatsProps } from '@/types/partnerRevenue'
import { formatPaymentAmount } from '@/utils/payment'

const { Text } = Typography

export function PartnerRevenueStats({ summary, locale, labels }: PartnerRevenueStatsProps) {
    return (
        <div className='space-y-4'>
            <Card>
                <div className='space-y-2'>
                    <p className='text-base font-semibold'>{labels.overviewTitle}</p>
                    <div className='flex flex-wrap items-center gap-8'>
                        <div className='flex items-center gap-2'>
                            <TeamOutlined className='text-blue-500' />
                            <Text strong>{labels.partnerLabel}:</Text>
                            <Text>{summary.partnerName}</Text>
                        </div>

                        <div className='flex items-center gap-2'>
                            <BankOutlined className='text-indigo-500' />
                            <Text strong>{labels.companyLabel}:</Text>
                            <Text>{summary.companyName}</Text>
                        </div>
                    </div>
                </div>
            </Card>

            <p className='text-base font-semibold'>{labels.activityTitle}</p>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title={labels.invoiceCount} value={summary.invoiceCount} prefix={<SolutionOutlined />} />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title={labels.apartmentCount} value={summary.apartmentCount} prefix={<HomeOutlined />} />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title={labels.contractCount} value={summary.contractCount} prefix={<BankOutlined />} />
                    </Card>
                </Col>
            </Row>

            <p className='text-base font-semibold'>{labels.financeTitle}</p>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title={labels.totalGrossRevenue}
                            value={summary.totalGrossRevenue}
                            formatter={(value) => formatPaymentAmount(value as number, locale)}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title={labels.totalSystemRevenue}
                            value={summary.totalSystemRevenue}
                            formatter={(value) => formatPaymentAmount(value as number, locale)}
                            prefix={<DollarCircleOutlined />}
                            styles={{ content: { color: '#b45309' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title={labels.totalNetPayoutRevenue}
                            value={summary.totalNetPayoutRevenue}
                            formatter={(value) => formatPaymentAmount(value as number, locale)}
                            prefix={<DollarCircleOutlined />}
                            styles={{ content: { color: '#15803d' } }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
