import { FormInstance } from "antd";

export type AuthModal = {
    open: boolean;
    onClose: () => void;
}

export type Login = {
    email: string,
    password: string
}

export type Register = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}


export type AuthFormProps = {
    form: FormInstance,
    onSubmit?: (values: Login | Register) => void | Promise<void>;
    t?: (key: string) => string;
}