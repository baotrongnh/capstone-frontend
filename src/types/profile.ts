import { ActorType } from "./auth"
import { UserDetail, UpdateUserDto } from "./user"
import { PartnerDetail, UpdatePartnerDto } from "./partner"

// ========== Core Profile Types ==========

export type ProfileNavItem = {
  key: string
  label: string
  icon: React.ReactNode
  path: string
  roles: ActorType[]
}

// ========== Rental & Contract Types ==========

export type RentalContract = {
  id: string
  apartmentId: string
  tenantId: string
  startDate: string
  endDate: string
  monthlyRent: number
  depositAmount: number
  status: "active" | "expired" | "terminated"
  contractUrl?: string
}

// ========== Utility Types ==========

export type MeterReading = {
  id: string
  meterType: "electricity" | "water"
  currentReading: number
  previousReading: number
  readingDate: string
  unitPrice: number
  totalCost: number
}

export type ApartmentStatus = "available" | "occupied" | "maintenance" | "reserved" | "inactive"

export type UserApartment = {
  id: string
  buildingName: string
  apartmentNumber: string
  address: string
  city: string
  district: string
  totalArea: string
  numberOfBedrooms: number
  numberOfBathrooms: number
  status: ApartmentStatus
  images: string[] | null
  baseRentPrice: number
  // Rental contract
  contract?: RentalContract
  // Utility information
  electricityMeter?: MeterReading
  waterMeter?: MeterReading
  // Latest utility readings
  currentElectricReading: number
  previousElectricReading: number
  currentWaterReading: number
  previousWaterReading: number
  electricityUnitPrice: number
  waterUnitPrice: number
}

// ========== Payment Types ==========

export enum PaymentType {
  RENT = "rent",
  ELECTRICITY = "electricity",
  WATER = "water",
  MAINTENANCE = "maintenance",
  DEPOSIT = "deposit",
  OTHER = "other",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export type PaymentHistory = {
  id: string
  apartmentId: string
  apartmentName: string
  paymentType: PaymentType
  amount: number
  dueDate: string
  paidDate?: string
  status: PaymentStatus
  transactionId?: string
  description?: string
  invoiceUrl?: string
}

// ========== Bill Types ==========

export enum BillStatus {
  UPCOMING = "upcoming",
  PENDING = "pending",
  OVERDUE = "overdue",
  PAID = "paid",
}

export type Bill = {
  id: string
  billNumber: string
  apartmentId: string
  apartmentName: string
  billType: PaymentType
  amount: number
  dueDate: string
  issueDate: string
  status: BillStatus
  description?: string
  paymentUrl?: string
}

// ========== Partner Property Types ==========

export type PartnerProperty = {
  id: string
  buildingName: string
  apartmentNumber: string
  address: string
  city: string
  district: string
  totalArea: string
  numberOfBedrooms: number
  numberOfBathrooms: number
  status: ApartmentStatus
  images: string[] | null
  baseRentPrice: number
  currentTenant?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  contractEndDate?: string
  monthlyRevenue?: number
}

// ========== Component Props Types ==========

export type ProfileSidebarProps = {
  actorType: ActorType
  onLogout: () => void
}

export type ProfileLayoutProps = {
  actorType?: ActorType
  children: React.ReactNode
}

export type AccountInformationProps = {
  actorType: ActorType
  profile: UserDetail | PartnerDetail
  onUpdate?: (values: AccountUpdateDto) => Promise<void>
  loading?: boolean
}

export type UserAccountEditableValues = Partial<Pick<UserDetail, 'fullName' | 'phone' | 'emergencyContactName' | 'emergencyContactPhone'>>
export type PartnerAccountEditableValues = Partial<Pick<PartnerDetail, 'fullName' | 'phone' | 'companyName' | 'taxCode' | 'nationalId' | 'bankAccountNumber' | 'bankName' | 'address'>>
export type AccountEditableValues = UserAccountEditableValues | PartnerAccountEditableValues
export type AccountUpdateDto = Partial<UpdateUserDto & UpdatePartnerDto> & { profileImageUrl?: string }

export type MyApartmentProps = {
  apartment?: UserApartment
  loading?: boolean
}

export type PaymentHistoryProps = {
  payments?: PaymentHistory[]
  loading?: boolean
}

export type BillsProps = {
  bills?: Bill[]
  loading?: boolean
}

export type MyPropertiesProps = {
  properties?: PartnerProperty[]
  loading?: boolean
}
