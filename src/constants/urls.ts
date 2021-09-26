// S_ONE URLS
export const S_ONE_APP_URL = process.env.REACT_APP_S_ONE_APP_URL ?? ''
export const S_ONE_TOP_PAGE_URL = process.env.REACT_APP_S_ONE_TOP_PAGE_URL ?? ''
export const S_ONE_LANDING_PAGE_URL = process.env.REACT_APP_S_ONE_LANDING_PAGE_URL ?? ''
export const S_ONE_WALLET_INTRO_PAGE_URL = process.env.REACT_APP_S_ONE_WALLET_INTRO_PAGE_URL ?? ''
export const S_ONE_DEFI_INTRO_PAGE_URL = process.env.REACT_APP_S_ONE_DEFI_INTRO_PAGE_URL ?? ''
export const S_ONE_DOCS_URL = process.env.REACT_APP_S_ONE_DOCS_URL ?? ''
export const S_ONE_WHITE_PAPER_URL = process.env.REACT_APP_S_ONE_WHITE_PAPER_URL ?? ''
export const S_ONE_FAQ_URL = process.env.REACT_APP_S_ONE_FAQ_URL ?? ''

if (S_ONE_APP_URL === '') throw new Error(`REACT_APP_S_ONE_APP_URL not found.`)
if (S_ONE_TOP_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_TOP_PAGE_URL not found.`)
if (S_ONE_LANDING_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_LANDING_PAGE_URL not found.`)
if (S_ONE_WALLET_INTRO_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_WALLET_INTRO_PAGE_URL not found.`)
if (S_ONE_DEFI_INTRO_PAGE_URL === '') throw new Error(`REACT_APP_S_ONE_DEFI_INTRO_PAGE_URL not found.`)
if (S_ONE_DOCS_URL === '') throw new Error(`REACT_APP_S_ONE_DOCS_URL not found.`)
if (S_ONE_WHITE_PAPER_URL === '') throw new Error(`REACT_APP_S_ONE_WHITE_PAPER_URL not found.`)
if (S_ONE_FAQ_URL === '') throw new Error(`REACT_APP_S_ONE_FAQ_URL not found.`)
