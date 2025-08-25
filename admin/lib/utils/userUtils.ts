import { APIUser, AllUsers } from '@/types/usertypes';
import { format } from 'date-fns';
import { STATUSCONST } from '@/lib/constants';

/**
 * Transform API user data to UI format
 */
export function transformUserData(apiUser: APIUser): AllUsers {
  // Determine user status based on account_status and business_document
  let status: AllUsers['status'];

  if (apiUser.account_status === 'active') {
    status = STATUSCONST.VERIFIED;
  } else if (
    apiUser.account_status === 'pending' ||
    apiUser.account_status === 'inactive'
  ) {
    status = STATUSCONST.PENDINGVERIFICATION;
  } else {
    status = STATUSCONST.PENDINGVERIFICATION; // default
  }

  // Determine user type based on role or nature_of_solar_business
  let userType = 'User';
  if (apiUser.role) {
    userType = apiUser.role.charAt(0).toUpperCase() + apiUser.role.slice(1);
  } else if (apiUser.nature_of_solar_business) {
    userType =
      apiUser.nature_of_solar_business.charAt(0).toUpperCase() +
      apiUser.nature_of_solar_business.slice(1);
  }

  // Format the name
  const firstName = apiUser.first_name || '';
  const lastName = apiUser.last_name || '';
  const name = `${firstName} ${lastName}`.trim() || 'N/A';

  // Format date
  const dateAdded = format(new Date(apiUser.createdAt), 'MMM dd, yyyy');

  return {
    id: apiUser._id,
    name,
    email: apiUser.email,
    userType,
    dateAdded,
    status,
    avatar: apiUser.avatar,
    phoneNumber: apiUser.phn_no,
    walletBalance: apiUser.wallet_balance,
    loanBalance: apiUser.loan_balance,
    businessDocument: apiUser.business_document,
    emailConfirmed: apiUser.email_confirmed,
    accountStatus: apiUser.account_status,
    role: apiUser.role,
  };
}

/**
 * Transform array of API users to UI format
 */
export function transformUsersData(apiUsers: APIUser[]): AllUsers[] {
  return apiUsers.map(transformUserData);
}

/**
 * Get user status display text
 */
export function getUserStatusText(user: APIUser): string {
  if (user.account_status === 'active') {
    return 'Active';
  } else if (user.account_status === 'pending') {
    return 'Pending Verification';
  } else if (user.account_status === 'inactive') {
    return 'Inactive';
  }
  return 'Unknown';
}

/**
 * Get user type display text
 */
export function getUserTypeText(user: APIUser): string {
  if (user.role) {
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  } else if (user.nature_of_solar_business) {
    return (
      user.nature_of_solar_business.charAt(0).toUpperCase() +
      user.nature_of_solar_business.slice(1)
    );
  }
  return 'User';
}

/**
 * Check if user needs verification
 */
export function userNeedsVerification(user: APIUser): boolean {
  return (
    user.account_status === 'pending' ||
    user.business_document === 'not_submitted' ||
    !user.email_confirmed
  );
}

/**
 * Check if user is verified
 */
export function isUserVerified(user: APIUser): boolean {
  return (
    user.account_status === 'active' &&
    user.email_confirmed &&
    user.business_document === 'submitted'
  );
}

/**
 * Get verification requests count
 */
export function getVerificationRequestsCount(users: APIUser[]): number {
  return users.filter(userNeedsVerification).length;
}

/**
 * Get verified users count
 */
export function getVerifiedUsersCount(users: APIUser[]): number {
  return users.filter(isUserVerified).length;
}

/**
 * Filter users by verification status
 */
export function filterUsersByVerificationStatus(
  users: APIUser[],
  needsVerification: boolean
): APIUser[] {
  return users.filter(
    (user) => userNeedsVerification(user) === needsVerification
  );
}

/**
 * Format wallet balance
 */
export function formatWalletBalance(balance?: number): string {
  if (balance === undefined || balance === null) return 'N/A';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(balance);
}

/**
 * Format loan balance
 */
export function formatLoanBalance(balance?: number): string {
  if (balance === undefined || balance === null) return 'N/A';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(balance);
}
