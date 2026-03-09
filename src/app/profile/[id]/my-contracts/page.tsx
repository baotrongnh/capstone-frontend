"use client";
import React from "react";
import { use } from "react";
import ContractLayout from "../../components/contracts-layout";
import ProfileLayout from "../../components/profile-layout";
import { ActorType } from "@/types/auth";
import { MyContractsPageProps } from "@/types/profile";

export default function ContractPage({ params }: MyContractsPageProps) {
  const { id } = use(params);

  return (
    <ProfileLayout userId={id} actorType={ActorType.USER}>
      <ContractLayout />
    </ProfileLayout>
  );
}
