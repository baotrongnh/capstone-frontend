"use client";

import { Form, Input, Button, Avatar, Spin, Upload, App, Tag } from "antd";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";
import {
  UserOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AccountEditableValues, AccountUpdateDto } from "@/types/profile";
import { useTranslations } from "next-intl";
import ModalIdentityCard from "@/components/modal/modal-identity-card";
import {
  displayText,
  formatDateTime,
  getAvatarUrl,
  getIdentityFields,
  getUserEditableValues,
  hasValue,
  toText,
} from "@/utils/account-information";
import { useAuthStore } from "@/stores/auth.store";
import { useUserProfile, useUpdateUser, useVietnamBanks } from "@/hooks/query/useUser";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const tokens = useAuthStore((s) => s.tokens);
  const setAuth = useAuthStore((s) => s.setAuth);
  const id = user?.id ?? "";
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [cccdModalOpen, setCccdModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showIdentityInfo, setShowIdentityInfo] = useState(false);
  const { message } = App.useApp();
  const t = useTranslations("Profile.account");

  console.log(user)
  const {
    data: profile,
    isLoading,
    isError,
    isPending,
    isFetching,
  } = useUserProfile();
  const { data: banks = [] } = useVietnamBanks();

  const { mutateAsync: updateUser } = useUpdateUser(id);

  useEffect(() => {
    if (!profile) {
      return;
    }

    if (tokens) {
      setAuth(profile, tokens);
    }
    setAvatarUrl(getAvatarUrl(profile));
    setHasChanges(false);
    setIsEditing(false);
    setShowIdentityInfo(false);
  }, [profile, tokens, setAuth]);

  const handleUpdate = async (values: AccountUpdateDto) => {
    if (!id) {
      throw new Error("Missing user id");
    }
    await updateUser(values);
  };

  const showLoading =
    !isHydrated || (isAuthenticated && (isLoading || isPending || isFetching));

  if (showLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="py-20 text-center text-muted">
        Unable to load account information.
      </div>
    );
  }

  const identity = profile.identity;
  const editableValues: AccountEditableValues = getUserEditableValues(profile);

  const identityFields = getIdentityFields(identity, t);
  const matchedBank = banks.find(
    (bank) =>
      bank.shortName?.toLowerCase() === profile.bankName?.toLowerCase() ||
      bank.code?.toLowerCase() === profile.bankName?.toLowerCase() ||
      bank.name?.toLowerCase() === profile.bankName?.toLowerCase(),
  );
  const hasBankInfo = hasValue(profile.bankName) || hasValue(profile.bankAccountNumber);
  const hasVerificationInfo =
    identityFields.some(({ value }) => hasValue(value)) ||
    hasBankInfo ||
    hasValue(identity?.verifiedAt);

  const startEditing = () => {
    form.setFieldsValue(editableValues);
    setHasChanges(false);
    setIsEditing(true);
  };

  const handleSubmit = async (values: AccountUpdateDto) => {
    try {
      setSubmitting(true);
      await handleUpdate(values);
      setIsEditing(false);
      setHasChanges(false);
      message.success(t("updateSuccess"));
    } catch {
      message.error(t("updateFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarUploading(true);
      const { url } = await uploadFile(file);
      setAvatarUrl(url);
      await handleUpdate({ profileImageUrl: url });
    } catch {
      message.error(t("updateFailed"));
    } finally {
      setAvatarUploading(false);
    }

    return false;
  };

  const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
    const changed = Object.entries(editableValues).some(([key, initialValue]) => {
      const nextValue = toText(allValues[key]);
      return toText(initialValue) !== nextValue;
    });

    setHasChanges(changed);
  };

  const handleCancel = () => {
    form.resetFields();
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-muted">
        <div className="relative w-25 h-25">
          <Spin spinning={avatarUploading}>
            <Avatar
              size={100}
              src={avatarUrl}
              icon={<UserOutlined />}
              className="bg-primary"
            />
          </Spin>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleAvatarUpload}
            disabled={avatarUploading}
            className="absolute inset-0"
          >
            <button
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              disabled={avatarUploading}
            >
              <CameraOutlined style={{ color: "white" }} />
            </button>
          </Upload>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{displayText(profile.fullName)}</h3>
          <p className="text-sm text-muted">{displayText(profile.email)}</p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={getUserEditableValues(profile)}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={t("fullName")}
            name={isEditing ? "fullName" : undefined}
            rules={isEditing ? [{ required: true, message: t("fullNameRequired") }] : undefined}
          >
            {isEditing ? (
              <Input size="large" placeholder={t("fullNamePlaceholder")} />
            ) : (
              <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{displayText(profile.fullName)}</span>
            )}
          </Form.Item>

          <Form.Item label={t("emailAddress")}>
            <span className="block py-2.5 text-[15px] text-gray-400 border-b border-gray-200">{displayText(profile.email)}</span>
          </Form.Item>

          <Form.Item
            label={t("phoneNumber")}
            name={isEditing ? "phone" : undefined}
          >
            {isEditing ? (
              <Input size="large" placeholder={t("phoneNumberPlaceholder")} />
            ) : (
              <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{displayText(profile.phone)}</span>
            )}
          </Form.Item>

          <Form.Item
            label={t("emergencyContactName")}
            name={isEditing ? "emergencyContactName" : undefined}
          >
            {isEditing ? (
              <Input size="large" placeholder={t("emergencyContactNamePlaceholder")} />
            ) : (
              <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{displayText(profile.emergencyContactName)}</span>
            )}
          </Form.Item>

          <Form.Item
            label={t("emergencyContactPhone")}
            name={isEditing ? "emergencyContactPhone" : undefined}
          >
            {isEditing ? (
              <Input size="large" placeholder={t("emergencyContactPhonePlaceholder")} />
            ) : (
              <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{displayText(profile.emergencyContactPhone)}</span>
            )}
          </Form.Item>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-base">{t("cccdTitle")}</h3>
              <p className="text-xs text-muted mt-0.5">{t("cccdSubtitle")}</p>
            </div>
            {identity?.isVerified && <Tag icon={<CheckCircleOutlined />} color="success">{t("verified")}</Tag>}
          </div>
          <div className="flex items-center gap-2">
            {identity && (
              <Button
                type="text"
                icon={showIdentityInfo ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowIdentityInfo((prev) => !prev)}
              >
                {showIdentityInfo ? t("hideIdentityInfo") : t("showIdentityInfo")}
              </Button>
            )}
            {!identity?.isVerified && (
              <Button type="primary" onClick={() => setCccdModalOpen(true)}>
                {t("cccdUploadSubmit")}
              </Button>
            )}
          </div>
        </div>

        {showIdentityInfo && identity && hasVerificationInfo && (
          <div className="border border-gray-200 rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-sm text-gray-700">{t("identityInfoTitle")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {identityFields.map(({ key, label, value }) => {
                if (!hasValue(value)) {
                  return null;
                }

                return (
                  <div key={key}>
                    <p className="text-xs text-muted mb-0.5">{label}</p>
                    <p className="font-medium text-sm">{displayText(value)}</p>
                  </div>
                );
              })}
              {hasBankInfo && (
                <div className="md:col-span-2">
                  <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-slate-50 via-white to-blue-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                          {matchedBank?.logo ? (
                            <Image
                              src={matchedBank.logo}
                              alt={matchedBank.shortName || displayText(profile.bankName)}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-semibold text-blue-700">
                              {displayText(profile.bankName).slice(0, 3)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-500">
                            {t("bankName")}
                          </p>
                          <p className="truncate text-base font-semibold text-gray-900">
                            {displayText(profile.bankName)}
                          </p>
                          {matchedBank?.name && matchedBank.name !== profile.bankName && (
                            <p className="truncate text-xs text-gray-500">{matchedBank.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm sm:min-w-55">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                          {t("bankAccountNumber")}
                        </p>
                        <p className="mt-1 break-all text-lg font-semibold tracking-[0.02em] text-gray-900">
                          {displayText(profile.bankAccountNumber)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {hasValue(identity.verifiedAt) && (
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("idVerifiedAt")}</p>
                  <p className="font-medium text-sm">{formatDateTime(identity.verifiedAt)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {isEditing ? (
            <>
              <Button size="large" onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button type="primary" size="large" htmlType="submit" loading={submitting} disabled={!hasChanges}>
                {t("saveChanges")}
              </Button>
            </>
          ) : (
            <Button type="primary" size="large" onClick={startEditing}>
              {t("edit")}
            </Button>
          )}
        </div>
      </Form>

      <ModalIdentityCard
        open={cccdModalOpen}
        onClose={() => setCccdModalOpen(false)}
        identity={identity ?? undefined}
      />
    </div>
  );
}
