import Swal from 'sweetalert2';

export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    draggable: true,
  });
}

export function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    draggable: true,
  });
}

export async function showConfirmDialog(
  title: string, 
  text?: string,
  confirmText: string = 'Sí, continuar',
  cancelText: string = 'Cancelar'
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#1d1c3c',
    cancelButtonColor: '#d33',
    draggable: true,
  });
  return result.isConfirmed;
}
