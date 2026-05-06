"use client";

import { Page } from "@/components/Page";
import { RoleGate } from "@/components/guards/RoleGate";
import { ProfilePage } from "@/features/account/ProfilePage";

export default function UserProfilePage() {
  return (
    <RoleGate allowedRoles={["user", "photographer"]}>
      <Page>
        <Page.Body className="max-w-4xl flex-col gap-8 pt-10">
          <ProfilePage />
        </Page.Body>
      </Page>
    </RoleGate>
  );
}
