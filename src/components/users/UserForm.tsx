"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { SingleValue, MultiValue } from "react-select";
import axios from "axios";
import { User } from "@/types/user";
import { storeServie } from "@/api/store";

type Props = {
  onSave: (data: Partial<User>) => void;
  editingUser?: User | null;
};

// ------------------
// Yup validation schema
// ------------------
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
  accessStores: yup.array().min(1, "Select at least one store"),
  password: yup.string(), // optional, check manually on submit
});

// ------------------
// Static roles
// ------------------
const roles = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Store Manager", value: "Store Manager" },
];

export function UserForm({ onSave, editingUser }: Props) {
  type StoreOption = { label: string; value: string };
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      accessStores: [],
      password: "",
    },
  });

  // ------------------
  // Fetch stores from backend API
  // ------------------
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeServie.getAll(); // Replace with your API
        const options: StoreOption[] = res.data.data.map((s: { name: string; _id: string }) => ({ label: s.name, value: s._id }));
        setStoreOptions(options);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };
    fetchStores();
  }, []);

  // ------------------
  // Populate form if editing
  // ------------------
  useEffect(() => {
    if (editingUser) {
      reset({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role,
        accessStores: editingUser.accessStores || [],
        password: "", // blank on edit
      });
    }
  }, [editingUser, reset]);

  // ------------------
  // Handle submit
  // ------------------
  const onSubmit = (data: Partial<User>) => {
    // Password required only on create
    if (!editingUser && !data.password) {
      alert("Password is required for new user");
      return;
    }

    // If editing and password is empty, remove it to avoid overwriting
    if (editingUser && !data.password) {
      delete data.password;
    }

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow space-y-3">
      {/* First Name */}
      <div>
        <input
          placeholder="First Name"
          {...register("firstName")}
          className="border p-2 w-full rounded"
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
      </div>

      {/* Last Name */}
      <div>
        <input
          placeholder="Last Name"
          {...register("lastName")}
          className="border p-2 w-full rounded"
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <input
          placeholder="Email"
          {...register("email")}
          className="border p-2 w-full rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <input
          placeholder={editingUser ? "Password (leave blank to keep)" : "Password"}
          type="password"
          {...register("password")}
          className="border p-2 w-full rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      {/* Role dropdown */}
      <div>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={roles}
              placeholder="Select Role"
              onChange={(option: SingleValue<StoreOption>) => {
                field.onChange(option?.value);
              }}
              value={roles.find((r) => r.value === field.value)}
            />
          )}
        />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      {/* AccessStores multi-select */}
      <div>
        <Controller
          name="accessStores"
          control={control}
          render={({ field }) => (
              <Select
                options={storeOptions}
                isMulti
                placeholder="Select Stores"
                onChange={(options: MultiValue<StoreOption>) => {
                  field.onChange(options ? options.map((o) => o.value) : []);
                }}
                value={storeOptions.filter((s) => Array.isArray(field.value) && field.value.includes(s.value))}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                isDisabled={field.disabled}
              />
          )}
        />
        {errors.accessStores && <p className="text-red-500">{errors.accessStores.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {editingUser ? "Update" : "Create"}
      </button>
    </form>
  );
}

