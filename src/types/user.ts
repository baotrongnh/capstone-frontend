// ========== User API Types ==========

export type ContractApartment = {
    id: string;
    address: string;
    apartmentNumber: string;
}

export type RentalContractSummary = {
    id: string;
    contractNumber: string;
    status: 'active' | 'expired' | 'terminated';
    startDate: string;
    endDate: string;
    apartment: ContractApartment;
}

export type ContractMembership = {
    id: string;
    memberType: 'primary' | 'secondary';
    moveInDate: string;
    sharePercentage: number;
    rentalContract: RentalContractSummary;
}

export type UserDetail = {
    id: string;
    email: string;
    phone: string;
    fullName: string;
    dateOfBirth: string;
    nationalId: string;
    passportNumber: string;
    profileImageUrl: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    contractMemberships: ContractMembership[];
}

export type UpdateUserDto = {
    email?: string;
    phone?: string;
    fullName?: string;
    password?: string;
    dateOfBirth?: string;
    nationalId?: string;
    passportNumber?: string;
    profileImageUrl?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

export type UpdateUserResponse = {
    id: string;
    email: string;
    phone: string;
    fullName: string;
    dateOfBirth: string;
    profileImageUrl: string;
    isActive: boolean;
    isVerified: boolean;
    updatedAt: string;
}
