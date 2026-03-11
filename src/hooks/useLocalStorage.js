import { useState } from 'react'
import { storage } from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = storage.get(key)
    return item !== null ? item : initialValue
  })

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    storage.set(key, valueToStore)
  }

  return [storedValue, setValue]
}
