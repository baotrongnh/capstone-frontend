import {
    AlertOutlined,
    AppstoreOutlined,
    BulbOutlined,
    LockOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { IotDeviceTopic } from "@/types/userApartment";

export const DEFAULT_IOT_TOPIC_ICON = AppstoreOutlined;

export const IOT_TOPIC_ICON_MAP: Record<
    IotDeviceTopic,
    ComponentType<{ className?: string }>
> = {
    alarm: AlertOutlined,
    light: BulbOutlined,
    curtain: AppstoreOutlined,
    door: LockOutlined,
    unknown: DEFAULT_IOT_TOPIC_ICON,
};
