'use client';

import ProfileLayout from '../components/profile-layout';
import { ActorType } from '@/types/auth';
import { Form, Input, Switch, Button, Divider, Select } from 'antd';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
    const [form] = Form.useForm();
    const t = useTranslations('Profile.settings');

    const handleSubmit = async (values: Record<string, unknown>) => {
        console.log('Saving settings:', values);
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <ProfileLayout actorType={ActorType.USER}>
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
                        emailNotifications: true,
                        smsNotifications: false,
                        marketingEmails: true,
                        language: 'en',
                        currency: 'USD',
                        timezone: 'UTC'
                    }}
                >
                    <Divider orientationMargin={0}>{t('notifications')}</Divider>

                    <Form.Item
                        name="emailNotifications"
                        label={t('emailNotifications')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="smsNotifications"
                        label={t('smsNotifications')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="marketingEmails"
                        label={t('marketingEmails')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Divider orientationMargin={0}>{t('preferences')}</Divider>

                    <Form.Item name="language" label={t('language')}>
                        <Select size="large">
                            <Select.Option value="en">{t('languages.en')}</Select.Option>
                            <Select.Option value="vi">{t('languages.vi')}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="currency" label={t('currency')}>
                        <Select size="large">
                            <Select.Option value="USD">{t('currencies.usd')}</Select.Option>
                            <Select.Option value="VND">{t('currencies.vnd')}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="timezone" label={t('timezone')}>
                        <Select size="large">
                            <Select.Option value="UTC">{t('timezones.utc')}</Select.Option>
                            <Select.Option value="Asia/Ho_Chi_Minh">{t('timezones.asiaHoChiMinh')}</Select.Option>
                            <Select.Option value="America/New_York">{t('timezones.americaNewYork')}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Divider orientationMargin={0}>{t('security')}</Divider>

                    <Form.Item
                        name="currentPassword"
                        label={t('currentPassword')}
                    >
                        <Input.Password size="large" placeholder={t('currentPasswordPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label={t('newPassword')}
                    >
                        <Input.Password size="large" placeholder={t('newPasswordPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={t('confirmPassword')}
                    >
                        <Input.Password size="large" placeholder={t('confirmPasswordPlaceholder')} />
                    </Form.Item>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button size="large" onClick={() => form.resetFields()}>
                            {t('reset')}
                        </Button>
                        <Button type="primary" size="large" htmlType="submit">
                            {t('saveSettings')}
                        </Button>
                    </div>
                </Form>
            </div>
        </ProfileLayout>
    );
}
