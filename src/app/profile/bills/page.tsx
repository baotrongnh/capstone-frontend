'use client';

import BillsComponent from '../components/bills';
import { ActorType } from '@/types/auth';
import { Bill, BillStatus, PaymentType } from '@/types/profile';
import { ProfileLayout } from '../components';

export default function BillsPage() {
    // TODO: Fetch bills from API
    const mockBills: Bill[] = [
        {
            id: 'bill-001',
            billNumber: 'BILL-20260301-001',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.RENT,
            amount: 1200,
            issueDate: '2026-02-25',
            dueDate: '2026-03-05',
            status: BillStatus.PENDING,
            description: 'Monthly rent for March 2026',
        },
        {
            id: 'bill-002',
            billNumber: 'BILL-20260301-002',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.ELECTRICITY,
            amount: 28.5,
            issueDate: '2026-02-28',
            dueDate: '2026-03-10',
            status: BillStatus.PENDING,
            description: 'Electricity usage: 190 kWh',
        },
        {
            id: 'bill-003',
            billNumber: 'BILL-20260301-003',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.WATER,
            amount: 20.0,
            issueDate: '2026-02-28',
            dueDate: '2026-03-10',
            status: BillStatus.PENDING,
            description: 'Water usage: 8 m³',
        },
        {
            id: 'bill-004',
            billNumber: 'BILL-20260215-004',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.MAINTENANCE,
            amount: 80,
            issueDate: '2026-02-10',
            dueDate: '2026-02-20',
            status: BillStatus.OVERDUE,
            description: 'Air conditioning maintenance',
        },
        {
            id: 'bill-005',
            billNumber: 'BILL-20260401-005',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.RENT,
            amount: 1200,
            issueDate: '2026-03-25',
            dueDate: '2026-04-05',
            status: BillStatus.UPCOMING,
            description: 'Monthly rent for April 2026',
        },
        {
            id: 'bill-006',
            billNumber: 'BILL-20260201-006',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.ELECTRICITY,
            amount: 22.5,
            issueDate: '2026-01-30',
            dueDate: '2026-02-10',
            status: BillStatus.PAID,
            description: 'Electricity usage: 150 kWh',
        },
        {
            id: 'bill-007',
            billNumber: 'BILL-20260201-007',
            apartmentId: '1',
            apartmentName: 'Sunrise Tower - A-305',
            billType: PaymentType.WATER,
            amount: 17.5,
            issueDate: '2026-01-30',
            dueDate: '2026-02-10',
            status: BillStatus.PAID,
            description: 'Water usage: 7 m³',
        },
    ];

    return (
        <ProfileLayout actorType={ActorType.USER}>
            <BillsComponent bills={mockBills} />
        </ProfileLayout>
    );
}
