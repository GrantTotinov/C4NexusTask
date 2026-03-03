import { useState, useCallback } from 'react'

interface UseToggleReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setIsOpen: (value: boolean) => void
}

/**
 * Custom hook for managing boolean toggle state
 * @param initialValue - Initial state value (default: false)
 * @returns Object with isOpen state and control functions
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [isOpen, setIsOpen] = useState(initialValue)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle, setIsOpen }
}
