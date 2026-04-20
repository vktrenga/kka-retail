"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/api/user";
import { UserForm } from "@/components/users/UserForm";
import { User } from "@/types/user";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const userId = Array.isArray(id) ? id[0] : id;

      const userData: any = await userService.get(userId);
      setEditingUser(userData?.data?.data);
    };

    fetchUser();
  }, [id]);

  const handleSave = (data: Partial<User>) => {
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) return;

    userService.edit(userId, data).then(() => {
      router.push("/user");
    });
  };

  if (!editingUser) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <UserForm onSave={handleSave} editingUser={editingUser} />
    </div>
  );
}
