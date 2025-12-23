import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // create a random string using the length param, default to 10 characters
  // the string will add a random character from the "characters" string by chosing a random
  // position from the above string
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function snakeCaseToTitleCase(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/_/g, " ") // replace "_" with a whitespace character
    .replace(/\b\w/g, char => char.toUpperCase()); // capitalize the 1st character of every word
}
