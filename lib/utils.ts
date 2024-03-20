import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const preferLanguage = [
  "C",
  "Cpp",
  "Python",
  "Java",
  "JavaScript",
]


export const getLanguageId = (language: string): number => {
  const languageMap: Record<string, number> = {
    "c": 49,
    "cpp": 54,
    "python": 92,
    "java": 91,
    "javascript": 93
  }

  console.log(language.toLowerCase())

  return languageMap[language.toLowerCase()] || 0
}

export function limitSentence(sentence: string, limit: number) {
  const words = sentence.split(' ');
  const limitedWords = words.slice(0, limit);
  return limitedWords.join(' ');
}