"use client";

import { useState } from "react";
import { UserForm } from "@/components/users/UserForm";
import { userService } from "@/api/user";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const router = useRouter();

  const handleSave = async (data: { name: string; email: string }) => {
    await userService.add(data);
    router.push("/user");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>
      <UserForm onSave={handleSave} />
    </div>
  );
}

