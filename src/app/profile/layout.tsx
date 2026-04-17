"use client";

import { ProfileLayoutProps } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/query/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { getAvatarUrl } from "@/utils/account-information";
import ProfileSidebar from "./components/profile-sidebar";

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = user?.role === "partner" ? "partner" : "user";
  const avatarUrl = user ? getAvatarUrl(user) : null;
  const { mutate: logout } = useLogout(() => router.push("/"));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-6">
          <div className="lg:col-span-3">
            <div className="sticky top-25">
              <ProfileSidebar
                role={role}
                displayName={user?.fullName ?? null}
                displayEmail={user?.email ?? null}
                displayAvatarUrl={avatarUrl}
                onLogout={() => logout()}
              />
            </div>
          </div>

          <div className="lg:col-span-11">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
