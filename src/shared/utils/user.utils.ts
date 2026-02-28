

import { CreateUserDto } from '../../modules/users/models/user';

export function validateUser(user: CreateUserDto): boolean {
  return !!(
    user.firstName?.trim() &&
    user.lastName?.trim() &&
    user.idCard?.trim() &&
    user.phone?.trim() &&
    user.email?.trim()
  );
}

export function createEmptyUser(): CreateUserDto {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    idCard: '',
    email: '',
    roleId: 2,
    address: '',
    profilePhoto: ''
  };
}