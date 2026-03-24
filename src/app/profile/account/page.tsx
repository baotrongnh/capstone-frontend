"use client";

import { Form, Input, Button, Avatar, Spin, Upload, App, Tag } from "antd";
import { uploadFile } from "@/utils/uploadFile";
import { UserOutlined, CameraOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
import { useUserProfile, useUpdateUser } from "@/hooks/query/useUser";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const id = user?.id ?? "";
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [cccdModalOpen, setCccdModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { message } = App.useApp();
  const t = useTranslations("Profile.account");

  const {
    data: profile,
    isLoading,
    isError,
  } = useUserProfile();

  const { mutateAsync: updateUser } = useUpdateUser(id);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setAvatarUrl(getAvatarUrl(profile));
    setHasChanges(false);
    setIsEditing(false);
  }, [profile]);

  const handleUpdate = async (values: AccountUpdateDto) => {
    if (!id) {
      throw new Error("Missing user id");
    }
    await updateUser(values);
  };

  if (isLoading) {
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
          {!identity?.isVerified && (
            <Button type="primary" onClick={() => setCccdModalOpen(true)}>
              {t("cccdUploadSubmit")}
            </Button>
          )}
        </div>

        {identity && identityFields.some(({ value }) => hasValue(value)) && (
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
