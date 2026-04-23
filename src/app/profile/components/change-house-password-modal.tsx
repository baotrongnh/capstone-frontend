import { Form, Input, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { ChangeHousePasswordFormValues, ChangeHousePasswordModalProps } from '@/types/userApartment'

export function ChangeHousePasswordModal({
    open,
    isSubmitting,
    isFirstPassSetup = false,
    onClose,
    onSubmit,
}: ChangeHousePasswordModalProps) {
    const t = useTranslations('Profile.apartment')
    const [form] = Form.useForm<ChangeHousePasswordFormValues>()

    const handleClose = () => {
        if (isFirstPassSetup) {
            return
        }

        form.resetFields()
        onClose()
    }

    const handleFinish = (values: ChangeHousePasswordFormValues) => {
        const newPin = values.newPassword.trim()
        const oldPin = values.oldPassword?.trim()

        if (!isFirstPassSetup && oldPin === newPin) {
            form.setFields([
                {
                    name: 'newPassword',
                    errors: [t('housePasswordModal.validation.newDifferentOld')],
                },
            ])
            return
        }

        onSubmit(
            isFirstPassSetup
                ? { newPin }
                : { oldPin, newPin },
        )
    }

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText={isFirstPassSetup ? t('housePasswordModal.firstPassSubmit') : t('housePasswordModal.submit')}
            cancelText={t('housePasswordModal.cancel')}
            title={isFirstPassSetup ? t('housePasswordModal.firstPassTitle') : t('housePasswordModal.title')}
            confirmLoading={isSubmitting}
            width={520}
            centered
            destroyOnHidden
            closable={!isFirstPassSetup}
            maskClosable={!isFirstPassSetup}
            keyboard={!isFirstPassSetup}
            styles={{
                header: { borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 4 },
                footer: { borderTop: '1px solid #f1f5f9', paddingTop: 14, marginTop: 10 },
            }}
            okButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
            cancelButtonProps={{
                style: {
                    borderRadius: 8,
                    display: isFirstPassSetup ? 'none' : 'inline-flex',
                },
            }}
        >
            <p className="mb-4 text-sm text-slate-500">
                {isFirstPassSetup
                    ? t('housePasswordModal.firstPassDescription')
                    : t('housePasswordModal.description')}
            </p>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
            >
                {!isFirstPassSetup && (
                    <Form.Item
                        name="oldPassword"
                        label={t('housePasswordModal.oldPassword')}
                        rules={[
                            { required: true, message: t('housePasswordModal.validation.oldRequired') },
                            {
                                pattern: /^\d{6}$/,
                                message: t('housePasswordModal.validation.format'),
                            },
                        ]}
                    >
                        <Input.Password
                            size="large"
                            placeholder={t('housePasswordModal.oldPasswordPlaceholder')}
                            autoComplete="current-password"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    name="newPassword"
                    label={t('housePasswordModal.newPassword')}
                    rules={[
                        { required: true, message: t('housePasswordModal.validation.newRequired') },
                        {
                            pattern: /^\d{6}$/,
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
