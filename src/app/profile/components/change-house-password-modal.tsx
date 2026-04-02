import { Form, Input, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { ChangeHousePasswordFormValues, ChangeHousePasswordModalProps } from '@/types/userApartment'

export function ChangeHousePasswordModal({
    open,
    isSubmitting,
    currentPassword,
    onClose,
    onSubmit,
}: ChangeHousePasswordModalProps) {
    const t = useTranslations('Profile.apartment')
    const [form] = Form.useForm<ChangeHousePasswordFormValues>()

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    const handleFinish = (values: ChangeHousePasswordFormValues) => {
        const oldPassword = values.oldPassword.trim()
        const newPassword = values.newPassword.trim()

        if (currentPassword && oldPassword !== currentPassword) {
            form.setFields([
                {
                    name: 'oldPassword',
                    errors: [t('housePasswordModal.validation.oldMismatch')],
                },
            ])
            return
        }

        if (oldPassword === newPassword) {
            form.setFields([
                {
                    name: 'newPassword',
                    errors: [t('housePasswordModal.validation.newDifferentOld')],
                },
            ])
            return
        }

        onSubmit(newPassword)
    }

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText={t('housePasswordModal.submit')}
            cancelText={t('housePasswordModal.cancel')}
            title={t('housePasswordModal.title')}
            confirmLoading={isSubmitting}
            width={520}
            centered
            destroyOnHidden
            styles={{
                header: { borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 4 },
                footer: { borderTop: '1px solid #f1f5f9', paddingTop: 14, marginTop: 10 },
            }}
            okButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
            cancelButtonProps={{ style: { borderRadius: 8 } }}
        >
            <p className="mb-4 text-sm text-slate-500">{t('housePasswordModal.description')}</p>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
            >
                <Form.Item
                    name="oldPassword"
                    label={t('housePasswordModal.oldPassword')}
                    rules={[
                        { required: true, message: t('housePasswordModal.validation.oldRequired') },
                    ]}
                >
                    <Input.Password
                        size="large"
                        placeholder={t('housePasswordModal.oldPasswordPlaceholder')}
                        autoComplete="current-password"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t('housePasswordModal.newPassword')}
                    rules={[
                        { required: true, message: t('housePasswordModal.validation.newRequired') },
                        {
                            pattern: /^\d{4,12}$/,
                            message: t('housePasswordModal.validation.format'),
                        },
                    ]}
                >
                    <Input.Password
                        size="large"
                        placeholder={t('housePasswordModal.newPasswordPlaceholder')}
                        autoComplete="new-password"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmNewPassword"
                    label={t('housePasswordModal.confirmPassword')}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: t('housePasswordModal.validation.confirmRequired') },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve()
                                }

                                return Promise.reject(new Error(t('housePasswordModal.validation.confirmMismatch')))
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        size="large"
                        placeholder={t('housePasswordModal.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
