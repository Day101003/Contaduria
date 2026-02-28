

export const ROLE_NAMES: Record<number, string> = {
  1: 'Administrador',
  2: 'Empleado',
  3: 'Usuario'
};

export function getRoleName(roleId: number): string {
  return ROLE_NAMES[roleId] ?? 'Sin rol';
}