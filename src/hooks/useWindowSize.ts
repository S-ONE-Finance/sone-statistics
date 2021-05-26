import { useEffect, useState } from 'react'
import { MEDIA_WIDTHS } from '../theme'

const isClient = typeof window === 'object'

function getSize() {
  return {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  }
}

// https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize())
    }

    if (isClient) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return undefined
  }, [])

  return windowSize
}

export function useIsUpToExtraSmall() {
  const { width } = useWindowSize()

  return width && width <= MEDIA_WIDTHS.upToExtraSmall
}

export function useIsUpToSmall() {
  const { width } = useWindowSize()

  return width && width <= MEDIA_WIDTHS.upToSmall
}
