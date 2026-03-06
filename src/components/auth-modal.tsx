import AuthForm from "@/app/(auth)/auth-form";
import { ROUTES } from "@/constants/routes";
import { useGoogleLogin, useLogin, useRegister } from "@/hooks/query/useAuth";
import { AuthModal as AuthModalProps } from "@/types/auth";
import { Form, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [form] = Form.useForm();

  const { mutateAsync: login, isPending } = useLogin(() => {
    onClose();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      router.push(ROUTES.PROFILE(user.id));
    }
  });

  const { mutateAsync: register, isPending: isRegisterPending } = useRegister(
    () => {
      onClose();
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        router.push(ROUTES.PROFILE(user.id));
      }
    },
  );

  const handleGoogleSuccess = () => {
    onClose();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      router.push(ROUTES.PROFILE(user.id));
    }
  };

  const { login: googleLogin, loading: googleLoginLoading } =
    useGoogleLogin(handleGoogleSuccess);

  const handleSubmit = async (values: Parameters<typeof login>[0]) => {
    try {
      await login(values);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRegister = async (values: Parameters<typeof register>[0]) => {
    try {
      await register(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="75%"
      centered
      destroyOnHidden
      className="max-w-250"
      wrapClassName="auth-modal"
    >
      <div className="flex flex-col md:flex-row overflow-hidden rounded-md h-163.75">
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/img/auth/authModal.png"
            alt="Auth Modal Image"
            width={500}
            height={600}
            className="object-cover w-full h-full"
          />

          <div className="absolute top-8 left-10 flex justify-center items-center">
            <Image src="/img/auth/logo.png" alt="Logo" width={50} height={32} />
            <h1 className="text-2xl font-bold text-blue-950">IntelliServOps</h1>
          </div>

          <div className="absolute bg-white shadow-2xl p-7 pr-10 top-30 left-10 flex flex-col justify-center items-start gap-6">
            <Image
              src="/loginIcon1.svg"
              alt="Login Icon"
              width={73}
              height={57}
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-xl font-bold text-blue-950">{t("realTime")}</p>
              <p className="text-base text-muted">{t("utilityMonitoring")}</p>
            </div>
          </div>

          <div className="absolute bg-white shadow-2xl p-5 pr-10 pb-6.5 bottom-20 right-10 flex flex-col justify-center items-start gap-6">
            <div className="absolute right-8 -top-8 rounded-full">
              <Image
                src="/img/auth/loginUserDemo.jpg"
                alt="Login User"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <Image
                src="/quotation.svg"
                alt="Login User"
                width={28}
                height={28}
              />
              <div className="mt-3 mb-3.5">
                <p className="text-sm text-gray-600 font-semibold">
                  {t("tenantName")}
                </p>
                <p className="text-sm text-gray-400">{t("tenantRole")}</p>
              </div>

              <p
                className="text-base font-semibold pl-7"
                dangerouslySetInnerHTML={{ __html: `"${t("testimonial")}"` }}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-8 flex justify-center items-center h-full overflow-y-auto">
          <AuthForm
            form={form}
            onSubmit={handleSubmit}
            onRegister={handleRegister}
            t={t}
            loading={isPending}
            registerLoading={isRegisterPending}
            onGoogleLogin={googleLogin}
            googleLoading={googleLoginLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
