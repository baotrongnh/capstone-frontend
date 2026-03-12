'use client';

import { Table, Tag, Button, Empty, Tabs, Badge, Alert } from 'antd';
import {
    DollarOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Bill, BillStatus, BillsProps, PaymentType } from '@/types/profile';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

export default function BillsComponent({ bills = [], loading = false }: BillsProps) {
    const [activeTab, setActiveTab] = useState<'all' | BillStatus>('all');
    const t = useTranslations('Profile.bills');

    const getStatusColor = (status: BillStatus) => {
        const colors: Record<BillStatus, string> = {
            [BillStatus.UPCOMING]: 'blue',
            [BillStatus.PENDING]: 'orange',
            [BillStatus.OVERDUE]: 'red',
            [BillStatus.PAID]: 'green',
        };
        return colors[status];
    };

    const getStatusIcon = (status: BillStatus) => {
        const icons: Record<BillStatus, React.ReactNode> = {
            [BillStatus.UPCOMING]: <ClockCircleOutlined />,
            [BillStatus.PENDING]: <ExclamationCircleOutlined />,
            [BillStatus.OVERDUE]: <WarningOutlined />,
            [BillStatus.PAID]: <CheckCircleOutlined />,
        };
        return icons[status];
    };

    const getBillTypeColor = (type: PaymentType) => {
        const colors: Record<PaymentType, string> = {
            [PaymentType.RENT]: 'blue',
            [PaymentType.ELECTRICITY]: 'orange',
            [PaymentType.WATER]: 'cyan',
            [PaymentType.MAINTENANCE]: 'purple',
            [PaymentType.DEPOSIT]: 'green',
            [PaymentType.OTHER]: 'default',
        };
        return colors[type];
    };

    const getBillTypeText = (type: PaymentType) => {
        const typeKey = type.toLowerCase();
        return t(`types.${typeKey}`);
    };

    const overdueBills = bills.filter((b) => b.status === BillStatus.OVERDUE);
    const pendingBills = bills.filter((b) => b.status === BillStatus.PENDING);
    const totalDue =
        overdueBills.reduce((s, b) => s + b.amount, 0) +
        pendingBills.reduce((s, b) => s + b.amount, 0);

    const filteredBills =
        activeTab === 'all' ? bills : bills.filter((b) => b.status === activeTab);

    const columns: ColumnsType<Bill> = [
        {
            title: t('billNumber'),
            dataIndex: 'billNumber',
            key: 'billNumber',
            width: 150,
            render: (num: string) => (
                <span className="font-mono text-xs text-muted whitespace-nowrap">{num}</span>
            ),
        },
        {
            title: t('type'),
            dataIndex: 'billType',
            key: 'billType',
            width: 130,
            render: (type: PaymentType) => (
                <Tag
                    color={getBillTypeColor(type)}
                    icon={type === PaymentType.RENT ? <DollarOutlined /> : undefined}
                >
                    {getBillTypeText(type)}
                </Tag>
            ),
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
            ),
        },
        {
            title: t('description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc?: string) => (
                <span className="text-sm text-muted">{desc || '-'}</span>
            ),
        },
        {
            title: t('issueDate'),
            dataIndex: 'issueDate',
            key: 'issueDate',
            width: 120,
            render: (date: string) => {
                const d = new Date(date);
                return (
                    <span className="text-muted text-sm whitespace-nowrap">
                        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                );
            },
        },
        {
            title: t('dueDate'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 120,
            render: (date: string, record: Bill) => {
                const d = new Date(date);
                const isOverdue = record.status === BillStatus.OVERDUE;
                return (
                    <span
                        className={`text-sm whitespace-nowrap font-medium ${isOverdue ? 'text-red-600' : 'text-muted'}`}
                    >
                        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                );
            },
        },
        {
            title: t('amount'),
            dataIndex: 'amount',
            key: 'amount',
            width: 110,
            align: 'right',
            render: (amount: number) => (
                <span className="font-semibold text-sm whitespace-nowrap">
                    ${amount.toLocaleString('en-US')}
                </span>
            ),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: BillStatus) => (
                <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                    {t(`statuses.${status}`)}
                </Tag>
            ),
        },
        {
            title: t('actions'),
            key: 'actions',
            width: 180,
            align: 'center',
            render: (_: unknown, record: Bill) => (
                <div className="flex gap-2 justify-center items-center">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => console.log('View bill', record.id)}
                    >
                        {t('view')}
                    </Button>
                    {(record.status === BillStatus.PENDING ||
                        record.status === BillStatus.OVERDUE ||
                        record.status === BillStatus.UPCOMING) && (
                            <Button
                                type="primary"
                                size="small"
                                danger={record.status === BillStatus.OVERDUE}
                                onClick={() => console.log('Pay bill', record.id)}
                            >
                                {t('payNow')}
                            </Button>
                        )}
                </div>
            ),
        },
    ];

    const countByStatus = (status: BillStatus) => bills.filter((b) => b.status === status).length;

    const tabItems = [
        {
            key: 'all',
            label: (
                <span>
                    {t('all')}{' '}
                    <Badge count={bills.length} showZero color="gray" size="small" />
                </span>
            ),
        },
        {
            key: BillStatus.OVERDUE,
            label: (
                <span>
                    {t('statuses.overdue')}{' '}
                    <Badge count={countByStatus(BillStatus.OVERDUE)} showZero color="red" size="small" />
                </span>
            ),
        },
        {
            key: BillStatus.PENDING,
            label: (
                <span>
                    {t('statuses.pending')}{' '}
                    <Badge count={countByStatus(BillStatus.PENDING)} showZero color="orange" size="small" />
                </span>
            ),
        },
        {
            key: BillStatus.UPCOMING,
            label: (
                <span>
                    {t('statuses.upcoming')}{' '}
                    <Badge count={countByStatus(BillStatus.UPCOMING)} showZero color="blue" size="small" />
                </span>
            ),
        },
        {
            key: BillStatus.PAID,
            label: (
                <span>
                    {t('statuses.paid')}{' '}
                    <Badge count={countByStatus(BillStatus.PAID)} showZero color="green" size="small" />
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
            </div>

            {/* Summary alert for overdue / total due */}
            {(overdueBills.length > 0 || pendingBills.length > 0) && (
                <Alert
                    type={overdueBills.length > 0 ? 'error' : 'warning'}
                    icon={overdueBills.length > 0 ? <WarningOutlined /> : <ExclamationCircleOutlined />}
                    showIcon
                    title={
                        overdueBills.length > 0
                            ? t('overdueAlert', { count: overdueBills.length })
                            : t('pendingAlert', { count: pendingBills.length })
                    }
                    description={
                        <span>
                            {t('totalDueDesc')}{' '}
                            <span className="font-bold">${totalDue.toLocaleString('en-US')}</span>
                        </span>
                    }
                />
            )}

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as typeof activeTab)}
                items={tabItems}
            />

            {filteredBills.length === 0 && !loading ? (
                <Empty description={t('noBills')} className="py-12" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredBills}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1100 }}
                    rowClassName={(record) =>
                        record.status === BillStatus.OVERDUE ? 'bg-red-50' : ''
                    }
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => t('totalItems', { total }),
                    }}
                />
            )}
        </div>
    );
}
