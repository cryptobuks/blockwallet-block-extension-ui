import React, { FunctionComponent, useState } from "react"
import PopupFooter from "../../components/popup/PopupFooter"
import PopupHeader from "../../components/popup/PopupHeader"
import PopupLayout from "../../components/popup/PopupLayout"
import { Classes } from "../../styles/classes"
import Divider from "../../components/Divider"
import { formatHash, formatName } from "../../util/formatAccount"
import { formatUnits, getAddress } from "ethers/lib/utils"
import { formatUrl } from "../../util/formatUrl"
import { DappReq } from "../../context/hooks/useDappRequest"
import ReactJson from "react-json-view"
import { confirmDappRequest, setUserSettings } from "../../context/commActions"
import { useBlankState } from "../../context/background/backgroundHooks"
import {
    EIP712Domain,
    EIP712DomainKey,
    MessageSchema,
    NormalizedSignatureData,
    SignatureMethods,
    TypedMessage,
    V1TypedData,
    DappRequestParams,
} from "@blank/background/utils/types/ethereum"
import { AiFillInfoCircle } from "react-icons/ai"
import Tooltip from "../../components/label/Tooltip"
import { getNetworkFromChainId } from "../../util/getExplorer"
import { useSelectedNetwork } from "../../context/hooks/useSelectedNetwork"
import { capitalize } from "../../util/capitalize"
import AccountIcon from "../../components/icons/AccountIcon"
import { getAccountColor } from "../../util/getAccountColor"
import { formatNumberLength } from "../../util/formatNumberLength"
import CopyTooltip from "../../components/label/СopyToClipboardTooltip"
import { useTokensList } from "../../context/hooks/useTokensList"
import { ButtonWithLoading } from "../../components/button/ButtonWithLoading"
import { DappRequestProps, DappRequest } from "./DappRequest"
import SuccessDialog from "../../components/dialog/SuccessDialog"
import LoadingOverlay from "../../components/loading/LoadingOverlay"
import CheckBoxDialog from "../../components/dialog/CheckboxDialog"
import { useUserSettings } from "../../context/hooks/useUserSettings"
import WarningDialog from "../../components/dialog/WarningDialog"

const SignPage = () => {
    return (
        <DappRequest
            requestType={DappReq.SIGNING}
            layoutRender={(props: DappRequestProps) => {
                return <Sign {...props} />
            }}
        />
    )
}

const Sign: FunctionComponent<DappRequestProps> = ({
    requestCount,
    requestId,
    origin,
    siteMetadata,
    dappReqData,
    isConfirming,
    setIsConfirming,
}) => {
    const network = useSelectedNetwork()
    const {
        accounts,
        availableNetworks,
        selectedAddress,
        settings,
    } = useBlankState()!
    const { nativeToken } = useTokensList()
    const { hideAddressWarning } = useUserSettings()
    const [copied, setCopied] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [accountWarningClosed, setAccountWarningClosed] = useState(false)
    const [isEthSignWarningOpen, setIsEthSignWarningOpen] = useState(true)

    const {
        method,
        params: dappReqParams,
    } = dappReqData as DappRequestParams[DappReq.SIGNING]

    const websiteIcon = siteMetadata.iconURL
    const { address, data } = dappReqParams
    const accountData = accounts[address]

    // Detect if the transaction was triggered using an address different to the active one
    const checksumFromAddress = getAddress(address)
    const differentAddress = checksumFromAddress !== selectedAddress

    const sign = async () => {
        try {
            setIsConfirming(true)
            await confirmDappRequest(requestId, true)
        } finally {
            setIsConfirming(false)
        }
    }

    const reject = async () => {
        try {
            setIsConfirming(true)
            await confirmDappRequest(requestId, false)
        } finally {
            setIsConfirming(false)
        }
    }

    const copy = async () => {
        await navigator.clipboard.writeText(accountData.address)
        setCopied(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCopied(false)
    }

    const formatTypedDomain = (domain: EIP712Domain) => {
        const displayOrder: EIP712DomainKey[] = [
            "name",
            "version",
            "chainId",
            "verifyingContract",
            "salt",
        ]

        const formattedDomainKeyNames: { [key in EIP712DomainKey]: string } = {
            chainId: "Chain ID",
            name: "DApp",
            salt: "Salt",
            verifyingContract: "Verifying Contract",
            version: "Version",
        }

        let parsedDomain = []

        // Arrayifi(lol) domain following the display order
        for (let i = 0; i < displayOrder.length; i++) {
            // Check existing properties on the domain
            if (
                typeof domain[displayOrder[i]] === "string" ||
                typeof domain[displayOrder[i]] === "number"
            ) {
                parsedDomain[i] = `${domain[displayOrder[i]]}`
            } else {
                parsedDomain[i] = null
            }
        }

        // Add chain id name if it exists
        if (domain.chainId) {
            const networkName = getNetworkFromChainId(
                availableNetworks,
                domain.chainId
            )
            parsedDomain[2] += ` (${networkName})`
        }

        // Display them
        return parsedDomain.map((param: string | null, i: number) => {
            if (param) {
                return (
                    <>
                        <span className="font-bold pt-1">
                            {formattedDomainKeyNames[displayOrder[i]]}
                        </span>
                        <span className="text-gray-600">{param}</span>
                    </>
                )
            } else {
                return null
            }
        })
    }

    const formatSignatureData = (
        method: SignatureMethods,
        data: NormalizedSignatureData[SignatureMethods]
    ) => {
        if (method === "eth_sign") {
            return (
                <>
                    <WarningDialog
                        open={isEthSignWarningOpen}
                        onDone={() => setIsEthSignWarningOpen(false)}
                        title="Warning"
                        message="Signing this message can be dangerous. It could allow the requesting site to perform any operation on your wallet's behalf, including complete control of your assets. Sign only if you completely trust the requesting site."
                        buttonLabel="I understand"
                        useClickOutside={false}
                        iconColor="text-red-500"
                        wideMargins={false}
                    />
                    <div className="w-full px-3 py-3 text-sm text-red-500 bg-red-100 rounded">
                        <strong className="font-bold">Warning: </strong>
                        {`Make sure you trust ${origin}. Signing this could grant complete control of your assets`}
                    </div>
                    <span className="font-bold py-2">Message</span>
                    <span className="text-gray-600">{data}</span>
                </>
            )
        }

        if (method === "personal_sign") {
            return (
                <>
                    <span className="font-bold py-2">Message</span>
                    <span className="text-gray-600">{data}</span>
                </>
            )
        }

        if (
            method === "eth_signTypedData" ||
            method === "eth_signTypedData_v1"
        ) {
            const v1Data = data as V1TypedData[]
            return (
                <>
                    {v1Data.map((param: V1TypedData) => {
                        return (
                            <>
                                <span className="font-bold pt-1">
                                    {param.name}
                                </span>
                                <span className="text-gray-600">
                                    {`${param.value}`}
                                </span>
                            </>
                        )
                    })}
                </>
            )
        }

        const v4Data = data as TypedMessage<MessageSchema>
        return (
            <>
                {formatTypedDomain(v4Data.domain)}
                <span className="font-bold py-1">Message</span>
                <ReactJson
                    src={v4Data.message}
                    name={null}
                    indentWidth={1}
                    enableClipboard={false}
                    iconStyle={"triangle"}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    quotesOnKeys={false}
                />
            </>
        )
    }

    return (
        <PopupLayout
            header={
                <PopupHeader
                    title="Signature Request"
                    close={false}
                    backButton={false}
                >
                    {requestCount > 1 && (
                        <div className="group relative">
                            <AiFillInfoCircle
                                size={26}
                                className="pl-2 text-primary-200 cursor-pointer hover:text-primary-300"
                            />
                            <Tooltip
                                content={`${requestCount - 1} more ${
                                    requestCount > 2 ? "requests" : "request"
                                }`}
                            />
                        </div>
                    )}
                    <div className="flex flex-row items-center ml-auto p-1 px-2 pr-1 text-gray-600 rounded-md border border-primary-200 text-xs bg-green-100">
                        <span className="inline-flex rounded-full h-2 w-2 mr-2 animate-pulse bg-green-400 pointer-events-none" />
                        <span className="mr-1 pointer-events-none text-green-600">
                            {capitalize(network.name)}
                        </span>
                    </div>
                </PopupHeader>
            }
            footer={
                <PopupFooter>
                    <ButtonWithLoading
                        onClick={reject}
                        buttonClass={Classes.liteButton}
                        isLoading={isConfirming}
                        label="Reject"
                    ></ButtonWithLoading>
                    <ButtonWithLoading
                        label="Sign"
                        onClick={() => setShowDialog(true)}
                        isLoading={isConfirming}
                    />
                </PopupFooter>
            }
        >
            <SuccessDialog
                open={showDialog}
                title="Success"
                message="You've signed the request."
                timeout={1200}
                onDone={() => {
                    setShowDialog(false)
                    sign()
                }}
            />
            {isConfirming && <LoadingOverlay />}
            <CheckBoxDialog
                message={`Approval request was sent with an account that's different from the selected one in your wallet. \n\n Please select if you want to continue or reject the transaction.`}
                onClose={() => {
                    setAccountWarningClosed(true)
                }}
                onCancel={reject}
                onConfirm={(saveChoice) => {
                    if (saveChoice) {
                        setUserSettings({
                            ...settings,
                            hideAddressWarning: true,
                        })
                    }
                }}
                title="Different address detected"
                open={
                    differentAddress &&
                    !accountWarningClosed &&
                    !hideAddressWarning
                }
                closeText="Reject"
                confirmText="Continue"
                showCheckbox
                checkboxText="Don't show this warning again"
            />
            <div className="px-6 py-3 flex flex-row items-center">
                <div className="flex flex-row items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                    {websiteIcon ? <img alt="icon" src={websiteIcon} /> : null}
                </div>
                <div className="flex flex-col text-sm font-bold ml-4">
                    {formatUrl(origin)}
                </div>
            </div>
            <Divider />
            <span className="font-bold px-6 py-3 text-sm text-gray-800">
                Signing Account
            </span>
            <div className="flex flex-col px-6">
                <div className="flex flex-row items-center space-x-4">
                    <AccountIcon
                        className="w-10 h-10"
                        fill={getAccountColor(accountData.address)}
                    />
                    <button
                        type="button"
                        className="relative flex flex-col group space-y-1"
                        onClick={copy}
                    >
                        <span className="text-sm font-bold">
                            {formatName(accountData.name, 15)}
                            {" ("}
                            {formatNumberLength(
                                formatUnits(
                                    nativeToken.balance,
                                    nativeToken.token.decimals
                                ),
                                5
                            )}
                            {` ${nativeToken.token.symbol})`}
                        </span>
                        <span className="text-xs text-gray-600">
                            {formatHash(accountData.address)}
                        </span>
                        <CopyTooltip copied={copied} />
                    </button>
                </div>
            </div>
            <div className="flex flex-col px-6 py-3 space-y-0.5 text-sm text-gray-800 break-words">
                {formatSignatureData(method, data)}
            </div>
        </PopupLayout>
    )
}

export default SignPage
