"use client";

import { use } from "react";
import ProfileLayout from "../../components/profile-layout";
import PaymentHistoryComponent from "../../components/payment-history";
import { ActorType } from "@/types/auth";
import {
  PaymentHistory,
  PaymentType,
  PaymentStatus,
  PaymentHistoryPageProps,
} from "@/types/profile";

export default function PaymentHistoryPage({
  params,
}: PaymentHistoryPageProps) {
  const { id } = use(params);
  console.log("first", id);

  // TODO: Fetch payment history from API
  const mockPayments: PaymentHistory[] = [
    {
      id: "payment-001",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.RENT,
      amount: 1200,
      dueDate: "2026-02-01",
      paidDate: "2026-02-01",
      status: PaymentStatus.COMPLETED,
      transactionId: "TXN-20260201-001",
      invoiceUrl: "/invoices/invoice-001.pdf",
    },
    {
      id: "payment-002",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.ELECTRICITY,
      amount: 22.5,
      dueDate: "2026-02-05",
      paidDate: "2026-02-05",
      status: PaymentStatus.COMPLETED,
      transactionId: "TXN-20260205-002",
      description: "Electricity usage: 150 kWh",
      invoiceUrl: "/invoices/invoice-002.pdf",
    },
    {
      id: "payment-003",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.WATER,
      amount: 17.5,
      dueDate: "2026-02-05",
      paidDate: "2026-02-06",
      status: PaymentStatus.COMPLETED,
      transactionId: "TXN-20260206-003",
      description: "Water usage: 7 m³",
      invoiceUrl: "/invoices/invoice-003.pdf",
    },
    {
      id: "payment-004",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.RENT,
      amount: 1200,
      dueDate: "2026-03-01",
      status: PaymentStatus.PENDING,
      transactionId: "TXN-20260301-004",
    },
    {
      id: "payment-005",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.MAINTENANCE,
      amount: 150,
      dueDate: "2026-01-20",
      paidDate: "2026-01-22",
      status: PaymentStatus.COMPLETED,
      transactionId: "TXN-20260122-005",
      description: "Plumbing repair",
      invoiceUrl: "/invoices/invoice-005.pdf",
    },
    {
      id: "payment-006",
      apartmentId: "1",
      apartmentName: "Sunrise Tower - A-305",
      paymentType: PaymentType.DEPOSIT,
      amount: 2400,
      dueDate: "2026-01-01",
      paidDate: "2025-12-28",
      status: PaymentStatus.COMPLETED,
      transactionId: "TXN-20251228-006",
      description: "Security deposit",
      invoiceUrl: "/invoices/invoice-006.pdf",
    },
  ];

  return (
    <ProfileLayout userId={id} actorType={ActorType.USER}>
      <PaymentHistoryComponent payments={mockPayments} />
    </ProfileLayout>
  );
}
