import React, { FunctionComponent, useReducer } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import BackgroundContext, {
    BackgroundStateType,
} from "../context/background/backgroundContext"
import BackgroundReducer from "../context/background/backgroundReducer"
import { CurrencyAmountPair } from "@blank/background/controllers/blank-deposit/types"
import { AddressBook } from "@blank/background/controllers/AddressBookController"

export const initBackgroundState: BackgroundStateType = {
    blankState: {
        userTokens: {},
        deletedUserTokens: {},
        isAccountTrackerLoading: false,
        addressBook: {
            GOERLI: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            ARBITRUM: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    note: "",
                    name: "Test Contact ",
                    isEns: false,
                },
            },
            OPTIMISM: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            LOCALHOST: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            MAINNET: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            BSC: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            POLYGON: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            BSC_TESTNET: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            ROPSTEN: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            KOVAN: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
            RINKEBY: {
                "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1": {
                    address: "0x5621C68f21852811E1fd6208fDDD0FC13A844fD1",
                    name: "Test Contact ",
                    note: "",
                    isEns: false,
                },
            },
        },
        recentAddresses: {} as AddressBook,
        activityList: {
            confirmed: [],
            pending: [],
        },
        accounts: {
            "0xd7Fd7EDcb7376c490b0e45e391e8040928F73081": {
                address: "0xd7Fd7EDcb7376c490b0e45e391e8040928F73081",
                index: 0,
                external: false,
                name: "Mock 1",
                balances: {
                    5: {
                        nativeTokenBalance: BigNumber.from(0),
                        tokens: {
                            "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60": {
                                token: {
                                    name: "Dai Stablecoin",
                                    symbol: "DAI",
                                    type: "ERC20",
                                    address:
                                        "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
                                    decimals: 18,
                                    logo:
                                        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
                                },
                                balance: BigNumber.from("0x056bc75e2d63100000"),
                            },
                            "0x822397d9a55d0fefd20F5c4bCaB33C5F65bd28Eb": {
                                token: {
                                    decimals: 8,
                                    symbol: "CDAI",
                                    name: "Compound Dai",
                                    address:
                                        "0x822397d9a55d0fefd20F5c4bCaB33C5F65bd28Eb",
                                    logo: "",
                                    type: "ERC20",
                                },
                                balance: BigNumber.from("0x0"),
                            },
                            "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C": {
                                token: {
                                    decimals: 6,
                                    symbol: "USDC",
                                    name: "USDC",
                                    address:
                                        "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
                                    logo:
                                        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
                                    type: "ERC20",
                                },
                                balance: BigNumber.from("0x0bebc200"),
                            },
                            "0xb7FC2023D96AEa94Ba0254AA5Aeb93141e4aad66": {
                                token: {
                                    decimals: 6,
                                    symbol: "USDT",
                                    name: "Tether USD",
                                    address:
                                        "0xb7FC2023D96AEa94Ba0254AA5Aeb93141e4aad66",
                                    logo:
                                        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                                    type: "ERC20",
                                },
                                balance: BigNumber.from("0x0"),
                            },
                            "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05": {
                                token: {
                                    decimals: 8,
                                    symbol: "WBTC",
                                    name: "Wrapped BTC",
                                    address:
                                        "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
                                    logo:
                                        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                                    type: "ERC20",
                                },
                                balance: BigNumber.from("0x0"),
                            },
                        },
                    },
                },
            },
            "0x5621C68f21852811E1fd6208fCCC0FC13A844fD2": {
                address: "0x5621C68f21852811E1fd6208fCCC0FC13A844fD2",
                index: 1,
                external: false,
                balances: {
                    5: {
                        nativeTokenBalance: BigNumber.from("1"),
                        tokens: {},
                    },
                },
                name: "Mock 2",
            },
            "0x5621C68f21852811E1fd6208fAAA0FC13A844fD3": {
                address: "0x5621C68f21852811E1fd6208fAAA0FC13A844fD3",
                index: 2,
                external: false,
                balances: {
                    5: {
                        nativeTokenBalance: BigNumber.from("2"),
                        tokens: {},
                    },
                },
                name: "Mock 3",
            },
            "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4": {
                address: "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4",
                index: 3,
                external: true,
                balances: {
                    5: {
                        nativeTokenBalance: BigNumber.from("2"),
                        tokens: {},
                    },
                },
                name: "Mock 4",
            },
        },
        isAppUnlocked: true,
        isUnlocked: true,
        keyringTypes: "",
        keyrings: [],
        isOnboarded: true,
        isSeedPhraseBackedUp: true,
        selectedAddress: "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4",
        selectedNetwork: "goerli",
        isNetworkChanging: false,
        isUserNetworkOnline: true,
        isProviderNetworkOnline: true,
        localeInfo: "",
        nativeCurrency: "usd",
        permissions: {
            "https://app.uniswap.org": {
                accounts: ["0x5621c68f21852811E1fD6208Faaa0fC13a845fd4"],
                activeAccount: "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4",
                data: {
                    iconURL:
                        "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=010",
                    name: "Uniswap Interface",
                },
                origin: "https://app.uniswap.org",
            },
            "https://app.1inch.io": {
                accounts: ["0x5621c68f21852811E1fD6208Faaa0fC13a845fd4"],
                activeAccount: "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4",
                data: {
                    iconURL:
                        "https://raw.githubusercontent.com/trustwallet/assets/master/dapps/1inch.exchange.png",
                    name: "1inch Dex",
                },
                origin: "https://app.1inch.io",
            },
        },
        permissionRequests: {
            // '1': {
            //   hostname: 'app.uniswap.org',
            //   iconURL: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=010',
            //   isVerified: true,
            //   name: 'Uniswap',
            //   origin: 'https://app.uniswap.org/'
            // },
            // '2': {
            //   hostname: 'app.1inch.io',
            //   iconURL: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/1inch.exchange.png',
            //   isVerified: true,
            //   name: '1inch',
            //   origin: 'https://app.1inch.io'
            // }
        },
        transactions: [],
        unapprovedTransactions: {},
        previousWithdrawals: [],
        depositsCount: {
            eth: [
                {
                    pair: {
                        currency: "eth",
                        amount: "1",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
            dai: [
                {
                    pair: {
                        currency: "dai",
                        amount: "100",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
            cdai: [
                {
                    pair: {
                        currency: "cdai",
                        amount: "5000",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
            usdc: [
                {
                    pair: {
                        currency: "usdc",
                        amount: "100",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
            usdt: [
                {
                    pair: {
                        currency: "usdt",
                        amount: "100",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
            wbtc: [
                {
                    pair: {
                        currency: "wbtc",
                        amount: "0.1",
                    } as CurrencyAmountPair,
                    count: 2,
                },
            ],
        },
        blockData: { 5: { blockNumber: -1, updateCounter: -1 } },
        areDepositsPending: false,
        areWithdrawalsPending: false,
        pendingDeposits: {
            eth: {} as any,
            dai: {} as any,
            cdai: {} as any,
            usdc: {} as any,
            usdt: {} as any,
            wbtc: {} as any,
        },
        pendingWithdrawals: [],
        isVaultInitialized: true,
        isImportingDeposits: false,
        importingErrors: [],
        exchangeRates: { ETH: 2300, DAI: 1 },
        networkNativeCurrency: {
            symbol: "ETH",
            // Default Coingecko id for ETH rates
            coingeckoPlatformId: "ethereum",
        },
        isEIP1559Compatible: { 5: true },
        gasPriceData: {
            5: {
                blockGasLimit: BigNumber.from(0),
                gasPricesLevels: {
                    slow: {
                        gasPrice: BigNumber.from(111111111110),
                        maxPriorityFeePerGas: BigNumber.from(0),
                        maxFeePerGas: BigNumber.from(0),
                    },
                    average: {
                        gasPrice: BigNumber.from(111111111110),
                        maxPriorityFeePerGas: BigNumber.from(0),
                        maxFeePerGas: BigNumber.from(0),
                    },
                    fast: {
                        gasPrice: BigNumber.from(111111111110),
                        maxPriorityFeePerGas: BigNumber.from(0),
                        maxFeePerGas: BigNumber.from(0),
                    },
                },
                baseFee: BigNumber.from("0x02540be400"),
            },
        },
        incomingTransactions: {},
        showTestNetworks: true,
        popupTab: "activity",
        settings: {
            hideAddressWarning: false,
        },
        availableNetworks: {
            MAINNET: {
                name: "mainnet",
                desc: "Ethereum Mainnet",
                chainId: 1,
                networkVersion: "1",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: false,
                order: 1,
                features: ["sends", "swaps", "tornado"],
                ens: true,
                showGasLevels: true,
                rpcUrls: [
                    `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                ],
                blockExplorerUrls: ["https://etherscan.io"],
            },
            ARBITRUM: {
                name: "arbitrum",
                desc: "Abitrum Mainnet",
                chainId: 42161,
                networkVersion: "42161",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: false,
                order: 2,
                features: ["sends", "swaps"],
                ens: false,
                showGasLevels: false,
                rpcUrls: ["https://arb1.arbitrum.io/rpc"],
                blockExplorerUrls: ["https://arbiscan.io"],
            },
            OPTIMISM: {
                name: "optimism",
                desc: "Optimism Mainnet",
                chainId: 10,
                networkVersion: "10",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: false,
                test: false,
                order: 3,
                features: ["sends"],
                ens: false,
                showGasLevels: false,
                rpcUrls: ["https://mainnet.optimism.io"],
                blockExplorerUrls: ["https://optimistic.etherscan.io"],
            },
            BSC: {
                name: "bsc",
                desc: "BSC Mainnet",
                chainId: 56,
                networkVersion: "56",
                nativeCurrency: {
                    name: "Binance Chain Native Token",
                    symbol: "BNB",
                    decimals: 18,
                },
                iconUrls: [
                    "https://assets.trustwalletapp.com/blockchains/smartchain/info/logo.png",
                ],
                enable: true,
                test: false,
                order: 4,
                features: ["sends", "swaps"],
                ens: false,
                showGasLevels: true,
                rpcUrls: ["https://bsc-dataseed1.binance.org:443"],
                blockExplorerUrls: ["https://bscscan.com"],
            },
            GOERLI: {
                name: "goerli",
                desc: "Goerli Testnet",
                chainId: 5,
                networkVersion: "5",
                nativeCurrency: {
                    name: "Görli Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: true,
                order: 5,
                features: ["sends", "tornado"],
                ens: true,
                showGasLevels: true,
                rpcUrls: [
                    `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                ],
                blockExplorerUrls: ["https://goerli.etherscan.io"],
            },
            ROPSTEN: {
                name: "ropsten",
                desc: "Ropsten Testnet",
                chainId: 3,
                networkVersion: "3",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: true,
                order: 6,
                features: ["sends"],
                ens: true,
                showGasLevels: true,
                rpcUrls: [
                    `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                ],
                blockExplorerUrls: ["https://ropsten.etherscan.io"],
            },
            KOVAN: {
                name: "kovan",
                desc: "Kovan Testnet",
                chainId: 42,
                networkVersion: "42",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: true,
                order: 7,
                features: ["sends"],
                ens: false,
                showGasLevels: true,
                rpcUrls: [
                    `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                ],
                blockExplorerUrls: ["https://kovan.etherscan.io"],
            },
            RINKEBY: {
                name: "rinkeby",
                desc: "Rinkeby Testnet",
                chainId: 4,
                networkVersion: "4",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: true,
                order: 8,
                features: ["sends"],
                ens: true,
                showGasLevels: true,
                rpcUrls: [
                    `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                ],
                blockExplorerUrls: ["https://rinkeby.etherscan.io"],
            },
            BSC_TESTNET: {
                name: "bsc_testnet",
                desc: "BSC Testnet",
                chainId: 97,
                networkVersion: "97",
                nativeCurrency: {
                    name: "Binance Chain Native Token",
                    symbol: "BNB",
                    decimals: 18,
                },
                iconUrls: [
                    "https://assets.trustwalletapp.com/blockchains/smartchain/info/logo.png",
                ],
                enable: false,
                test: true,
                order: 9,
                features: ["sends"],
                ens: false,
                showGasLevels: true,
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                blockExplorerUrls: ["https://testnet.bscscan.io"],
            },
            LOCALHOST: {
                name: "localhost",
                desc: "Localhost 8545",
                chainId: 1337,
                networkVersion: "1337",
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                enable: true,
                test: true,
                order: 10,
                features: ["sends"],
                ens: false,
                showGasLevels: false,
                rpcUrls: ["http://localhost:8545"],
            },
        },
        dappRequests: {
            //"1": {
            //    origin: "http://app.goblank.io/",
            //    siteMetadata: {
            //        name: "GoBlank",
            //        iconURL: "http://app.goblank.io/icons/icon-128.png",
            //    },
            //    time: 1,
            //    type: DappReq.SIGNING,
            //    params: {
            //        method: "personal_sign",
            //        params: {
            //            address: "0x5621c68f21852811E1fD6208Faaa0fC13a845fd4",
            //            data: "hello",
            //        },
            //    },
            //},
        },
    },
}

const MockBackgroundState: FunctionComponent<{
    assignBlankState?: Partial<BackgroundStateType["blankState"]>
}> = ({ assignBlankState, children }) => {
    const injectedBackgroundState = {
        ...initBackgroundState,
        blankState: { ...initBackgroundState.blankState, ...assignBlankState },
    }
    const [state] = useReducer(BackgroundReducer, injectedBackgroundState)

    return (
        <BackgroundContext.Provider
            value={{
                blankState: state.blankState,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    )
}

export default MockBackgroundState
