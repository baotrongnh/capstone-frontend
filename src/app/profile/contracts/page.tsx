"use client";

import { ActorType } from "@/types/auth";
import { ProfileLayout } from "../components";
import ContractLayout from "../components/contracts-layout";

export default function ContractPage() {
  return (
    <ProfileLayout>
      <ContractLayout />
    </ProfileLayout>
  );
}
