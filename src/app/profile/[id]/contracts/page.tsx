"use client";
import React from "react";
import ContractLayout from "../../components/contracts-layout";
import { ProfileLayout } from "../../components";
import { useParams } from "next/navigation";
import { ActorType } from "@/types/auth";

export default function ContractPage() {
  const { id } = useParams();
  return (
    <ProfileLayout userId={String(id)} actorType={ActorType.USER}>
      <ContractLayout></ContractLayout>
    </ProfileLayout>
  );
}
