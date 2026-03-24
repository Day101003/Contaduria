let Swal: any;

async function getSwal() {
  if (!Swal) {
    const module = await import('sweetalert2');
    Swal = module.default;
  }
  return Swal;
}

// ✅ success
export async function showSuccessAlert(title: string, text?: string) {
  const Swal = await getSwal();

  return Swal.fire({
    title,
    text,
    icon: 'success',
    draggable: true,
  });
}

// ✅ error
export async function showErrorAlert(title: string, text?: string) {
  const Swal = await getSwal();

  return Swal.fire({
    title,
    text,
    icon: 'error',
    draggable: true,
  });
}

// ✅ confirm
export async function showConfirmDialog(
  title: string, 
  text?: string,
  confirmText: string = 'Sí, continuar',
  cancelText: string = 'Cancelar'
): Promise<boolean> {

  const Swal = await getSwal();

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