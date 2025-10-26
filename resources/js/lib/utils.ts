import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Nueva función
export function resolveUrl(path: string) {
  // Ajusta según tu base URL; en Laravel + Vite típicamente:
  return import.meta.env.BASE_URL + path;
}
export function isSameUrl(url1: string, url2: string) {
  return url1 === url2;
}
