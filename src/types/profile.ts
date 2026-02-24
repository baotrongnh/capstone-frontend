import { ActorType } from "./auth";
import { ApartmentStatus } from "./apartment";

// ========== Core Profile Types ==========

export type ProfileNavItem = {
    key: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    roles: ActorType[];
}

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    actorType: ActorType;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ========== Rental & Contract Types ==========

export type RentalContract = {
    id: string;
    apartmentId: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    status: 'active' | 'expired' | 'terminated';
    contractUrl?: string;
}

// ========== Utility Types ==========

export type MeterReading = {
    id: string;
    meterType: 'electricity' | 'water';
    currentReading: number;
    previousReading: number;
    readingDate: string;
    unitPrice: number;
    totalCost: number;
}

export type UserApartment = {
    id: string;
    buildingName: string;
    apartmentNumber: string;
    address: string;
    city: string;
    district: string;
    totalArea: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    status: ApartmentStatus;
    images: string[] | null;
    baseRentPrice: number;
    // Rental contract
    contract?: RentalContract;
    // Utility information
    electricityMeter?: MeterReading;
    waterMeter?: MeterReading;
    // Latest utility readings
    currentElectricReading: number;
    previousElectricReading: number;
    currentWaterReading: number;
    previousWaterReading: number;
    electricityUnitPrice: number;
    waterUnitPrice: number;
}

// ========== Payment Types ==========

export enum PaymentType {
    RENT = 'rent',
    ELECTRICITY = 'electricity',
    WATER = 'water',
    MAINTENANCE = 'maintenance',
    DEPOSIT = 'deposit',
    OTHER = 'other'
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export type PaymentHistory = {
    id: string;
    apartmentId: string;
    apartmentName: string;
    paymentType: PaymentType;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: PaymentStatus;
    transactionId?: string;
    description?: string;
    invoiceUrl?: string;
}

// ========== Component Props Types ==========

export type ProfileSidebarProps = {
    userId: string;
    actorType: ActorType;
    onLogout: () => void;
}

export type ProfileLayoutProps = {
    userId: string;
    actorType?: ActorType;
    children: React.ReactNode;
}

export type AccountInformationProps = {
    profile: UserProfile;
    onUpdate?: (values: Partial<UserProfile>) => Promise<void>;
}

export type MyApartmentProps = {
    apartment?: UserApartment;
    loading?: boolean;
}

export type PaymentHistoryProps = {
    payments?: PaymentHistory[];
    loading?: boolean;
}

// ========== Page Props Types ==========

export type ProfilePageProps = {
    params: Promise<{ id: string }>;
}

export type AccountPageProps = {
    params: Promise<{ id: string }>;
}

export type MyApartmentPageProps = {
    params: Promise<{ id: string }>;
}

export type PaymentHistoryPageProps = {
    params: Promise<{ id: string }>;
}

export type SettingsPageProps = {
    params: Promise<{ id: string }>;
}
