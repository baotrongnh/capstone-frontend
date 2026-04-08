"use client";

import { getPayments } from "@/lib/services/payment.service";
import { usePayments } from "@/hooks/query/usePayments";
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_TABS, type ListPaymentsQuery, type PaymentListItem, type PaymentStatus } from "@/types/payment";
import {
  extractPaymentItems,
  extractPaymentLimit,
  extractPaymentPage,
  extractPaymentTotal,
  formatPaymentAmount,
  formatPaymentDate,
  isPaymentStatus,
  toPaymentMethodTranslationKey,
} from "@/utils/payment";
import { Alert, Empty, Grid, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const t = useTranslations("Profile.payment");
  const locale = useLocale();
  const screens = Grid.useBreakpoint();
  const [activeStatus, setActiveStatus] = useState<"all" | PaymentStatus>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryParams = useMemo<ListPaymentsQuery>(
    () => ({
      ...(activeStatus === "all" ? {} : { status: activeStatus }),
      page,
      limit,
    }),
    [activeStatus, limit, page],
  );

  const { data, isLoading, isError, error } = usePayments(queryParams);
  const { data: completedCountData } = usePayments({ status: "completed", page: 1, limit: 1 });
  const { data: failedCountData } = usePayments({ status: "failed", page: 1, limit: 1 });
  const { data: refundedCountData } = usePayments({ status: "refunded", page: 1, limit: 1 });

  const {
    data: allFilteredPayments,
    isLoading: isAllFilteredLoading,
    isError: isAllFilteredError,
    error: allFilteredError,
  } = useQuery({
    queryKey: ["payments-visible-all", page, limit],
    enabled: activeStatus === "all",
    queryFn: async () => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const collected: PaymentListItem[] = [];

      let backendPage = 1;
      let backendTotalPages = 1;

      while (backendPage <= backendTotalPages && collected.length < endIndex) {
        const response = await getPayments({ page: backendPage, limit });
        const visibleItems = extractPaymentItems(response).filter(
          (payment) => payment.status && isPaymentStatus(payment.status) && PAYMENT_STATUS_TABS.includes(payment.status),
        );

        collected.push(...visibleItems);

        const responseMeta = response.meta as { totalPages?: number } | undefined;
        if (typeof responseMeta?.totalPages === "number") {
          backendTotalPages = responseMeta.totalPages;
        } else {
          const responseTotal = extractPaymentTotal(response);
          const responseLimit = extractPaymentLimit(response) ?? limit;
          backendTotalPages = responseLimit > 0 ? Math.max(1, Math.ceil(responseTotal / responseLimit)) : 1;
        }

        backendPage += 1;
      }

      return collected.slice(startIndex, endIndex);
    },
  });

  const payments = useMemo(() => extractPaymentItems(data), [data]);
  const filteredPayments = useMemo(
    () => payments.filter((payment) => payment.status && isPaymentStatus(payment.status) && PAYMENT_STATUS_TABS.includes(payment.status)),
    [payments],
  );
  const currentPage = extractPaymentPage(data) ?? page;
  const currentLimit = extractPaymentLimit(data) ?? limit;
  const currentTotal = extractPaymentTotal(data);

  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
      cancelled: 0,
    };

    counts.completed = extractPaymentTotal(completedCountData);
    counts.failed = extractPaymentTotal(failedCountData);
    counts.refunded = extractPaymentTotal(refundedCountData);

    return counts;
  }, [completedCountData, failedCountData, refundedCountData]);

  const totalVisiblePayments = useMemo(
    () => PAYMENT_STATUS_TABS.reduce((sum, status) => sum + statusCounts[status], 0),
    [statusCounts],
  );

  const displayedPayments = activeStatus === "all" ? allFilteredPayments ?? [] : filteredPayments;
  const tableCurrentPage = activeStatus === "all" ? page : currentPage;
  const tablePageSize = activeStatus === "all" ? limit : currentLimit;
  const tableTotal = activeStatus === "all" ? totalVisiblePayments : currentTotal;
  const tableIsLoading = activeStatus === "all" ? isAllFilteredLoading : isLoading;
  const tableErrorMessage = activeStatus === "all"
    ? allFilteredError instanceof Error
      ? allFilteredError.message
      : undefined
    : error?.message;
  const tableIsError = activeStatus === "all" ? isAllFilteredError : isError;

  const handleStatusTabChange = (key: string) => {
    if (key === "all" || isPaymentStatus(key)) {
      setActiveStatus(key);
      setPage(1);
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
      width: 160,
      render: (paymentReference?: string) => (
        <span className="font-mono text-xs text-muted whitespace-nowrap">{paymentReference || "-"}</span>
      ),
    },
    {
      title: t("invoiceNumber"),
      key: "invoiceNumber",
      width: 300,
      render: (_: unknown, record) => {
        const invoiceNumber = record.invoice?.invoiceNumber;
        return <span className="font-medium">{invoiceNumber || "-"}</span>;
      },
    },
    {
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 60,
      render: (paymentMethod?: string | null) => <Tag>{getMethodLabel(paymentMethod)}</Tag>,
    },
    {
      title: t("paymentDate"),
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 240,
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
    { key: "all", label: `${t("all")} (${totalVisiblePayments})` },
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

      {tableIsError && (
        <Alert
          type="error"
          showIcon
          title={t("loadError")}
          description={tableErrorMessage}
        />
      )}

      <Tabs
        activeKey={activeStatus}
        onChange={handleStatusTabChange}
        items={tabItems}
      />

      {displayedPayments.length === 0 && !tableIsLoading ? (
        <Empty description={t("empty")} className="py-10" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={displayedPayments}
          loading={tableIsLoading}
          scroll={screens.md ? undefined : { x: 760 }}
          pagination={{
            current: tableCurrentPage,
            pageSize: tablePageSize,
            total: tableTotal,
            showSizeChanger: false,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              if (nextPageSize && nextPageSize !== limit) {
                setLimit(nextPageSize);
              }
            },
          }}
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
