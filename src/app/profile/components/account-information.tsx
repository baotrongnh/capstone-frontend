'use client';

import { Form, Input, Button, Avatar, DatePicker, Spin, Upload, App, Tag } from 'antd';
import { UserOutlined, CameraOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
        'profileImageUrl' in profile ? profile.profileImageUrl : undefined
    );
    const identity = !('companyName' in profile) ? (profile as UserDetail).identity : undefined;
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

    const handleAvatarUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') setAvatarUrl(result);
        };
        reader.readAsDataURL(file);
        return false;
    };

    if (externalLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    const isPartner = isPartnerDetail(profile, actorType);

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
                    <Avatar
                        size={100}
                        src={avatarUrl}
                        icon={<UserOutlined />}
                        className="bg-primary"
                    />
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={handleAvatarUpload}
                    >
                        <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
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
                        dateOfBirth: (profile as UserDetail).dateOfBirth ? dayjs((profile as UserDetail).dateOfBirth) : undefined,
                        passportNumber: identity?.passportNumber,
                        emergencyContactName: (profile as UserDetail).emergencyContactName,
                        emergencyContactPhone: (profile as UserDetail).emergencyContactPhone,
                    }}
                    onFinish={handleSubmit}
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

                        <Form.Item label={t('dateOfBirth')} name="dateOfBirth">
                            <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item label={t('passportNumber')} name="passportNumber">
                            <Input size="large" placeholder={t('passportNumberPlaceholder')} />
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
                            {identity?.isVerified ? (
                                <Tag icon={<CheckCircleOutlined />} color="success">{t('verified')}</Tag>
                            ) : (
                                <Tag icon={<ClockCircleOutlined />} color="warning">{t('pendingVerification')}</Tag>
                            )}
                        </div>
                        <Button type="primary" onClick={() => setCccdModalOpen(true)}>
                            {t('cccdUploadSubmit')}
                        </Button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button size="large" onClick={() => form.resetFields()}>
                            {t('cancel')}
                        </Button>
                        <Button type="primary" size="large" htmlType="submit" loading={submitting}>
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
                        <Button size="large" onClick={() => form.resetFields()}>
                            {t('cancel')}
                        </Button>
                        <Button type="primary" size="large" htmlType="submit" loading={submitting}>
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
