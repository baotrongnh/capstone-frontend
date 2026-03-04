// ========== Partner API Types ==========

export type PartnerDetail = {
    id: string;
    email: string;
    phone: string;
    fullName: string;
    companyName: string;
    taxCode: string;
    nationalId: string;
    bankAccountNumber: string;
    bankName: string;
    address: string;
    contractStartDate: string;
    contractEndDate: string;
    commissionRate: number;
    paymentTerms: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
