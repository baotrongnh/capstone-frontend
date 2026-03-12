"use client";

import { ActorType } from "@/types/auth";
import { ProfileLayoutProps } from "@/types/profile";
import ProfileSidebar from "./profile-sidebar";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/query/useAuth";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const actorType = user?.actorType ?? ActorType.USER;
  const { mutate: logout } = useLogout(() => router.push("/"));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-25">
              <ProfileSidebar actorType={actorType} onLogout={() => logout()} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-11">
            <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
