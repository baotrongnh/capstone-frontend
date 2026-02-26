'use client';

import { Form, Input, Button, Avatar, Upload, message } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AccountInformationProps, UserProfile } from '@/types/profile';
import { useTranslations } from 'next-intl';

export default function AccountInformation({ profile, onUpdate }: AccountInformationProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar);
    const t = useTranslations('Profile.account');

    const handleSubmit = async (values: Partial<UserProfile>) => {
        try {
            setLoading(true);
            if (onUpdate) {
                await onUpdate(values);
                message.success(t('updateSuccess'));
            }
        } catch {
            message.error(t('updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        // TODO: Implement avatar upload logic
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                setAvatarUrl(result);
            }
        };
        reader.readAsDataURL(file);
        return false;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">
                    {profile.actorType === 'user' ? t('title') : t('titlePartner')}
                </h2>
                <p className="mt-1 text-sm text-muted">
                    {profile.actorType === 'user'
                        ? t('subtitle')
                        : t('subtitlePartner')}
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
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-sm text-muted">{profile.email}</p>
                    {profile.actorType !== 'user' && (
                        <p className="text-xs text-muted mt-1">
                            {t('accountType')}: <span className="font-medium uppercase">{profile.actorType}</span>
                        </p>
                    )}
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    address: profile.address
                }}
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    label={t('fullName')}
                    name="name"
                    rules={[{ required: true, message: t('fullNameRequired') }]}
                >
                    <Input size="large" placeholder={t('fullNamePlaceholder')} />
                </Form.Item>

                <Form.Item
                    label={t('emailAddress')}
                    name="email"
                    rules={[
                        { required: true, message: t('emailRequired') },
                        { type: 'email', message: t('emailInvalid') }
                    ]}
                >
                    <Input size="large" placeholder={t('emailPlaceholder')} disabled />
                </Form.Item>

                <Form.Item
                    label={t('phoneNumber')}
                    name="phone"
                    rules={[{ required: false }]}
                >
                    <Input size="large" placeholder={t('phoneNumberPlaceholder')} />
                </Form.Item>

                <Form.Item
                    label={t('address')}
                    name="address"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder={t('addressPlaceholder')}
                        size="large"
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 pt-4">
                    <Button size="large" onClick={() => form.resetFields()}>
                        {t('cancel')}
                    </Button>
                    <Button type="primary" size="large" htmlType="submit" loading={loading}>
                        {t('saveChanges')}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
