"use client";

import { User } from "@/types/user";
import { useRouter } from "next/navigation";

type Props = {
  users: User[];
  onDelete: (id: string) => void;
};

export function UserTable({ users, onDelete }: Props) {
  const router = useRouter();

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user._id} className="border-t">
            <td className="p-2">{user.firstName}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2 space-x-2">
              <button
                onClick={() => router.push(`/user/${user._id}`)}
                className="text-blue-600"
              >
                Edit
              </button>
              {/* Uncomment for delete
              <button
                onClick={() => {
                  if (confirm("Are you sure?")) onDelete(user._id);
                }}
                className="text-red-600"
              >
                Delete
              </button>
              */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

