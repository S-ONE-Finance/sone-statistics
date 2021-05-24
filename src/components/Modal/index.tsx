import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { animated, useTransition, useSpring } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'
import { transparentize } from 'polished'
import { useGesture } from 'react-use-gesture'

const AnimatedDialogOverlay = animated(DialogOverlay)

const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 20;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, maxWidth, isModalBindToBottom, isOpen, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: ${({ isModalBindToBottom }) => (isModalBindToBottom ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    background-color: ${({ theme }) => theme.bg1};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    width: ${({ isModalBindToBottom, maxWidth }) => (isModalBindToBottom ? '100vw' : `${maxWidth}px`)};
    max-width: ${({ isModalBindToBottom }) => (isModalBindToBottom ? '100vw' : 'calc(100vw - 32px)')};
    padding: 0;
    margin: 0;
    overflow-y: ${({ isModalBindToBottom }) => (isModalBindToBottom ? 'scroll' : 'hidden')};
    overflow-x: hidden;
    align-self: ${({ isModalBindToBottom }) => (isModalBindToBottom ? 'flex-end' : 'center')};

    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 25px;

    ${({ theme, isModalBindToBottom }) => theme.mediaWidth.upToSmall`
      ${
        isModalBindToBottom &&
        css`
          width: 100vw;
          border-radius: 25px 25px 0 0;
        `
      }
    `}
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: number
  initialFocusRef?: React.RefObject<any>
  isBottomOnMobile?: boolean // Center cả trên mobile lẫn desktop.
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  maxWidth = 602,
  initialFocusRef,
  isBottomOnMobile = false,
  children,
}: ModalProps) {
  const isModalBindToBottom = useMemo(() => isMobile && isBottomOnMobile, [isBottomOnMobile])
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: (state) => {
      // BUG: This line causes "Warning: Can't perform a React state update on an unmounted component".
      set({
        y: state.down ? state.movement[1] : 0,
      })

      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    },
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              unstable_lockFocusAcrossFrames={false}
            >
              <StyledDialogContent
                {...(isModalBindToBottom
                  ? {
                      ...bind(),
                      style: { transform: y.interpolate((y) => `translateY(${y > 0 ? y : 0}px)`) },
                    }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                isModalBindToBottom={isModalBindToBottom}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isModalBindToBottom ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
