import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The custom text sizes in globals.css. Without this, tailwind-merge reads
// `text-body` as a colour and drops the real colour class beside it (or keeps a
// component's own `text-xs` instead of the size passed in).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["body", "meta", "label"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
