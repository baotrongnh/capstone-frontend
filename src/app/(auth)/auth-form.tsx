"use client"

import { AuthFormProps, Login, Register } from "@/types/auth";
import { Button, Checkbox, Divider, Form, Input, message } from "antd";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AuthForm({ form, onSubmit, t: tProp }: AuthFormProps) {
  const tHook = useTranslations('Auth');
  const t = tProp || tHook;
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleFinish = async (values: Login | Register) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        console.log("Form values:", values);

      }
    } catch {
      //TODO
    }
  };

  const handleFinishFailed = () => {
    message.error(t('checkFormFields'));
  };

  return (
    <div className="flex flex-col justify-center items-center">

      <p className="text-3xl font-semibold mb-6">
        {mode === 'login' ? t('welcome') : (
          <>
            {t('joinIntelliServOps')} <span className="text-primary">IntelliServOps</span>
          </>
        )}
      </p>

      <Button variant="outlined" color="blue" size="large" className="w-sm flex justify-center items-center mb-4">
        <Image
          src='/google.svg'
          alt="Google icon"
          width={20}
          height={20}
        />
        <p className="font-semibold">{mode === 'login' ? t('signInWithGoogle') : t('signUpWithGoogle')}</p>
      </Button>

      <Divider plain size="small">
        <p className="text-muted text-xs">{mode === 'login' ? t('orSignInWithEmail') : t('orSignUpWithEmail')}</p>
      </Divider>

      <Form
        form={form}
        name={mode === "login" ? "login" : "register"}
        layout="vertical"
        style={{ width: 384, maxWidth: 800, marginTop: 16, gap: 20 }}
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        {mode === "register" && (
          <Form.Item
            label={<span className="font-semibold">{t('fullName')}</span>}
            name="name"
            rules={[{ required: true, message: t('fullNameRequired') }]}
            style={{ marginBottom: 20 }}
          >
            <Input placeholder={t('fullNamePlaceholder')} style={{ height: 45, padding: 10 }} />
          </Form.Item>
        )}

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
          label={<span className="font-semibold">{t('password')}</span>}
          name="password"
          rules={[
            { required: true, message: t('passwordRequired') },
            { min: 6, message: t('passwordMinLength') },
          ]}
          style={{ marginBottom: 20 }}
        >
          <Input.Password placeholder={t('passwordPlaceholder')} style={{ height: 45, padding: 10 }} />
        </Form.Item>

        {mode === "login" && (
          <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            style={{ marginBottom: 20 }}
          >
            <Checkbox>{t('rememberMe')}</Checkbox>
          </Form.Item>
        )}

        <Form.Item
          label={null}
          style={{ marginBottom: 20 }}
        >
          <Button type="primary" htmlType="submit" size="large" className="w-full">
            <p className="font-bold">{mode === "login" ? t('login') : t('register')}</p>
          </Button>
        </Form.Item>


        {mode === "login" ? (
          <span>
            {t('doNotHaveAccount')}{" "}
            <Button type="link" onClick={() => setMode("register")}>
              <p className="font-bold">{t('register')}</p>
            </Button>
          </span>
        ) : (
          <span>
            {t('alreadyHaveAccount')}{" "}
            <Button type="link" onClick={() => setMode("login")}>
              <p className="font-bold">{t('login')}</p>
            </Button>
          </span>
        )}

        {mode !== 'login' &&
          <p className="text-xs text-muted mt-4">{t('termsText')}
            {" "}<span className="text-primary">{t('termsOfService')}</span> {t('and')}
            <span className="text-primary"> {t('privacyPolicy')}</span>.
          </p>
        }
      </Form>
    </div>
  );
}
