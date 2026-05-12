"use client";

import { Page } from "@/components/Page";
import { RoleGate } from "@/components/guards/RoleGate";
import { ProfilePage } from "@/features/profile/ProfilePage";

export default function UserProfilePage() {
  return (
    <RoleGate allowedRoles={["user", "photographer"]}>
      <Page>
        <Page.Body>
          <ProfilePage />
        </Page.Body>
      </Page>
    </RoleGate>
  );
}
