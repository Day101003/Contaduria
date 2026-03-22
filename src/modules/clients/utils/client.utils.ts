import { CreateClientDto, UpdateClientDto } from '../models/clients';


export function validateClient(client: CreateClientDto | UpdateClientDto): boolean {
  return !!(
    client.fistName?.trim() &&
    client.lastName?.trim() &&
    client.idCard?.trim() &&
    client.phone?.trim() &&
    client.email?.trim()
  );
}

export function createEmptyClient(): CreateClientDto {
  return {
    fistName: '',
    lastName: '',
    phone: '',
    idCard: '',
    email: '',
    address: '',
    profilePhoto: ''
  };
}


export function createEmptyUpdateClient(): UpdateClientDto {
  return {
    fistName: '',
    lastName: '',
    phone: '',
    idCard: '',
    email: '',
    address: ''
  };
}

export function getClientFullName(firstName: string, lastName: string): string {
  return `${firstName || ''} ${lastName || ''}`.trim();
}
