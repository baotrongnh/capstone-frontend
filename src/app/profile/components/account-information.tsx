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
    const [localProfile, setLocalProfile] = useState<UserDetail | PartnerDetail>(profile);
    const [cccdModalOpen, setCccdModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { message } = App.useApp();
    const t = useTranslations('Profile.account');

    const handleSubmit = async (values: UpdateUserDto) => {
        try {
            setSubmitting(true);
            if (onUpdate) {
                await onUpdate(values);
                setLocalProfile(prev => ({ ...prev, ...values }));
                setIsEditing(false);
                setHasChanges(false);
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
                fullName: localProfile.fullName,
                phone: localProfile.phone,
                companyName: (localProfile as PartnerDetail).companyName,
                taxCode: (localProfile as PartnerDetail).taxCode,
                nationalId: (localProfile as PartnerDetail).nationalId,
                bankAccountNumber: (localProfile as PartnerDetail).bankAccountNumber,
                bankName: (localProfile as PartnerDetail).bankName,
                address: (localProfile as PartnerDetail).address,
            }
            : {
                fullName: localProfile.fullName,
                phone: localProfile.phone,
                emergencyContactName: (localProfile as UserDetail).emergencyContactName,
                emergencyContactPhone: (localProfile as UserDetail).emergencyContactPhone,
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
        setIsEditing(false);
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
                            <CameraOutlined style={{ color: 'white' }} />
                        </button>
                    </Upload>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{localProfile.fullName}</h3>
                    <p className="text-sm text-muted">{localProfile.email}</p>
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
                            name={isEditing ? 'fullName' : undefined}
                            rules={isEditing ? [{ required: true, message: t('fullNameRequired') }] : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('fullNamePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{localProfile.fullName || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item label={t('emailAddress')}>
                            <span className="block py-2.5 text-[15px] text-gray-400 border-b border-gray-200">{localProfile.email || '—'}</span>
                        </Form.Item>

                        <Form.Item
                            label={t('phoneNumber')}
                            name={isEditing ? 'phone' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('phoneNumberPlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{localProfile.phone || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('emergencyContactName')}
                            name={isEditing ? 'emergencyContactName' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('emergencyContactNamePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as UserDetail).emergencyContactName || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('emergencyContactPhone')}
                            name={isEditing ? 'emergencyContactPhone' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('emergencyContactPhonePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as UserDetail).emergencyContactPhone || '—'}</span>
                            }
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
                        {isEditing ? (
                            <>
                                <Button size="large" onClick={handleCancel}>
                                    {t('cancel')}
                                </Button>
                                <Button type="primary" size="large" htmlType="submit" loading={submitting} disabled={!hasChanges}>
                                    {t('saveChanges')}
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" size="large" onClick={() => {
                                form.setFieldsValue({
                                    fullName: localProfile.fullName,
                                    phone: localProfile.phone,
                                    emergencyContactName: (localProfile as UserDetail).emergencyContactName,
                                    emergencyContactPhone: (localProfile as UserDetail).emergencyContactPhone,
                                });
                                setIsEditing(true);
                            }}>
                                {t('edit')}
                            </Button>
                        )}
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
                            name={isEditing ? 'fullName' : undefined}
                            rules={isEditing ? [{ required: true, message: t('fullNameRequired') }] : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('fullNamePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{localProfile.fullName || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item label={t('emailAddress')}>
                            <span className="block py-2.5 text-[15px] text-gray-400 border-b border-gray-200">{localProfile.email || '—'}</span>
                        </Form.Item>

                        <Form.Item
                            label={t('phoneNumber')}
                            name={isEditing ? 'phone' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('phoneNumberPlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{localProfile.phone || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('companyName')}
                            name={isEditing ? 'companyName' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('companyNamePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as PartnerDetail).companyName || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('taxCode')}
                            name={isEditing ? 'taxCode' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('taxCodePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as PartnerDetail).taxCode || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('nationalId')}
                            name={isEditing ? 'nationalId' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('nationalIdPlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as PartnerDetail).nationalId || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('bankAccountNumber')}
                            name={isEditing ? 'bankAccountNumber' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('bankAccountNumberPlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as PartnerDetail).bankAccountNumber || '—'}</span>
                            }
                        </Form.Item>

                        <Form.Item
                            label={t('bankName')}
                            name={isEditing ? 'bankName' : undefined}
                        >
                            {isEditing
                                ? <Input size="large" placeholder={t('bankNamePlaceholder')} />
                                : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200">{(localProfile as PartnerDetail).bankName || '—'}</span>
                            }
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={t('address')}
                        name={isEditing ? 'address' : undefined}
                    >
                        {isEditing
                            ? <Input.TextArea rows={3} size="large" placeholder={t('addressPlaceholder')} />
                            : <span className="block py-2.5 text-[15px] text-gray-800 border-b border-gray-200 whitespace-pre-wrap">{(localProfile as PartnerDetail).address || '—'}</span>
                        }
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
                        {isEditing ? (
                            <>
                                <Button size="large" onClick={handleCancel}>
                                    {t('cancel')}
                                </Button>
                                <Button type="primary" size="large" htmlType="submit" loading={submitting} disabled={!hasChanges}>
                                    {t('saveChanges')}
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" size="large" onClick={() => {
                                form.setFieldsValue({
                                    fullName: localProfile.fullName,
                                    phone: localProfile.phone,
                                    companyName: (localProfile as PartnerDetail).companyName,
                                    taxCode: (localProfile as PartnerDetail).taxCode,
                                    nationalId: (localProfile as PartnerDetail).nationalId,
                                    bankAccountNumber: (localProfile as PartnerDetail).bankAccountNumber,
                                    bankName: (localProfile as PartnerDetail).bankName,
                                    address: (localProfile as PartnerDetail).address,
                                });
                                setIsEditing(true);
                            }}>
                                {t('edit')}
                            </Button>
                        )}
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
