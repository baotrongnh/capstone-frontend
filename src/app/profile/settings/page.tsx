'use client';

import { APP_NAME } from '@/constants';
import { useChangePassword } from '@/hooks/query/useAuth';
import type { ProfileSettingsFormValues } from '@/types/profile';
import { App, Button, Divider, Form, Input, Select } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
    const [form] = Form.useForm<ProfileSettingsFormValues>();
    const t = useTranslations('Profile.settings');
    const locale = useLocale();
    const router = useRouter();
    const { message } = App.useApp();
    const { mutateAsync: changePassword, isPending } = useChangePassword(() => {
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    });

    const selectedLanguage: ProfileSettingsFormValues['language'] = locale === 'en' ? 'en' : 'vi';

    useEffect(() => {
        form.setFieldValue('language', selectedLanguage);
    }, [form, selectedLanguage]);

    const toTrimmedValue = (value?: string) => value?.trim() ?? '';

    const getSettingsSavedMessage = () => {
        try {
            return t('settingsSaved');
        } catch {
            return t('saveSettings');
        }
    };

    const hasAnyPasswordValue = () => {
        const currentPassword = toTrimmedValue(form.getFieldValue('currentPassword'));
        const newPassword = toTrimmedValue(form.getFieldValue('newPassword'));
        const confirmPassword = toTrimmedValue(form.getFieldValue('confirmPassword'));

        return Boolean(currentPassword || newPassword || confirmPassword);
    };

    const handleSubmit = async (values: ProfileSettingsFormValues) => {
        const nextLocale = values.language ?? selectedLanguage;
        const currentPassword = toTrimmedValue(values.currentPassword);
        const newPassword = toTrimmedValue(values.newPassword);
        const confirmPassword = toTrimmedValue(values.confirmPassword);
        const shouldChangePassword = Boolean(currentPassword || newPassword || confirmPassword);

        if (shouldChangePassword) {
            if (currentPassword === newPassword) {
                message.error(t('newPasswordDifferentCurrent'));
                return;
            }

            try {
                await changePassword({ currentPassword, newPassword });
            } catch {
                return;
            }
        }

        if (nextLocale !== selectedLanguage) {
            document.cookie = `${APP_NAME}_LOCALE=${nextLocale}; path=/`;
            message.success(getSettingsSavedMessage());
            window.setTimeout(() => {
                router.refresh();
            }, 300);
            return;
        }

        if (!shouldChangePassword) {
            message.success(getSettingsSavedMessage());
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">
                    {t('subtitle')}
                </p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    language: selectedLanguage,
                }}
            >
                <Divider style={{ margin: 0 }} >{t('preferences')}</Divider>

                <Form.Item name="language" label={t('language')}>
                    <Select size="large">
                        <Select.Option value="en">{t('languages.en')}</Select.Option>
                        <Select.Option value="vi">{t('languages.vi')}</Select.Option>
                    </Select>
                </Form.Item>

                <Divider style={{ margin: 0 }}>{t('security')}</Divider>

                <Form.Item
                    name="currentPassword"
                    label={t('currentPassword')}
                    dependencies={['newPassword', 'confirmPassword']}
                    rules={[
                        () => ({
                            validator(_, value) {
                                const trimmedValue = value?.trim();

                                if (!hasAnyPasswordValue() && !trimmedValue) {
                                    return Promise.resolve();
                                }

                                if (!trimmedValue) {
                                    return Promise.reject(new Error(t('currentPasswordRequired')));
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder={t('currentPasswordPlaceholder')} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t('newPassword')}
                    dependencies={['currentPassword', 'confirmPassword']}
                    rules={[
                        () => ({
                            validator(_, value) {
                                const trimmedValue = value?.trim();

                                if (!hasAnyPasswordValue() && !trimmedValue) {
                                    return Promise.resolve();
                                }

                                if (!trimmedValue) {
                                    return Promise.reject(new Error(t('newPasswordRequired')));
                                }

                                if (trimmedValue.length < 8) {
                                    return Promise.reject(new Error(t('newPasswordMinLength')));
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder={t('newPasswordPlaceholder')} />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={t('confirmPassword')}
                    dependencies={['newPassword', 'currentPassword']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const trimmedValue = value?.trim();
                                const newPassword = getFieldValue('newPassword')?.trim();

                                if (!hasAnyPasswordValue() && !trimmedValue) {
                                    return Promise.resolve();
                                }

                                if (!trimmedValue) {
                                    return Promise.reject(new Error(t('confirmPasswordRequired')));
                                }

                                if (!newPassword || newPassword !== trimmedValue) {
                                    return Promise.reject(new Error(t('passwordMismatch')));
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder={t('confirmPasswordPlaceholder')} />
                </Form.Item>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        size="large"
                        onClick={() => form.resetFields()}
                    >
                        {t('reset')}
                    </Button>
                    <Button type="primary" size="large" htmlType="submit" loading={isPending}>
                        {t('saveSettings')}
                    </Button>
                </div>
            </Form>
        </div >
    );
}
