import type { paths } from './api'
import type { Dayjs } from 'dayjs'

export type CreateViewingRequestBody = paths['/api/v1/viewing-requests/user/book']['post']['requestBody']['content']['application/json']
export type CreateViewingRequestRes = paths['/api/v1/viewing-requests/user/book']['post']['responses']['201']['content']['application/json']

export type ListMyViewingRequestsQuery = paths['/api/v1/viewing-requests/my']['get']['parameters']['query']
export type ListMyViewingRequestsRes = paths['/api/v1/viewing-requests/my']['get']['responses']['200']['content']['application/json']
export type ListMyViewingRequestsPayload = NonNullable<ListMyViewingRequestsRes['data']>
export type MyViewingRequestItem = ListMyViewingRequestsPayload[number]
export type MyViewingRequestStatus = Exclude<NonNullable<ListMyViewingRequestsQuery>['status'], undefined>

export type ScheduleCalendarProps = {
    value: Dayjs
    appointmentsByDate: Map<string, MyViewingRequestItem[]>
    onPanelChange: (value: Dayjs) => void
    onSelect: (value: Dayjs) => void
}

export type ScheduleDetailModalProps = {
    open: boolean
    selectedDateTitle: string
    appointments: MyViewingRequestItem[]
    onClose: () => void
}

export type ScheduleSummaryProps = {
    upcomingCount: number
    currentFocusDate?: string
    currentFocusTime?: string
    onNext: () => void
}