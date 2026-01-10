export interface User {
  id: number;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  phone: string;
  idCard: string;
  email: string;
  roleId: number;
  address: string;
  isDeleted: boolean;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  phone: string;
  idCard: string;
  email: string;
  roleId: number;
  address: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  phone?: string;
  idCard?: string;
  email?: string;
  roleId?: number;
  address?: string;
}
