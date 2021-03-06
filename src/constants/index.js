export const BUNDLE_ID = '1'

const DEFAULT_CHAIN_ID = process.env.REACT_APP_DEFAULT_CHAIN_ID
export const chainId = parseInt(window?.ethereum?.chainId ?? DEFAULT_CHAIN_ID, 16)

export const SONE_PRICE_MINIMUM = 0.00001 // 1 SONE >= 0.00001 USDT

export const SONE = {
  1: '',
  3: '0x57bb30bdb0d449bf687ed648acf2467f045c8e74',
  4: '0x5FEA1f4aEf9c78BC56cEd5083fb59d351396748f',
}

export const SONE_MASTER_FARMER = {
  1: '',
  3: '0xfB3bEEE96FA08c2CAb70E6DbE34084A99B47b9aD',
  4: '0x05bf874f71AAbf40966489e45DE3E5FcDC823927',
}

export const CONFIG_MASTER_FARMER = {
  1: null,
  3: {
    startBlock: 10897613,
    rewardMultiplier: [32, 32, 32, 32, 16, 8, 4, 2, 1],
    blocksPerWeek: 45134,
  },
  4: {
    startBlock: 9342011,
    rewardMultiplier: [32, 32, 32, 32, 16, 8, 4, 2, 1],
    blocksPerWeek: 45134,
  },
}

export const ETHERSCAN_BASE_URL = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
}

export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time',
}

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS__NO_ENS = [
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  // 'https://www.coingecko.com/tokens_list/uniswap/defi_100/v_0_0_0.json',
]

// hide from overview list
export const TOKEN_BLACKLIST = [
  '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
  '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
  '0xe31debd7abff90b06bca21010dd860d8701fd901',
  '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
  '0xf4eda77f0b455a12f3eb44f8653835f377e36b76',
  '0x93b2fff814fcaeffb01406e80b4ecd89ca6a021b',

  // rebass tokens
  '0x9ea3b5b4ec044b70375236a281986106457b20ef',
  '0x05934eba98486693aaec2d00b0e9ce918e37dc3f',
  '0x3d7e683fc9c86b4d653c9e47ca12517440fad14e',
  '0xfae9c647ad7d89e738aba720acf09af93dc535f7',
  '0x7296368fe9bcb25d3ecc19af13655b907818cc09',
]

// pair blacklist
export const PAIR_BLACKLIST = [
  '0xb6a741f37d6e455ebcc9f17e2c16d0586c3f57a5',
  '0x97cb8cbe91227ba87fc21aaf52c4212d245da3f8',
  '0x1acba73121d5f63d8ea40bdc64edb594bd88ed09',
  '0x7d7e813082ef6c143277c71786e5be626ec77b20',
]

// warnings to display if page contains info about blocked token
export const BLOCKED_WARNINGS = {
  '0xf4eda77f0b455a12f3eb44f8653835f377e36b76':
    'TikTok Inc. has asserted this token is violating its trademarks and therefore is not available.',
}

/**
 * For tokens that cause erros on fee calculations
 */
export const FEE_WARNING_TOKENS = ['0xd46ba6d942050d489dbd938a2c909a5d5039a161']

export const UNTRACKED_COPY = 'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

// tokens that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES = [
  '0x9928e4046d7c6513326ccea028cd3e7a91c7590a',
  '0x87da823b6fc8eb8575a235a824690fda94674c88',
  '0xcd7989894bc033581532d2cd88da5db0a4b12859',
  '0xe1573b9d29e2183b1af0e743dc2754979a40d237',
]
