'use client';

import { Table, Tag, Button, Empty, Tabs } from 'antd';
import { DownloadOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';
import { PaymentHistory, PaymentStatus, PaymentType, PaymentHistoryProps } from '@/types/profile';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

export default function PaymentHistoryComponent({
    payments = [],
    loading = false
}: PaymentHistoryProps) {
    const [activeTab, setActiveTab] = useState<'all' | PaymentType>('all');
    const t = useTranslations('Profile.payment');

    const getStatusColor = (status: PaymentStatus) => {
        const colors: Record<PaymentStatus, string> = {
            [PaymentStatus.PENDING]: 'orange',
            [PaymentStatus.COMPLETED]: 'green',
            [PaymentStatus.FAILED]: 'red',
            [PaymentStatus.CANCELLED]: 'default'
        };
        return colors[status];
    };

    const getStatusText = (status: PaymentStatus) => {
        const statusKey = status.toLowerCase();
        return t(`statuses.${statusKey}`);
    };

    const getPaymentTypeColor = (type: PaymentType) => {
        const colors: Record<PaymentType, string> = {
            [PaymentType.RENT]: 'blue',
            [PaymentType.ELECTRICITY]: 'orange',
            [PaymentType.WATER]: 'cyan',
            [PaymentType.MAINTENANCE]: 'purple',
            [PaymentType.DEPOSIT]: 'green',
            [PaymentType.OTHER]: 'default'
        };
        return colors[type];
    };

    const getPaymentTypeText = (type: PaymentType) => {
        const typeKey = type.toLowerCase();
        return t(`types.${typeKey}`);
    };

    const filteredPayments = activeTab === 'all'
        ? payments
        : payments.filter(payment => payment.paymentType === activeTab);

    const columns: ColumnsType<PaymentHistory> = [
        {
            title: t('transactionId'),
            dataIndex: 'transactionId',
            key: 'transactionId',
            width: 160,
            render: (id?: string) => (
                <span className="font-mono text-xs text-muted whitespace-nowrap">{id || 'N/A'}</span>
            )
        },
        {
            title: t('type'),
            dataIndex: 'paymentType',
            key: 'paymentType',
            width: 130,
            render: (type: PaymentType) => (
                <Tag color={getPaymentTypeColor(type)} icon={type === PaymentType.RENT ? <DollarOutlined /> : undefined}>
                    {getPaymentTypeText(type)}
                </Tag>
            )
        },
        {
            title: t('apartment'),
            dataIndex: 'apartmentName',
            key: 'apartmentName',
            width: 180,
            render: (name: string) => (
                <span className="font-medium block truncate" title={name}>
                    {name}
                </span>
            )
        },
        {
            title: t('dueDate'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 120,
            render: (date: string) => {
                const d = new Date(date);
                return (
                    <span className="text-muted text-sm whitespace-nowrap">
                        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                );
            }
        },
        {
            title: t('paidDate'),
            dataIndex: 'paidDate',
            key: 'paidDate',
            width: 120,
            render: (date?: string) => {
                if (!date) return <span className="text-muted">-</span>;
                const d = new Date(date);
                return (
                    <span className="text-muted text-sm whitespace-nowrap">
                        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                );
            }
        },
        {
            title: t('amount'),
            dataIndex: 'amount',
            key: 'amount',
            width: 110,
            align: 'right',
            render: (amount: number) => (
                <span className="font-semibold text-sm whitespace-nowrap">
                    ${amount.toLocaleString()}
                </span>
            )
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: PaymentStatus) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            )
        },
        {
            title: t('actions'),
            key: 'actions',
            width: 200,
            align: 'center',
            render: (_: unknown, record: PaymentHistory) => (
                <div className="flex gap-2 justify-center items-center">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => console.log('View payment', record.id)}
                    >
                        {t('view')}
                    </Button>
                    {record.status === PaymentStatus.COMPLETED && record.invoiceUrl && (
                        <Button
                            type="link"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => window.open(record.invoiceUrl, '_blank')}
                        >
                            {t('invoice')}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const tabItems = [
        { key: 'all', label: `${t('all')} (${payments.length})` },
        { key: PaymentType.RENT, label: `${t('types.rent')} (${payments.filter(p => p.paymentType === PaymentType.RENT).length})` },
        { key: PaymentType.ELECTRICITY, label: `${t('types.electricity')} (${payments.filter(p => p.paymentType === PaymentType.ELECTRICITY).length})` },
        { key: PaymentType.WATER, label: `${t('types.water')} (${payments.filter(p => p.paymentType === PaymentType.WATER).length})` },
        { key: PaymentType.MAINTENANCE, label: `${t('types.maintenance')} (${payments.filter(p => p.paymentType === PaymentType.MAINTENANCE).length})` },
        { key: PaymentType.OTHER, label: `${t('types.other')} (${payments.filter(p => p.paymentType === PaymentType.OTHER).length})` }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">
                    {t('subtitle')}
                </p>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as typeof activeTab)}
                items={tabItems}
            />

            {filteredPayments.length === 0 && !loading ? (
                <Empty
                    description={t('noPayments')}
                    className="py-12"
                />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredPayments}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `${t('all')} ${total} ${t('title').toLowerCase()}`
                    }}
                />
            )}
        </div>
    );
}
