import { useEffect, useState } from 'react'
import { getLatestBlock } from '../utils'

export default function useBlockNumber(): number {
  const [blockNumber, setBlockNumber] = useState()

  useEffect(() => {
    const func = async () => {
      try {
        const block = await getLatestBlock()
        if (block) {
          setBlockNumber(block)
        }
      } catch (err) {
        throw err
      }
    }
    func().then()
    const interval = setInterval(func, 15000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return blockNumber || 0
}
