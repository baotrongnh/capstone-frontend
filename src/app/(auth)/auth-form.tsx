"use client"

import { ActorType, AuthFormProps, LoginDto } from "@/types/auth";
import { Button, Divider, Form, Input, Select, message } from "antd";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AuthForm({ form, onSubmit, t: tProp, loading }: AuthFormProps) {
  const tHook = useTranslations('Auth');
  const t = tProp || tHook;

  const handleFinish = async (values: LoginDto) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  const handleFinishFailed = () => {
    message.error(t('checkFormFields'));
  };

  const actorTypeOptions = [
    { value: ActorType.USER, label: t('actorTypeGuest') },
    { value: ActorType.PARTNER, label: t('actorTypePartner') },
  ];

  return (
    <div className="flex flex-col justify-center items-center">

      <p className="text-3xl font-semibold mb-6">{t('welcome')}</p>

      <Button variant="outlined" color="blue" size="large" className="w-sm flex justify-center items-center mb-4">
        <Image
          src='/google.svg'
          alt="Google icon"
          width={20}
          height={20}
        />
        <p className="font-semibold">{t('signInWithGoogle')}</p>
      </Button>

      <Divider plain size="small">
        <p className="text-muted text-xs">{t('orSignInWithEmail')}</p>
      </Divider>

      <Form
        form={form}
        name="login"
        layout="vertical"
        style={{ width: 384, maxWidth: 800, marginTop: 16, gap: 20 }}
        initialValues={{ actorType: ActorType.USER }}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<span className="font-semibold">{t('actorType')}</span>}
          name="actorType"
          rules={[{ required: true, message: t('actorTypeRequired') }]}
          style={{ marginBottom: 20 }}
        >
          <Select options={actorTypeOptions} size="large" />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">{t('emailAddress')}</span>}
          name="email"
          rules={[
            { required: true, message: t('emailRequired') },
            { type: "email", message: t('emailInvalid') },
          ]}
          style={{ marginBottom: 20 }}
        >
          <Input placeholder={t('emailPlaceholder')} style={{ height: 45, padding: 10 }} />
        </Form.Item>

        <Form.Item
          label={
            <div className="flex justify-between items-center" style={{ minWidth: 356 }}>
              <span className="font-semibold">{t('password')}</span>
              <Button type="link" size="small" className="p-0 h-auto font-semibold">
                {t('forgotPassword')}
              </Button>
            </div>
          }
          name="password"
          rules={[
            { required: true, message: t('passwordRequired') },
            { min: 6, message: t('passwordMinLength') },
          ]}
          style={{ marginBottom: 20 }}
          className="[&_.ant-form-item-label>label]:w-full [&_.ant-form-item-label>label]:after:hidden"
        >
          <Input.Password placeholder={t('passwordPlaceholder')} style={{ height: 45, padding: 10 }} />
        </Form.Item>

        <Form.Item
          label={null}
          style={{ marginBottom: 20 }}
        >
          <Button type="primary" htmlType="submit" size="large" className="w-full" loading={loading}>
            <p className="font-bold">{t('login')}</p>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
