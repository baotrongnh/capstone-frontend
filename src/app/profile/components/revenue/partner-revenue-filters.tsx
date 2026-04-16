"use client"

import { Button, DatePicker, Select, Typography } from 'antd'

import type { PartnerRevenueFiltersProps } from '@/types/partnerRevenue'

const { RangePicker } = DatePicker
const { Text } = Typography

export function PartnerRevenueFilters({
    labels,
    selectedRange,
    limit,
    limitOptions,
    dateFormat,
    onDateRangeChange,
    onLimitChange,
    onReset,
}: PartnerRevenueFiltersProps) {
    return (
        <div className='flex flex-wrap items-end gap-3'>
            <div className='min-w-72'>
                <Text strong>{labels.dateRange}</Text>
                <RangePicker
                    className='mt-1 w-full'
                    value={selectedRange}
                    format={dateFormat}
                    onChange={onDateRangeChange}
                    allowClear={false}
                />
            </div>

            <div className='w-40'>
                <Text strong>{labels.pageSize}</Text>
                <Select<number>
                    className='mt-1 w-full'
                    value={limit}
                    options={limitOptions.map((option) => ({
                        value: option,
                        label: option,
                    }))}
                    onChange={onLimitChange}
                />
            </div>

            <Button type='default' onClick={onReset}>
                {labels.reset}
            </Button>
        </div>
    )
}
