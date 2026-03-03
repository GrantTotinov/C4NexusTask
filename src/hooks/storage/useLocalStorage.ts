import { useState, useCallback } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

interface UseLocalStorageReturn<T> {
  storedValue: T
  setValue: (value: SetValue<T>) => void
  removeValue: () => void
}

/**
 * Custom hook for persisting state to localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if localStorage is empty
 * @returns Object with storedValue, setValue, and removeValue functions
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  // Have to fix a bug later !!!
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function (like useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return { storedValue, setValue, removeValue }
}
