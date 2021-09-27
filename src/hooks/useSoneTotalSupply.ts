import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { chainId, FULLNODE_ETH, SONE } from '../constants'
import useBlockNumber from './useBlockNumber'
import { useLastTruthy } from './useLast'
import SoneToken from '../constants/abis/SoneToken.json'
import { BigNumber, ethers } from 'ethers'

export default function useSoneTotalSupply(): number {
  const block = useBlockNumber()
  const provider = new ethers.providers.JsonRpcProvider(FULLNODE_ETH[chainId])
  const soneContract = new ethers.Contract(SONE[chainId], SoneToken.abi, provider)

  const { data: totalSupplyQueryResult } = useQuery<number>(['useSoneTotalSupply', block], async () => {
    const balanceDataRaw: BigNumber = await soneContract?.totalSupply()
    const totalSupply = balanceDataRaw.div(BigNumber.from(10).pow(18)).toNumber()

    if (isNaN(totalSupply)) {
      throw new Error('Error when fetch data in useSoneTotalSupply')
    }

    return totalSupply
  })

  const totalSupply = useLastTruthy(totalSupplyQueryResult) ?? undefined

  return useMemo(() => totalSupply ?? 0, [totalSupply])
}
