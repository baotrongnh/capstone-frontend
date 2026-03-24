"use client";

import { usePayments } from "@/hooks/query/usePayments";
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_TABS, type ListPaymentsQuery, type PaymentListItem, type PaymentStatus } from "@/types/payment";
import { formatPaymentAmount, formatPaymentDate, isPaymentStatus, toPaymentMethodTranslationKey } from "@/utils/payment";
import { Alert, Empty, Grid, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const t = useTranslations("Profile.payment");
  const locale = useLocale();
  const screens = Grid.useBreakpoint();
  const [activeStatus, setActiveStatus] = useState<"all" | PaymentStatus>("all");

  const queryParams = useMemo<ListPaymentsQuery | undefined>(
    () => (activeStatus === "all" ? undefined : { status: activeStatus }),
    [activeStatus],
  );

  const { data: allPaymentsData } = usePayments();
  const { data, isLoading, isError, error } = usePayments(queryParams);

  const payments = useMemo(() => data?.data ?? [], [data]);
  const allPayments = useMemo(() => allPaymentsData?.data ?? [], [allPaymentsData]);
  const filteredAllPayments = useMemo(
    () => allPayments.filter((payment) => payment.status && isPaymentStatus(payment.status) && PAYMENT_STATUS_TABS.includes(payment.status)),
    [allPayments],
  );
  const filteredPayments = useMemo(
    () => payments.filter((payment) => payment.status && isPaymentStatus(payment.status) && PAYMENT_STATUS_TABS.includes(payment.status)),
    [payments],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
      cancelled: 0,
    };

    filteredAllPayments.forEach((payment) => {
      const status = payment.status;
      if (status && isPaymentStatus(status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [filteredAllPayments]);

  const handleStatusTabChange = (key: string) => {
    if (key === "all" || isPaymentStatus(key)) {
      setActiveStatus(key);
    }
  };

  const getStatusLabel = (status?: string | null) => {
    if (!status) return "-";
    if (!isPaymentStatus(status)) return status;
    return t(`statuses.${status}`);
  };

  const getMethodLabel = (paymentMethod?: string | null) => {
    const methodKey = toPaymentMethodTranslationKey(paymentMethod);
    return t(`paymentMethods.${methodKey}`);
  };

  const columns: ColumnsType<PaymentListItem> = [
    {
      title: t("paymentReference"),
      dataIndex: "paymentReference",
      key: "paymentReference",
      width: 180,
      render: (paymentReference?: string) => (
        <span className="font-mono text-xs text-muted whitespace-nowrap">{paymentReference || "-"}</span>
      ),
    },
    {
      title: t("invoiceNumber"),
      key: "invoiceNumber",
      width: 160,
      render: (_: unknown, record) => {
        const invoiceNumber = record.invoice?.invoiceNumber;
        return <span className="font-medium">{invoiceNumber || "-"}</span>;
      },
    },
    {
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 140,
      render: (paymentMethod?: string | null) => <Tag>{getMethodLabel(paymentMethod)}</Tag>,
    },
    {
      title: t("paymentDate"),
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 120,
      render: (paymentDate?: string | null) => formatPaymentDate(paymentDate, locale),
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      width: 140,
      align: "right",
      render: (amount?: string) => <span className="font-semibold">{formatPaymentAmount(amount, locale)}</span>,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status?: string | null, record?: PaymentListItem) => {
        if (!status) return <Tag>-</Tag>;
        if (!isPaymentStatus(status)) return <Tag>{status}</Tag>;

        return (
          <Tag color={record?.isSynthetic ? "gold" : PAYMENT_STATUS_COLORS[status]}>
            {record?.isSynthetic ? t("syntheticStatus") : getStatusLabel(status)}
          </Tag>
        );
      },
    },
  ];

  const tabItems = [
    { key: "all", label: `${t("all")} (${filteredAllPayments.length})` },
    ...PAYMENT_STATUS_TABS.map((status) => ({
      key: status,
      label: `${t(`statuses.${status}`)} (${statusCounts[status]})`,
    })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          title={t("loadError")}
          description={error?.message}
        />
      )}

      <Tabs
        activeKey={activeStatus}
        onChange={handleStatusTabChange}
        items={tabItems}
      />

      {filteredPayments.length === 0 && !isLoading ? (
        <Empty description={t("empty")} className="py-10" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPayments}
          loading={isLoading}
          scroll={screens.md ? undefined : { x: 760 }}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => {
              const invoiceId = record.invoice?.id;
              if (!invoiceId) return;
              router.push(`/profile/invoices/${invoiceId}?from=payments`);
            },
            style: { cursor: record.invoice?.id ? "pointer" : "default" },
          })}
        />
      )}
    </div>
  );
}
