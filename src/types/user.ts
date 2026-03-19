import { paths } from "./api";

export type UserProfileResponse = paths["/api/v1/users/profile"]['get']['responses']['200']['content']['application/json'];
export type UserProfileIdentityResponse = paths["/api/v1/users/profile/identity"]['get']['responses']['200']['content']['application/json'];
export type UserUpdateBody = paths["/api/v1/users/{id}"]['patch']['requestBody']['content']['application/json'];
export type UserUpdateApiResponse = paths["/api/v1/users/{id}"]['patch']['responses']['200']['content']['application/json'];

export type UserDetail = NonNullable<UserProfileResponse['data']>;
export type ContractMembership = NonNullable<NonNullable<UserDetail['contractMemberships']>[number]>;
export type RentalContractSummary = ContractMembership['rentalContract'];
export type ContractApartment = RentalContractSummary['apartment'];
export type UserIdentity = NonNullable<UserProfileIdentityResponse['data']>;


export type UpdateUserDto = Partial<UserUpdateBody>;
export type UpdateUserResponse = NonNullable<UserUpdateApiResponse['data']>;

export type AiVerificationResult = {
  success: boolean;
  extractedInfo: Record<string, unknown> | null;
};

export type AiVerification = {
  front: AiVerificationResult;
  back: AiVerificationResult;
};

export type ModalIdentityCardProps = {
  open: boolean;
  onClose: () => void;
  identity?: UserIdentity;
};