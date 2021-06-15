import React from 'react'
import styled from 'styled-components'
import { useCopyClipboard } from '../../hooks'
import { CheckCircle, Copy } from 'react-feather'
import { StyledIcon } from '..'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const CopyIcon = styled.div`
  color: #aeaeae;
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 0.5rem;
  text-decoration: none;
  display: flex;
  justifycontent: center;
  alignitems: center;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
  @media (max-width: 800px) {
    margin-right: 0;
    margin-left: auto;
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  color: black;
`

export default function CopyHelper({ toCopy }) {
  const [isCopied, setCopied] = useCopyClipboard()
  const [isDarkMode] = useDarkModeManager()

  return (
    <CopyIcon onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <StyledIcon
            className={
              isDarkMode
                ? 'box-btn-copy-dark-mode d-flex justify-content-center align-items-center'
                : 'box-btn-copy-light-mode d-flex justify-content-center align-items-center'
            }
          >
            <CheckCircle size={'18'} className={isDarkMode ? 'btn-copy-dark-mode' : 'btn-copy-light-mode'} />
          </StyledIcon>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <StyledIcon
            className={
              isDarkMode
                ? 'box-btn-copy-dark-mode d-flex justify-content-center align-items-center'
                : 'box-btn-copy-light-mode d-flex justify-content-center align-items-center' + ''
            }
          >
            <Copy size={'18'} className={isDarkMode ? 'btn-copy-dark-mode' : 'btn-copy-light-mode'} />
          </StyledIcon>
        </TransactionStatusText>
      )}
    </CopyIcon>
  )
}
