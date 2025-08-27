import axiosInstance from '@/lib/axiosInstance';
import { UsersAPIResponse, APIUser } from '@/types/usertypes';

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  id?: string;
  status?: string;
  role?: string;
  search?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phn_no?: string;
  account_status?: string;
  business_document?: string;
  role?: string;
  nature_of_solar_business?: string;
  bvn?: string;
  id_number?: string;
  id_type?: string;
}

export interface UserActionResponse {
  message: string;
  data?: APIUser;
}

export class UsersService {
  private static readonly BASE_URL = '/user';

  /**
   * Fetch all users with optional query parameters
   */
  static async getAllUsers(
    params?: UsersQueryParams
  ): Promise<UsersAPIResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.id) {
        queryParams.append('id', params.id);
      }
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      if (params?.role) {
        queryParams.append('role', params.role);
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }

      const url = `${this.BASE_URL}/allusers${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await axiosInstance.get<UsersAPIResponse>(url);

      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Fetch a single user by ID
   */
  static async getUserById(id: string): Promise<APIUser> {
    try {
      const response = await this.getAllUsers({ id });

      if (response.data.length === 0) {
        throw new Error('User not found');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  /**
   * Get users by status
   */
  static async getUsersByStatus(
    status: string,
    params?: Omit<UsersQueryParams, 'status'>
  ): Promise<UsersAPIResponse> {
    return this.getAllUsers({ ...params, status });
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(
    role: string,
    params?: Omit<UsersQueryParams, 'role'>
  ): Promise<UsersAPIResponse> {
    return this.getAllUsers({ ...params, role });
  }

  /**
   * Search users
   */
  static async searchUsers(
    searchTerm: string,
    params?: Omit<UsersQueryParams, 'search'>
  ): Promise<UsersAPIResponse> {
    return this.getAllUsers({ ...params, search: searchTerm });
  }

  // ========== USER ACTIONS ==========

  /**
   * Verify a user (PATCH /user/:id/verify)
   * Updates the user's account_status to "verified"
   */
  static async verifyUser(userId: string): Promise<APIUser> {
    try {
      const response = await axiosInstance.patch<APIUser>(
        `${this.BASE_URL}/${userId}/verify`
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  /**
   * Decline a user (PATCH /user/:id/decline)
   * Sets account_status to "inactive"
   */
  static async declineUser(userId: string): Promise<APIUser> {
    try {
      const response = await axiosInstance.patch<APIUser>(
        `${this.BASE_URL}/${userId}/decline`
      );
      return response.data;
    } catch (error) {
      console.error('Error declining user:', error);
      throw error;
    }
  }

  /**
   * Block a user (PATCH /user/:id/block)
   * Sets account_status to "inactive"
   */
  static async blockUser(userId: string): Promise<APIUser> {
    try {
      const response = await axiosInstance.patch<APIUser>(
        `${this.BASE_URL}/${userId}/block`
      );
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  /**
   * Edit/Update a user (PATCH /user/:id)
   * Partially updates user information
   */
  static async updateUser(
    userId: string,
    userData: UpdateUserData
  ): Promise<APIUser> {
    try {
      const response = await axiosInstance.patch<APIUser>(
        `${this.BASE_URL}/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user (DELETE /users/:id)
   * Permanently deletes the user from Firebase and database
   * Note: backend expects Firebase UID in the plural `/users/:id` route
   */
  static async deleteUser(firebaseUid: string): Promise<UserActionResponse> {
    try {
      const response = await axiosInstance.delete<UserActionResponse>(
        `/users/${firebaseUid}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
