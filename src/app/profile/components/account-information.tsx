'use client';

import { Form, Input, Button, Avatar, Spin, Upload, App, Tag } from 'antd';
import { uploadFile } from '@/utils/uploadFile';
import { UserOutlined, CameraOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ActorType } from '@/types/auth';
import { UserDetail, UpdateUserDto } from '@/types/user';
import { PartnerDetail } from '@/types/partner';
import { AccountInformationProps } from '@/types/profile';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import ModalIdentityCard from '@/components/modal/modalIdentityCard';

function isPartnerDetail(profile: UserDetail | PartnerDetail, actorType: ActorType): profile is PartnerDetail {
    return actorType === ActorType.PARTNER;
}

export default function AccountInformation({ profile, actorType, onUpdate, loading: externalLoading }: AccountInformationProps) {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
        'profileImageUrl' in profile ? profile.profileImageUrl : undefined
    );
    const identity = !('companyName' in profile) ? (profile as UserDetail).identity : undefined;
    const isPartner = isPartnerDetail(profile, actorType);
    const [cccdModalOpen, setCccdModalOpen] = useState(false);
    const { message } = App.useApp();
    const t = useTranslations('Profile.account');

    const handleSubmit = async (values: UpdateUserDto) => {
        try {
            setSubmitting(true);
            if (onUpdate) {
                await onUpdate(values);
                message.success(t('updateSuccess'));
            }
        } catch {
            message.error(t('updateFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        try {
            setAvatarUploading(true);
            const { url } = await uploadFile(file);
            setAvatarUrl(url);
            if (onUpdate) {
                await onUpdate({ profileImageUrl: url });
            }
        } catch {
            message.error(t('updateFailed'));
        } finally {
            setAvatarUploading(false);
        }
        return false;
    };

    const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
        const initVals = isPartner
            ? {
                fullName: profile.fullName,
                phone: profile.phone,
                companyName: (profile as PartnerDetail).companyName,
                taxCode: (profile as PartnerDetail).taxCode,
                nationalId: (profile as PartnerDetail).nationalId,
                bankAccountNumber: (profile as PartnerDetail).bankAccountNumber,
                bankName: (profile as PartnerDetail).bankName,
                address: (profile as PartnerDetail).address,
            }
            : {
                fullName: profile.fullName,
                phone: profile.phone,
                emergencyContactName: (profile as UserDetail).emergencyContactName,
                emergencyContactPhone: (profile as UserDetail).emergencyContactPhone,
            };

        const changed = Object.keys(initVals).some((key) => {
            const initial = initVals[key as keyof typeof initVals];
            const current = allValues[key];
            return (initial ?? '') !== (current ?? '');
        });
        setHasChanges(changed);
    };

    const handleCancel = () => {
        form.resetFields();
        setHasChanges(false);
    };

    if (externalLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">
                    {actorType === ActorType.USER ? t('title') : t('titlePartner')}
                </h2>
                <p className="mt-1 text-sm text-muted">
                    {actorType === ActorType.USER ? t('subtitle') : t('subtitlePartner')}
                </p>
            </div>

            <div className="flex items-center gap-6 pb-6 border-b border-muted">
                <div className="relative">
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
                    >
                        <button
                            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={avatarUploading}
                        >
                            <CameraOutlined className="text-muted" />
                        </button>
                    </Upload>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                    <p className="text-sm text-muted">{profile.email}</p>
                    {actorType !== ActorType.USER && (
                        <p className="text-xs text-muted mt-1">
                            {t('accountType')}: <span className="font-medium uppercase">{actorType}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* ── USER FORM ── */}
            {!isPartner && (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        fullName: profile.fullName,
                        email: profile.email,
                        phone: profile.phone,
                        emergencyContactName: (profile as UserDetail).emergencyContactName,
                        emergencyContactPhone: (profile as UserDetail).emergencyContactPhone,
                    }}
                    onFinish={handleSubmit}
                    onValuesChange={handleValuesChange}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label={t('fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('fullNameRequired') }]}
                        >
                            <Input size="large" placeholder={t('fullNamePlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            label={t('emailAddress')}
                            name="email"
                            rules={[
                                { required: true, message: t('emailRequired') },
                                { type: 'email', message: t('emailInvalid') },
                            ]}
                        >
                            <Input size="large" placeholder={t('emailPlaceholder')} disabled />
                        </Form.Item>

                        <Form.Item label={t('phoneNumber')} name="phone">
                            <Input size="large" placeholder={t('phoneNumberPlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('emergencyContactName')} name="emergencyContactName">
                            <Input size="large" placeholder={t('emergencyContactNamePlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('emergencyContactPhone')} name="emergencyContactPhone">
                            <Input size="large" placeholder={t('emergencyContactPhonePlaceholder')} />
                        </Form.Item>
                    </div>

                    {/* ── CCCD / Identity Verification ── */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="font-semibold text-base">{t('cccdTitle')}</h3>
                                <p className="text-xs text-muted mt-0.5">{t('cccdSubtitle')}</p>
                            </div>
                            {identity?.isVerified && <Tag icon={<CheckCircleOutlined />} color="success">{t('verified')}</Tag>}
                        </div>
                        {!identity?.isVerified &&
                            <Button type="primary" onClick={() => setCccdModalOpen(true)}>
                                {t('cccdUploadSubmit')}
                            </Button>}
                    </div>

                    {/* ── Extracted Identity Info ── */}
                    {identity && (identity.nationalId || identity.name || identity.sex || identity.nationality) && (
                        <div className="border border-gray-200 rounded-xl p-5 space-y-4">
                            <h4 className="font-semibold text-sm text-gray-700">{t('identityInfoTitle')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                {identity.nationalId && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('nationalId')}</p>
                                        <p className="font-medium text-sm">{identity.nationalId}</p>
                                    </div>
                                )}
                                {identity.name && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idName')}</p>
                                        <p className="font-medium text-sm">{identity.name}</p>
                                    </div>
                                )}
                                {identity.dob && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idDob')}</p>
                                        <p className="font-medium text-sm">{identity.dob}</p>
                                    </div>
                                )}
                                {identity.sex && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idSex')}</p>
                                        <p className="font-medium text-sm">{identity.sex}</p>
                                    </div>
                                )}
                                {identity.nationality && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idNationality')}</p>
                                        <p className="font-medium text-sm">{identity.nationality}</p>
                                    </div>
                                )}
                                {identity.ethnicity && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idEthnicity')}</p>
                                        <p className="font-medium text-sm">{identity.ethnicity}</p>
                                    </div>
                                )}
                                {identity.home && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idHome')}</p>
                                        <p className="font-medium text-sm">{identity.home}</p>
                                    </div>
                                )}
                                {identity.address && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idAddress')}</p>
                                        <p className="font-medium text-sm">{identity.address}</p>
                                    </div>
                                )}
                                {identity.features && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idFeatures')}</p>
                                        <p className="font-medium text-sm">{identity.features}</p>
                                    </div>
                                )}
                                {identity.issueDate && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idIssueDate')}</p>
                                        <p className="font-medium text-sm">{identity.issueDate}</p>
                                    </div>
                                )}
                                {identity.doe && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idExpiry')}</p>
                                        <p className="font-medium text-sm">{identity.doe}</p>
                                    </div>
                                )}
                                {identity.verifiedAt && (
                                    <div>
                                        <p className="text-xs text-muted mb-0.5">{t('idVerifiedAt')}</p>
                                        <p className="font-medium text-sm">{dayjs(identity.verifiedAt).format('DD/MM/YYYY HH:mm')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        {hasChanges && (
                            <Button size="large" onClick={handleCancel}>
                                {t('cancel')}
                            </Button>
                        )}
                        <Button type="primary" size="large" htmlType="submit" loading={submitting} disabled={!hasChanges}>
                            {t('saveChanges')}
                        </Button>
                    </div>
                </Form>
            )}

            {/* ── PARTNER FORM ── */}
            {isPartner && (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        fullName: profile.fullName,
                        email: profile.email,
                        phone: profile.phone,
                        companyName: (profile as PartnerDetail).companyName,
                        taxCode: (profile as PartnerDetail).taxCode,
                        nationalId: (profile as PartnerDetail).nationalId,
                        bankAccountNumber: (profile as PartnerDetail).bankAccountNumber,
                        bankName: (profile as PartnerDetail).bankName,
                        address: (profile as PartnerDetail).address,
                    }}
                    onFinish={handleSubmit}
                    onValuesChange={handleValuesChange}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label={t('fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('fullNameRequired') }]}
                        >
                            <Input size="large" placeholder={t('fullNamePlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            label={t('emailAddress')}
                            name="email"
                            rules={[
                                { required: true, message: t('emailRequired') },
                                { type: 'email', message: t('emailInvalid') },
                            ]}
                        >
                            <Input size="large" placeholder={t('emailPlaceholder')} disabled />
                        </Form.Item>

                        <Form.Item label={t('phoneNumber')} name="phone">
                            <Input size="large" placeholder={t('phoneNumberPlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('companyName')} name="companyName">
                            <Input size="large" placeholder={t('companyNamePlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('taxCode')} name="taxCode">
                            <Input size="large" placeholder={t('taxCodePlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('nationalId')} name="nationalId">
                            <Input size="large" placeholder={t('nationalIdPlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('bankAccountNumber')} name="bankAccountNumber">
                            <Input size="large" placeholder={t('bankAccountNumberPlaceholder')} />
                        </Form.Item>

                        <Form.Item label={t('bankName')} name="bankName">
                            <Input size="large" placeholder={t('bankNamePlaceholder')} />
                        </Form.Item>
                    </div>

                    <Form.Item label={t('address')} name="address">
                        <Input.TextArea rows={3} size="large" placeholder={t('addressPlaceholder')} />
                    </Form.Item>

                    {/* Read-only contract info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                        <div>
                            <p className="text-xs text-muted mb-1">{t('commissionRate')}</p>
                            <p className="font-medium">{(profile as PartnerDetail).commissionRate}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted mb-1">{t('contractStartDate')}</p>
                            <p className="font-medium">
                                {(profile as PartnerDetail).contractStartDate
                                    ? dayjs((profile as PartnerDetail).contractStartDate).format('DD/MM/YYYY')
                                    : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted mb-1">{t('contractEndDate')}</p>
                            <p className="font-medium">
                                {(profile as PartnerDetail).contractEndDate
                                    ? dayjs((profile as PartnerDetail).contractEndDate).format('DD/MM/YYYY')
                                    : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {hasChanges && (
                            <Button size="large" onClick={handleCancel}>
                                {t('cancel')}
                            </Button>
                        )}
                        <Button type="primary" size="large" htmlType="submit" loading={submitting} disabled={!hasChanges}>
                            {t('saveChanges')}
                        </Button>
                    </div>
                </Form>
            )}
            <ModalIdentityCard
                open={cccdModalOpen}
                onClose={() => setCccdModalOpen(false)}
                identity={identity}
            />
        </div>
    );
}
