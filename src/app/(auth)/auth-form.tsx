"use client"

import { ApiErrorResponse, AuthFormProps, LoginDTO, RegisterDto } from "@/types/auth";
import { App, Button, Divider, Form, Input } from "antd";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AuthForm({
  form,
  onSubmit,
  onRegister,
  t: tProp,
  loading,
  registerLoading,
  onGoogleLogin,
  googleLoading,
}: AuthFormProps) {
  const { message } = App.useApp();
  const tHook = useTranslations('Auth');
  const t = tProp || tHook;
  const [mode, setMode] = useState<"login" | "register">("login");

  const switchMode = (next: "login" | "register") => {
    form.resetFields();
    setMode(next);
  };

  const handleFinish = async (values: LoginDTO & RegisterDto) => {
    try {
      if (mode === "login") {
        if (onSubmit) {
          await onSubmit({ identifier: values.identifier, password: values.password })
        }
      } else {
        if (onRegister) {
          await onRegister(values)
        }
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      if (apiError?.response) return

      message.error(mode === 'login' ? t('loginFailed') : t('registrationFailed'));
    }
  };

  const handleFinishFailed = () => {
    message.error(t('checkFormFields'));
  };

  const isLoading = mode === "login" ? loading : registerLoading;

  return (
    <div className="flex flex-col justify-center items-center">

      <p className="text-3xl font-semibold mb-6">
        {mode === 'login' ? t('welcome') : (
          <>{t('joinIntelliServOps')} <span className="text-primary">IntelliServOps</span></>
        )}
      </p>

      <Button
        variant="outlined"
        color="blue"
        size="large"
        className="w-sm flex justify-center items-center mb-4"
        onClick={onGoogleLogin}
        loading={googleLoading}
        disabled={googleLoading}
      >
        {!googleLoading && (
          <Image src='/google.svg' alt="Google icon" width={20} height={20} />
        )}
        <p className="font-semibold">
          {mode === 'login' ? t('signInWithGoogle') : t('signUpWithGoogle')}
        </p>
      </Button>

      <Divider plain size="small">
        <p className="text-muted text-xs">
          {mode === 'login' ? t('orSignInWithEmail') : t('orSignUpWithEmail')}
        </p>
      </Divider>

      <Form
        form={form}
        name={mode}
        layout="vertical"
        style={{ width: 384, maxWidth: 800, marginTop: 16, gap: 20 }}
        initialValues={{}}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        {mode === "login" ? (
          <>
            <Form.Item
              label={<span className="font-semibold">{t('identifier')}</span>}
              name="identifier"
              rules={[{ required: true, message: t('identifierRequired') }]}
              style={{ marginBottom: 20 }}
            >
              <Input placeholder={t('identifierPlaceholder')} style={{ height: 45, padding: 10 }} />
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
          </>
        ) : (
          <>
            <Form.Item
              label={<span className="font-semibold">{t('fullName')}</span>}
              name="fullName"
              rules={[{ required: true, message: t('fullNameRequired') }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder={t('fullNamePlaceholder')} style={{ height: 45, padding: 10 }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">{t('emailAddress')}</span>}
              name="email"
              rules={[
                { required: true, message: t('emailRequired') },
                { type: "email", message: t('emailInvalid') },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder={t('emailPlaceholder')} style={{ height: 45, padding: 10 }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">{t('phoneNumber')}</span>}
              name="phone"
              rules={[
                { required: true, message: t('phoneRequired') },
                { pattern: /^(0|\+84)\d{9}$/, message: t('phoneInvalid') },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder={t('phonePlaceholder')} style={{ height: 45, padding: 10 }} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">{t('password')}</span>}
              name="password"
              rules={[
                { required: true, message: t('passwordRequired') },
                { min: 8, message: t('passwordMinLength') },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input.Password placeholder={t('passwordPlaceholder')} style={{ height: 45, padding: 10 }} />
            </Form.Item>
          </>
        )}

        <Form.Item label={null} style={{ marginBottom: 15 }}>
          <Button type="primary" htmlType="submit" size="large" className="w-full" loading={isLoading}>
            <p className="font-bold">{mode === "login" ? t('login') : t('register')}</p>
          </Button>
        </Form.Item>

        {mode === "login" ? (
          <span>
            {t('doNotHaveAccount')}{" "}
            <Button type="link" onClick={() => switchMode("register")}>
              <p className="font-bold">{t('register')}</p>
            </Button>
          </span>
        ) : (
          <span>
            {t('alreadyHaveAccount')}{" "}
            <Button type="link" onClick={() => switchMode("login")}>
              <p className="font-bold">{t('login')}</p>
            </Button>
          </span>
        )}
      </Form>
    </div>
  );
}
