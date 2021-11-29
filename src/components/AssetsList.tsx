import { BigNumber } from "ethers"
import React, { FunctionComponent, useState } from "react"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"

import { useBlankState } from "../context/background/backgroundHooks"
import { useOnMountHistory } from "../context/hooks/useOnMount"
import { Token } from "@blank/background/controllers/erc-20/Token"
import { TokenList, useTokensList } from "../context/hooks/useTokensList"
import { formatUnits } from "@ethersproject/units"

import plus from "../assets/images/icons/plus.svg"
import unknownTokenIcon from "../assets/images/unknown_token.svg"
import ChevronRightIcon from "./icons/ChevronRightIcon"
import { formatRounded } from "../util/formatRounded"
import { formatCurrency, toCurrencyAmount } from "../util/formatCurrency"
import TrashBinIcon from "./icons/TrashBinIcon"
import { deleteCustomToken } from "../context/commActions"
import { ActionButton } from "./button/ActionButton"

type AssetItem = {
    token: Token
    balance: BigNumber
}

export const AssetIcon: FunctionComponent<{
    asset: Partial<Token>
}> = ({ asset }) => (
    <div className="flex flex-row items-center justify-center w-9 h-9 p-1.5 bg-white border border-gray-200 rounded-full">
        {
            <img
                src={asset.logo || unknownTokenIcon}
                alt={asset.symbol || ""}
                className="rounded-full"
            />
        }
    </div>
)

const Asset: FunctionComponent<{
    asset: AssetItem
    pushDeleteTokens: Function
}> = ({ asset, pushDeleteTokens }) => {
    const history: any = useOnMountHistory()
    const state = useBlankState()!

    const removeToken = (e: React.MouseEvent<HTMLDivElement>, data: any) => {
        deleteCustomToken(data.address as string)
        pushDeleteTokens(data.address as string)
    }

    return (
        <>
            <ContextMenuTrigger id={`${asset.token.address}`}>
                <div
                    onClick={() =>
                        history.push({
                            pathname: "/send",
                            state: { asset },
                        })
                    }
                    className="flex flex-row items-center justify-between px-6 py-5 -ml-6 transition duration-300 hover:bg-primary-100 hover:bg-opacity-50 active:bg-primary-200 active:bg-opacity-50 cursor-pointer"
                    style={{ width: "calc(100% + 2 * 1.5rem)" }}
                >
                    <div className="flex flex-row items-center">
                        <AssetIcon asset={asset.token} />
                        <div className="flex flex-col ml-2">
                            <span
                                className="text-sm font-bold"
                                title={`
                                    ${formatUnits(
                                        asset.balance || "0",
                                        asset.token.decimals
                                    )} ${asset.token.symbol}
                                `}
                            >
                                {`
                                    ${formatRounded(
                                        formatUnits(
                                            asset.balance || "0",
                                            asset.token.decimals
                                        ),
                                        4
                                    )}
                                    ${asset.token.symbol}
                                `}
                            </span>
                            <span className="text-xs text-gray-600">
                                {formatCurrency(
                                    toCurrencyAmount(
                                        asset.balance || BigNumber.from(0),
                                        state.exchangeRates[asset.token.symbol],
                                        asset.token.decimals
                                    ),
                                    {
                                        currency: state.nativeCurrency,
                                        locale_info: state.localeInfo,
                                        showSymbol: true,
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <ChevronRightIcon />
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenu
                id={`${asset.token.address}`}
                className="inline-flex border-2 rounded-md bg-white"
                style={{ zIndex: 8000 }}
                hideOnLeave={true}
            >
                <MenuItem
                    data={{ address: asset.token.address }}
                    onClick={removeToken}
                    className="flex w-full px-6 py-4 cursor-pointer text-red-500 justify-start p-2 items-center hover:bg-gray-100"
                >
                    <div className="pr-3">
                        <TrashBinIcon fill="red" />
                    </div>
                    <span className="text-sm font-bold text-red-600 inline-flex">
                        Remove token
                    </span>
                </MenuItem>
            </ContextMenu>
        </>
    )
}

const SubAssetList: FunctionComponent<{ assets: TokenList }> = ({ assets }) => {
    const [deletedTokens, setDeletedTokens] = useState([] as string[])
    const pushDeleteTokens = (deleteToken: string) => {
        setDeletedTokens([...deletedTokens, deleteToken])
    }

    // the action of delete a token is not sync, we include this blick of code for not showing deleted tokens while they are being deleted.
    const newDeleted: string[] = []
    deletedTokens.forEach((t) => {
        if (assets.map((a) => a.token.address).includes(t)) {
            newDeleted.push(t)
        }
    })
    if (deletedTokens.length !== newDeleted.length) {
        setDeletedTokens(newDeleted)
    }

    return (
        <div className="flex flex-col flex-1 w-full space-y-0">
            {assets
                .filter((t) => !deletedTokens.includes(t.token.address))
                .map((a, i) => (
                    <React.Fragment key={i}>
                        {i > 0 ? <hr /> : null}
                        <Asset asset={a} pushDeleteTokens={pushDeleteTokens} />
                    </React.Fragment>
                ))}
        </div>
    )
}

const AssetsList = () => {
    const { currentNetworkTokens } = useTokensList()

    // Top spacing for network labels: "pt-6"
    return (
        <div className="flex flex-col w-full space-y-2">
            <div className="flex flex-col w-full space-y-1">
                {/* Network label */}
                {/* <span className="text-xs text-gray-500">ETHEREUM</span> */}
                <SubAssetList assets={currentNetworkTokens} />
            </div>
            <div className="flex flex-col w-full space-y-1">
                <ActionButton
                    icon={plus}
                    label="Add Token"
                    to="/settings/tokens/add"
                />
            </div>
        </div>
    )
}

export default AssetsList
