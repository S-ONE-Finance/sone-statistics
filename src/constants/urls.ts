// THE GRAPH URLS
export const SWAP_CLIENT_URL = process.env.REACT_APP_SWAP_CLIENT_URL ?? ''
export const HEALTH_CLIENT_URL = process.env.REACT_APP_HEALTH_CLIENT_URL ?? ''
export const STAKING_CLIENT_URL = process.env.REACT_APP_STAKING_CLIENT_URL ?? ''
export const BLOCK_CLIENT_URL = process.env.REACT_APP_BLOCK_CLIENT_URL ?? ''

if (SWAP_CLIENT_URL === '') throw new Error(`REACT_APP_CLIENT_URL not found.`)
if (HEALTH_CLIENT_URL === '') throw new Error(`REACT_APP_HEALTH_CLIENT_URL not found.`)
if (STAKING_CLIENT_URL === '') throw new Error(`REACT_APP_STAKING_CLIENT_URL not found.`)
if (BLOCK_CLIENT_URL === '') throw new Error(`REACT_APP_BLOCK_CLIENT_URL not found.`)

// S_ONE URLS
export const S_ONE_APP_URL = process.env.REACT_APP_S_ONE_APP_URL ?? ''
export const S_ONE_TOP_PAGE_URL = process.env.REACT_APP_S_ONE_TOP_PAGE_URL ?? ''
export const S_ONE_LANDING_PAGE_URL = process.env.REACT_APP_S_ONE_LANDING_PAGE_URL ?? ''
export const S_ONE_WALLET_INTRO_PAGE_URL = process.env.REACT_APP_S_ONE_WALLET_INTRO_PAGE_URL ?? ''
export const S_ONE_DEFI_INTRO_PAGE_URL = process.env.REACT_APP_S_ONE_DEFI_INTRO_PAGE_URL ?? ''
export const S_ONE_SWAP_STATISTICS_URL = process.env.REACT_APP_S_ONE_SWAP_STATISTICS_URL ?? ''
export const S_ONE_STAKING_STATISTICS_URL = process.env.REACT_APP_S_ONE_STAKING_STATISTICS_URL ?? ''
export const S_ONE_DOCS_URL = process.env.REACT_APP_S_ONE_DOCS_URL ?? ''
export const S_ONE_WHITE_PAPER_URL = process.env.REACT_APP_S_ONE_WHITE_PAPER_URL ?? ''
export const S_ONE_FAQ_URL = process.env.REACT_APP_S_ONE_FAQ_URL ?? ''

if (S_ONE_APP_URL === '') throw new Error(`REACT_APP_S_ONE_APP_URL not found.`)
if (S_ONE_TOP_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_TOP_PAGE_URL not found.`)
if (S_ONE_LANDING_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_LANDING_PAGE_URL not found.`)
if (S_ONE_WALLET_INTRO_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_WALLET_INTRO_PAGE_URL not found.`)
if (S_ONE_DEFI_INTRO_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_DEFI_INTRO_PAGE_URL not found.`)
if (S_ONE_SWAP_STATISTICS_URL === '') throw new Error(`REACT_APP_S_ONE_SWAP_STATISTICS_URL not found.`)
if (S_ONE_STAKING_STATISTICS_URL === '') throw new Error(`REACT_APP_S_ONE_STAKING_STATISTICS_URL not found.`)
if (S_ONE_DOCS_URL === '') throw new Error(`REACT_APP_S_ONE_DOCS_URL not found.`)
if (S_ONE_WHITE_PAPER_URL === '') throw new Error(`REACT_APP_S_ONE_WHITE_PAPER_URL not found.`)
if (S_ONE_FAQ_URL === '') throw new Error(`REACT_APP_S_ONE_FAQ_URL not found.`)

// ETHERSCAN URL
export const ETHERSCAN_BASE_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL ?? ''
if (ETHERSCAN_BASE_URL === '') throw new Error(`REACT_APP_ETHERSCAN_BASE_URL not found.`)
