/**
 * Inicializa los iconos de Feather
 * Debe llamarse después de que el DOM se haya renderizado (ngAfterViewInit)
 */
export function initFeatherIcons(): void {
  setTimeout(() => (globalThis as any).feather?.replace(), 0);
}

/**
 * Reemplaza los iconos de Feather en un contenedor específico
 * @param container - Elemento contenedor opcional
 */
export function replaceFeatherIcons(container?: HTMLElement): void {
  if (container) {
    const icons = container.querySelectorAll('[data-feather]');
    icons.forEach((icon) => {
      (globalThis as any).feather?.replace({ element: icon });
    });
  } else {
    (globalThis as any).feather?.replace();
  }
}
