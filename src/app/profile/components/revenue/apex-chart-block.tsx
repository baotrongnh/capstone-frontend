"use client"

import ApexCharts from 'apexcharts'
import { useEffect, useRef } from 'react'

import type { ApexChartBlockProps } from '@/types/partnerRevenue'

export function ApexChartBlock({ options, series, type, height }: ApexChartBlockProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef.current) {
            return
        }

        const chartOptions = {
            ...options,
            series,
            chart: {
                ...(options.chart ?? {}),
                type,
                height,
            },
        }

        const chart = new ApexCharts(containerRef.current, chartOptions)
        void chart.render()

        return () => {
            chart.destroy()
        }
    }, [height, options, series, type])

    return <div ref={containerRef} className='w-full' />
}
