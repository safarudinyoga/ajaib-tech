import { useRef, useEffect } from 'react'

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })
  return ref.current
}
