// ========== User API Types ==========

export type ContractApartment = {
  id: string;
  address: string;
  apartmentNumber: string;
};

export type RentalContractSummary = {
  id: string;
  contractNumber: string;
  status: "active" | "expired" | "terminated";
  startDate: string;
  endDate: string;
  apartment: ContractApartment;
};

export type ContractMembership = {
  id: string;
  memberType: "primary" | "secondary";
  moveInDate: string;
  sharePercentage: number;
  rentalContract: RentalContractSummary;
};

export type UserIdentity = {
  id: string;
  userId: string;
  nationalId: string | null;
  passportNumber: string | null;
  name: string | null;
  dob: string | null;
  sex: string | null;
  nationality: string | null;
  ethnicity: string | null;
  home: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  street: string | null;
  features: string | null;
  issueDate: string | null;
  doe: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AiVerificationResult = {
  success: boolean;
  extractedInfo: Record<string, unknown> | null;
};

export type AiVerification = {
  front: AiVerificationResult;
  back: AiVerificationResult;
};

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
  identity?: UserIdentity;
  aiVerification?: AiVerification;
};

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
};

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
};
