"use client";

import { useEffect, useState } from "react";
import { userService } from "@/api/user";
import { User } from "@/types/user";
import { UserTable } from "@/components/users/UserTable";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    const users:any = await userService.getAll();
    setUsers(users?.data?.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await userService.delete(id);
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/user/create")}
      >
        Create User
      </button>

      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
}
