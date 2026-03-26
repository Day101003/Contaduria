import { CreateUserDto, UpdateUserDto, User } from "../models/user";

function mapUserFromApi(userData: any): User {
    return {
        id: userData.id,
        firstName: userData.name,
        lastName: userData.suername,
        profilePhoto: userData.photoProfileUrl,
        phone: userData.phoneNumber,
        idCard: userData.perosnalId,
        email: userData.email,
        roleId: userData.role?.id,
        address: userData.address,
        isDeleted: !userData.active,
    };
}

function mapUsersFromApi(usersData: any[]): User[] {
    return usersData.map(mapUserFromApi);
}

function mapUserToApi(user: CreateUserDto): any {
    return {
        name: user.firstName,
        suername: user.lastName,
        photoProfileUrl: user.profilePhoto,
        phoneNumber: user.phone,
        perosnalId: user.idCard,
        email: user.email,
        roleId: user.roleId,
        address: user.address,
    };
}

function mapUserToApiUpdate(user: UpdateUserDto): any {
    return {
        name: user.firstName,
        suername: user.lastName,
        photoProfileUrl: user.profilePhoto,
        phoneNumber: user.phone,
        perosnalId: user.idCard,
        email: user.email,
        roleId: user.roleId,
        address: user.address,
    };
}

export { mapUserFromApi, mapUsersFromApi, mapUserToApi, mapUserToApiUpdate };
