'use client';

import { useVietnamBanks, useVerifyIdentity } from '@/hooks/query/useUser';
import { IdentityVerificationFormValues, ModalIdentityCardProps, VerifyIdentityErrorResponse } from '@/types/user';
import { InboxOutlined } from '@ant-design/icons';
import { Alert, App, Button, Form, Input, Modal, Select, Spin, Upload } from 'antd';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const BANK_ACCOUNT_PATTERN = /^\d{6,19}$/;

const normalizeBankAccount = (value?: string) => value?.replace(/\s+/g, '').trim() ?? '';
const revokePreviewUrl = (url?: string) => {
    if (url) {
        URL.revokeObjectURL(url);
    }
};

export default function ModalIdentityCard({ open, onClose }: ModalIdentityCardProps) {
    const t = useTranslations('Profile.account');
    const { message } = App.useApp();
    const { mutateAsync: verifyIdentity } = useVerifyIdentity();
    const { data: banks = [], isLoading: banksLoading, isError: banksError } = useVietnamBanks();
    const [form] = Form.useForm<IdentityVerificationFormValues>();

    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [frontUrl, setFrontUrl] = useState<string | undefined>(undefined);
    const [backUrl, setBackUrl] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [aiErrorSides, setAiErrorSides] = useState<{ front: boolean; back: boolean } | null>(null);
    const watchedBankName = Form.useWatch('bankName', form);
    const watchedBankAccount = Form.useWatch('bankAccount', form);

    const bankOptions = useMemo(
        () =>
            banks.map((bank) => ({
                value: bank.shortName,
                label: bank.shortName,
                fullName: bank.name,
                logo: bank.logo,
                code: bank.code,
                searchText: `${bank.shortName} ${bank.name} ${bank.code}`.toLowerCase(),
            })),
        [banks],
    );

    const isFormReady =
        !!frontFile &&
        !!backFile &&
        !!watchedBankName &&
        BANK_ACCOUNT_PATTERN.test(normalizeBankAccount(watchedBankAccount));

    const handleFrontUpload = (file: File) => {
        revokePreviewUrl(frontUrl);
        setFrontFile(file);
        setFrontUrl(URL.createObjectURL(file));
        setAiErrorSides(prev => prev ? { ...prev, front: false } : null);
        return false;
    };

    const handleBackUpload = (file: File) => {
        revokePreviewUrl(backUrl);
        setBackFile(file);
        setBackUrl(URL.createObjectURL(file));
        setAiErrorSides(prev => prev ? { ...prev, back: false } : null);
        return false;
    };

    const resetModalState = () => {
        revokePreviewUrl(frontUrl);
        revokePreviewUrl(backUrl);
        setFrontFile(null);
        setBackFile(null);
        setFrontUrl(undefined);
        setBackUrl(undefined);
        setAiErrorSides(null);
        form.resetFields();
    };

    const handleSubmit = async () => {
        if (!frontFile) {
            message.warning(t('cccdFrontRequired'));
            return;
        }
        if (!backFile) {
            message.warning(t('cccdBackRequired'));
            return;
        }
        const values = await form.validateFields().catch(() => null);
        if (!values) {
            return;
        }
        const bankAccount = normalizeBankAccount(values.bankAccount);
        setSubmitting(true);
        setAiErrorSides(null);
        try {
            const result = await verifyIdentity({
                identityCardFront: frontFile,
                identityCardBack: backFile,
                bankName: values.bankName!,
                bankAccount,
            });
            const { front, back } = result.aiVerification;
            if (!front.success || !back.success) {
                setAiErrorSides({ front: !front.success, back: !back.success });
                return;
            }
            message.success(t('cccdUploadSuccess'));
            resetModalState();
            onClose();
        } catch (error) {
            const axiosError = error as AxiosError<VerifyIdentityErrorResponse>;
            const statusCode = axiosError?.response?.status;
            const backendMessage = axiosError?.response?.data?.message;

            if (statusCode === 409 && backendMessage) {
                message.error(backendMessage);
            } else {
                message.error(backendMessage || t('cccdUploadFailed'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        resetModalState();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-base">{t('cccdTitle')}</span>
                </div>
            }
            footer={[
                <Button key="cancel" size="large" onClick={handleClose}>
                    {t('cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!isFormReady || banksLoading}
                >
                    {submitting ? t('cccdAiVerifying') : t('cccdUploadSubmit')}
                </Button>,
            ]}
            width={720}
            centered
        >
            <p className="mb-4 text-sm text-gray-500">{t('cccdSubtitle')}</p>
            {aiErrorSides && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-4"
                    title={t('cccdAiCheckFailedTitle')}
                    description={
                        <div>
                            <p>
                                {aiErrorSides.front && aiErrorSides.back
                                    ? t('cccdAiBothFailed')
                                    : aiErrorSides.front
                                        ? t('cccdAiFrontFailed')
                                        : t('cccdAiBackFailed')}
                            </p>
                            <p className="mt-1">{t('cccdAiRetryHint')}</p>
                        </div>
                    }
                />
            )}
            <Form form={form} layout="vertical" requiredMark={false}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-2 text-center text-sm font-medium">{t('cccdFront')}</p>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <Upload
                                accept="image/jpeg,image/png,image/webp"
                                showUploadList={false}
                                beforeUpload={handleFrontUpload}
                                style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
                            >
                                <div className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${frontUrl ? 'border-transparent' : 'border-gray-300 bg-gray-100 hover:border-primary hover:bg-blue-50'}`}>
                                    {frontUrl ? (
                                        <>
                                            <Image
                                                src={frontUrl}
                                                alt={t('cccdFront')}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="absolute inset-0 h-full w-full rounded-xl object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                                                <p className="text-sm font-semibold text-white">{t('cccdReplaceImage')}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                                            <InboxOutlined className="text-4xl text-gray-400" />
                                            <p className="text-sm font-medium text-gray-600">{t('cccdUploadText')}</p>
                                            <p className="text-xs text-gray-400">{t('cccdUploadHint')}</p>
                                        </div>
                                    )}
                                </div>
                            </Upload>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-center text-sm font-medium">{t('cccdBack')}</p>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <Upload
                                accept="image/jpeg,image/png,image/webp"
                                showUploadList={false}
                                beforeUpload={handleBackUpload}
                                style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
                            >
                                <div className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${backUrl ? 'border-transparent' : 'border-gray-300 bg-gray-100 hover:border-primary hover:bg-blue-50'}`}>
                                    {backUrl ? (
                                        <>
                                            <Image
                                                src={backUrl}
                                                alt={t('cccdBack')}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="absolute inset-0 h-full w-full rounded-xl object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                                                <p className="text-sm font-semibold text-white">{t('cccdReplaceImage')}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                                            <InboxOutlined className="text-4xl text-gray-400" />
                                            <p className="text-sm font-medium text-gray-600">{t('cccdUploadText')}</p>
                                            <p className="text-xs text-gray-400">{t('cccdUploadHint')}</p>
                                        </div>
                                    )}
                                </div>
                            </Upload>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800">{t('bankSectionTitle')}</p>
                        <p className="mt-1 text-xs text-gray-500">{t('bankSectionHint')}</p>
                    </div>
                    {banksError && (
                        <Alert
                            type="warning"
                            showIcon
                            className="mb-4"
                            message={t('bankListLoadFailed')}
                        />
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Form.Item
                            label={t('bankName')}
                            name="bankName"
                            rules={[{ required: true, message: t('bankNameRequired') }]}
                        >
                            <Select
                                size="large"
                                showSearch
                                placeholder={t('bankNamePlaceholder')}
                                loading={banksLoading}
                                disabled={banksLoading || banksError}
                                options={bankOptions}
                                optionFilterProp="searchText"
                                filterOption={(input, option) =>
                                    (option?.searchText as string | undefined)?.includes(input.toLowerCase()) ?? false
                                }
                                optionRender={(option) => {
                                    const optionData = option.data as {
                                        label: string;
                                        fullName: string;
                                        logo: string;
                                    };

                                    return (
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                                                <Image
                                                    src={optionData.logo}
                                                    alt={optionData.label}
                                                    fill
                                                    unoptimized
                                                    sizes="24px"
                                                    className="object-contain p-0.5"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-800">{optionData.label}</p>
                                                <p className="truncate text-xs text-gray-500">{optionData.fullName}</p>
                                            </div>
                                        </div>
                                    );
                                }}
                                notFoundContent={
                                    banksLoading ? <Spin size="small" /> : t('bankNotFound')
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('bankAccountNumber')}
                            name="bankAccount"
                            normalize={normalizeBankAccount}
                            rules={[
                                { required: true, message: t('bankAccountNumberRequired') },
                                {
                                    validator: (_, value) => {
                                        const normalizedValue = normalizeBankAccount(value);
                                        if (!normalizedValue) {
                                            return Promise.resolve();
                                        }

                                        if (!BANK_ACCOUNT_PATTERN.test(normalizedValue)) {
                                            return Promise.reject(new Error(t('bankAccountNumberInvalid')));
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                inputMode="numeric"
                                maxLength={19}
                                placeholder={t('bankAccountNumberPlaceholder')}
                            />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
