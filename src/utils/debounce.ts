export function debounce(callback: Function, timeout: number = 300) {
  let timer: any;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
}
