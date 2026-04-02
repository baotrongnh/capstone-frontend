import { Card, Descriptions, Tag } from "antd";
import type { useTranslations } from "next-intl";

import {
  formatLocaleDateTime,
  toDisplayText,
  toFiniteNumber,
} from "@/utils/format";
import { formatPaymentAmount } from "@/utils/payment";
import type { OwnerApartmentItem } from "./types";

type TranslationFn = ReturnType<typeof useTranslations>;

type AdditionalInfoCardProps = {
  apartment?: OwnerApartmentItem;
  t: TranslationFn;
};

const formatFurnishing = (value: unknown, t: TranslationFn) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "-";
  }

  const normalized = value.toLowerCase();

  if (normalized === "fully_furnished") {
    return t("furnishing.fully_furnished");
  }

  if (normalized === "semi_furnished") {
    return t("furnishing.semi_furnished");
  }

  if (normalized === "unfurnished") {
    return t("furnishing.unfurnished");
  }

  return value.replace(/_/g, " ");
};

export function AdditionalInfoCard({ apartment, t }: AdditionalInfoCardProps) {
  const cooperationContracts = apartment?.cooperationContracts ?? [];

  return (
    <Card className="border-slate-200 bg-white" title={t("additionalInfo")}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label={t("apartmentId")}>
          {toDisplayText(apartment?.id)}
        </Descriptions.Item>
        <Descriptions.Item label={t("floorNumber")}>
          {toDisplayText(apartment?.floorNumber)}
        </Descriptions.Item>
        <Descriptions.Item label={t("newWardCode")}>
          {toDisplayText(apartment?.wardCode)}
        </Descriptions.Item>

        <Descriptions.Item label={t("statusLabel")}>
          {toDisplayText(apartment?.status)}
        </Descriptions.Item>
        <Descriptions.Item label={t("rating")}>
          {toDisplayText(apartment?.rating)}
        </Descriptions.Item>

        <Descriptions.Item label={t("address")}>
          {toDisplayText(apartment?.streetAddress)}
        </Descriptions.Item>

        <Descriptions.Item label={t("furnishingStatus")}>
          {formatFurnishing(apartment?.furnishingStatus, t)}
        </Descriptions.Item>
        <Descriptions.Item label={t("depositAmount")}>
          {apartment?.depositAmount
            ? formatPaymentAmount(toFiniteNumber(apartment.depositAmount), "vi")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label={t("totalArea")}>
          {apartment?.totalArea ? `${apartment.totalArea} m²` : "-"}
        </Descriptions.Item>

        <Descriptions.Item label={t("bedrooms")}>
          {toDisplayText(apartment?.numberOfBedrooms)}
        </Descriptions.Item>
        <Descriptions.Item label={t("bathrooms")}>
          {toDisplayText(apartment?.numberOfBathrooms)}
        </Descriptions.Item>
        <Descriptions.Item label={t("rentPrice")}>
          {formatPaymentAmount(toFiniteNumber(apartment?.baseRentPrice), "vi")}
        </Descriptions.Item>

        <Descriptions.Item label={t("createdAt")}>
          {formatLocaleDateTime(apartment?.createdAt, "vi")}
        </Descriptions.Item>
        <Descriptions.Item label={t("updatedAt")}>
          {formatLocaleDateTime(apartment?.updatedAt, "vi")}
        </Descriptions.Item>

        <Descriptions.Item label={t("description")}>
          {toDisplayText(apartment?.description)}
        </Descriptions.Item>

        <Descriptions.Item label={t("amenities")}>
          <div className="flex flex-wrap gap-2">
            {cooperationContracts.length > 0
              ? cooperationContracts.map((contract) => (
                  <Tag key={contract.id} color="cyan">
                    {toDisplayText(contract.status)}
                  </Tag>
                ))
              : "-"}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label={t("roomsCount")}>
          {cooperationContracts.length}
        </Descriptions.Item>
        <Descriptions.Item label={t("iotDevicesCount")}>
          {apartment?.images?.length ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label={t("utilityMetersCount")}>0</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
