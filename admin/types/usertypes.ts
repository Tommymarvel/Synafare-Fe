import { STATUSCONST } from "@/lib/constants";

export type UserStatus =
  | typeof STATUSCONST.PENDINGVERIFICATION
  | typeof STATUSCONST.VERIFIED;

export type AllUsers = {
  id: string;
  name: string;
  email: string;
  userType: string;
  dateAdded: string;
  status: UserStatus;
};
