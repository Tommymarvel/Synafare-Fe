import { z } from "zod";

const permissionItem = z.object({
  view: z.boolean(),
  manage: z.boolean(),
});

const permissions = z.object({
  loans: permissionItem,
  users: permissionItem,
  marketPlace: permissionItem,
  transactions: permissionItem,
  teamMembers: permissionItem,
});

export const newUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and optional +"),

  adminPermissions: permissions,
  operationsPermissions: permissions,
  financePermissions: permissions,
  customPermissions: permissions,
});

export const newUserDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  adminPermissions: {
    loans: { view: false, manage: false },
    users: { view: false, manage: false },
    marketPlace: { view: false, manage: false },
    transactions: { view: false, manage: false },
    teamMembers: { view: false, manage: false },
  },
  operationsPermissions: {
    loans: { view: false, manage: false },
    users: { view: false, manage: false },
    marketPlace: { view: false, manage: false },
    transactions: { view: false, manage: false },
    teamMembers: { view: false, manage: false },
  },
  financePermissions: {
    loans: { view: false, manage: false },
    users: { view: false, manage: false },
    marketPlace: { view: false, manage: false },
    transactions: { view: false, manage: false },
    teamMembers: { view: false, manage: false },
  },
  customPermissions: {
    loans: { view: false, manage: false },
    users: { view: false, manage: false },
    marketPlace: { view: false, manage: false },
    transactions: { view: false, manage: false },
    teamMembers: { view: false, manage: false },
  },
};

export type NewUserFormTypes = z.infer<typeof newUserSchema>;
