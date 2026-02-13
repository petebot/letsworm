export type ClickOutsideHandler = (e: MouseEvent | TouchEvent) => void;

export function clickOutside(node: HTMLElement, handler: ClickOutsideHandler) {
  const onClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node;
    if (!node.contains(target)) handler(e);
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', onClick);
    document.addEventListener('touchstart', onClick);
  }

  return {
    destroy() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', onClick);
        document.removeEventListener('touchstart', onClick);
      }
    },
  };
}
