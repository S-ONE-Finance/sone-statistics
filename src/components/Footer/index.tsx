import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useOneDayPairPriceChange } from '../../contexts/PairData'

import { RowFixed } from '../Row'
import PairInfo from './PairInfo'

// NOTE: This is a practice using javascript for horizontal scroll infinite, it has the downside that the list will be jerky.
// export default function Footer() {
//   // BUG: Remove useTranslation() here makes list1Ref.current.clientWidth always equal to 0.
//   useTranslation()
//   const windowSize = useWindowSize()
//   const list1Ref = React.useRef<HTMLDivElement>(null)
//   const [list1Left, setList1Left] = React.useState(0)
//   const [list2Left, setList2Left] = React.useState(0)
//   const [pause, setPause] = React.useState(false)
//   const [width, setWidth] = React.useState(-1)
//
//   React.useEffect(() => {
//     if (list1Ref.current) {
//       setWidth(list1Ref.current.clientWidth)
//     }
//   }, [])
//
//   React.useEffect(() => {
//     if (width !== -1) {
//       setList1Left(0)
//       setList2Left(width)
//     }
//   }, [width])
//
//   React.useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (width !== -1) {
//       interval = setInterval(() => {
//         if (!pause) {
//           setList1Left(list1Left => list1Left - 0.75)
//           setList2Left(list2Left => list2Left - 0.75)
//         }
//       }, 12)
//     }
//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [width, pause])
//
//   React.useEffect(() => {
//     if (width === -1 || !windowSize.width) return
//
//     if (list1Left <= -width) {
//       setList1Left(Math.max(list2Left + width, windowSize.width))
//     }
//   }, [list1Left, list2Left, width, windowSize])
//
//   React.useEffect(() => {
//     if (width === -1 || !windowSize.width) return
//
//     if (list2Left <= -width) {
//       setList2Left(Math.max(list1Left + width, windowSize.width))
//     }
//   }, [list1Left, list2Left, width, windowSize])
//
//   const getListJSX = React.useMemo(
//     () => (
//       <>
//         {data.slice(0).map(pair => (
//           <PairInfo
//             key={pair._id}
//             pairName={pair.pairName}
//             changeAmount={pair.changeAmount}
//             changePercentage={pair.changePercentage}
//           />
//         ))}
//       </>
//     ),
//     []
//   )
//
//   return (
//     <StyledRowFixed onMouseEnter={() => !isMobile && setPause(true)} onMouseLeave={() => !isMobile && setPause(false)}>
//       <ListWrapper ref={list1Ref} width={width} left={list1Left}>
//         {getListJSX}
//       </ListWrapper>
//       <ListWrapper width={width} left={list2Left}>
//         {getListJSX}
//       </ListWrapper>
//     </StyledRowFixed>
//   )
// }

// NOTE: This is a practice using only CSS, it has the downside that the list cannot be contiguous.
const Marquee = styled.div<{ pairSize: number; pauseAnimation: boolean }>`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;

  > * {
    display: inline-block;
    width: max-content;

    padding-left: 100%;
    /* show the marquee just outside the paragraph */
    will-change: transform;
    animation: ${({ pairSize }) => `marquee ${pairSize === 0 ? '100' : pairSize * 3.5}s linear infinite`};
    animation-delay: 3.5s;
    animation-play-state: ${({ pauseAnimation }) => (pauseAnimation ? 'paused' : 'running')};
    cursor: pointer;
  }

  @keyframes marquee {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }

  /* Respect user preferences about animations */
  @media (prefers-reduced-motion: reduce) {
    > * {
      animation-iteration-count: 1;
      animation-duration: 0.01s;
      /* instead of animation: none, so an animationend event is
       * still available, if previously attached.
       */
      width: auto;
      padding-left: 0;
    }
  }
`

export default function Footer() {
  const [pauseAnimation, setPauseAnimation] = useState(false)

  const data = useOneDayPairPriceChange()

  const toggleAnimation = useCallback(() => {
    setPauseAnimation((prev) => !prev)
  }, [])

  return (
    <Marquee pairSize={data.length} pauseAnimation={pauseAnimation} onClick={toggleAnimation}>
      <div>
        <RowFixed height={'100%'}>
          {data.slice(0).map((pair) => (
            <PairInfo
              key={pair.id}
              pairName={pair.token0Symbol + '-' + pair.token1Symbol}
              tokenPrice={pair.token1Price}
              tokenPriceChange={pair.oneDayToken1PriceChange}
            />
          ))}
        </RowFixed>
      </div>
    </Marquee>
  )
}
