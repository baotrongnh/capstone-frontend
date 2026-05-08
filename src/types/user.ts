import { paths } from "./api";

export type UserDetail = NonNullable<paths["/api/v1/users/profile"]['get']['responses']['200']['content']['application/json']['data']>
export type ContractMembership = NonNullable<NonNullable<UserDetail['contractMemberships']>[number]>
export type RentalContractSummary = ContractMembership['rentalContract']
export type ContractApartment = RentalContractSummary['apartment']
export type UserIdentity = NonNullable<paths["/api/v1/users/profile/identity"]['get']['responses']['200']['content']['application/json']['data']>
export type VerifyIdentityInput = {
  identityCardFront: File
  identityCardBack: File
  bankName: string
  bankAccount: string
}
export type VietQrBank = {
  id: number
  code: string
  name: string
  shortName: string
  logo: string
}
export type VietQrBanksResponse = {
  data?: VietQrBank[]
}
export type IdentityVerificationFormValues = {
  bankName?: string
  bankAccount?: string
}
export type VerifyIdentityErrorResponse = {
  message?: string
}


export type UpdateUserDto = Partial<paths["/api/v1/users/{id}"]['patch']['requestBody']['content']['application/json']>
export type UpdateUserResponse = NonNullable<paths["/api/v1/users/{id}"]['patch']['responses']['200']['content']['application/json']['data']>

export type AiVerificationResult = {
  success: boolean
  extractedInfo: Record<string, unknown> | null
}

export type AiVerification = {
  front: AiVerificationResult
  back: AiVerificationResult
}

export type ModalIdentityCardProps = {
  open: boolean
  onClose: () => void
  identity?: UserIdentity
}
