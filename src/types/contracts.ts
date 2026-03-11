// ========== Contract API Types ==========

export type ContractApartment = {
  id: string;
  apartmentNumber: string;
  address: string;
  city: string;
};

// ========== Contract Member Types ==========

export type ContractUser = {
  id: string;
  fullName: string;
  email: string;
};

export type ContractMember = {
  user: ContractUser;
  memberType: "primary" | "secondary";
  isPrimaryContact: boolean;
};

// ========== Contract Types ==========

export type ContractDetail = {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
  apartment: ContractApartment;
  members: ContractMember[];
};

// ========== Contract API Response Types ==========

export type GetContractsResponse = {
  statusCode: number;
  message: string;
  data: ContractDetail[];
  meta: {
    timestamp: string;
  };
};
