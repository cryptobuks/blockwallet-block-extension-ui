import React, { FunctionComponent, useRef, useState, useEffect } from "react"
import classnames from "classnames"
import { BigNumber } from "ethers"

import { formatUnits, parseUnits } from "ethers/lib/utils"
import * as yup from "yup"
import { InferType } from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { GasPriceLevels } from "@blank/background/controllers/GasPricesController"
import { TransactionFeeData } from "@blank/background/controllers/erc-20/transactions/SignedTransaction"

// Components
import HorizontalSelect from "../input/HorizontalSelect"
import Tooltip from "../../components/label/Tooltip"
import { AiFillInfoCircle } from "react-icons/ai"
import { ImCheckmark } from "react-icons/im"
import Spinner from "../Spinner"
import Dialog from "../dialog/Dialog"
import EndLabel from "../input/EndLabel"
import { ButtonWithLoading as Button } from "../button/ButtonWithLoading"

// Utils
import { capitalize } from "../../util/capitalize"
import {
    handleKeyDown,
    handleChangeAmountGwei,
    handleChangeAmountWei,
    makeStringNumberFormField,
} from "../../util/form"
import { useOnClickOutside } from "../../util/useOnClickOutside"
import { formatCurrency, toCurrencyAmount } from "../../util/formatCurrency"
import { formatRounded } from "../../util/formatRounded"

// Assets
import { Classes } from "../../styles"
import { ArrowUpDown } from "../icons/ArrowUpDown"
import CloseIcon from "../icons/CloseIcon"

// Context
import { useBlankState } from "../../context/background/backgroundHooks"
import { useSelectedNetwork } from "../../context/hooks/useSelectedNetwork"
import { useGasPriceData } from "../../context/hooks/useGasPriceData"
import WarningDialog from "../dialog/WarningDialog"

interface GasComponentProps {
    symbol: string
    nativeCurrencyIcon: string
    gasFees: TransactionFeeData
    selectedOption: GasPriceOption
    options: GasPriceOption[]
    setSelectedGas: (option: GasPriceOption) => void
    getGasOption: (label: string, gasFees: TransactionFeeData) => GasPriceOption
}

interface GasPriceOption {
    label: string
    gasFees: TransactionFeeData
    //EIP-1559: range
    totalETHCostRange: string
    totalNativeCurrencyCostRange: string
    totalETHCost: string
    totalNativeCurrencyCost: string
}

type TransactionSpeed = {
    [key: string]: TransactionFeeData
}

const getTransactionSpeeds = (gasPrices: GasPriceLevels): TransactionSpeed => {
    return {
        low: {
            maxPriorityFeePerGas: BigNumber.from(
                gasPrices.slow.maxPriorityFeePerGas
            ),
            maxFeePerGas: BigNumber.from(gasPrices.slow.maxFeePerGas),
        },
        medium: {
            maxPriorityFeePerGas: BigNumber.from(
                gasPrices.average.maxPriorityFeePerGas
            ),
            maxFeePerGas: BigNumber.from(gasPrices.average.maxFeePerGas),
        },
        high: {
            maxPriorityFeePerGas: BigNumber.from(
                gasPrices.fast.maxPriorityFeePerGas
            ),
            maxFeePerGas: BigNumber.from(gasPrices.fast.maxFeePerGas),
        },
    }
}
// Basic Tab. Shows 3 levels of gas calculated with values received from state.
const GasSelectorBasic = (props: GasComponentProps) => {
    const {
        selectedOption,
        options,
        setSelectedGas,
        nativeCurrencyIcon,
        symbol,
    } = props

    const nativeCurrencyWidths = options.map((option) => {
        const nativeIntLenght = option.totalNativeCurrencyCost
            .replace("$", "")
            .replace(/\.[0-9]+/, "")
            .trim().length

        return `w-${
            nativeIntLenght === 1 ? 28 : nativeIntLenght === 2 ? 32 : 40
        }`
    })

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full space-y">
                {options.map((option, i) => (
                    <div
                        key={option.label}
                        className="w-full flex flex-row items-center p-2 cursor-pointer rounded-md hover:bg-gray-100"
                        onClick={() => {
                            setSelectedGas(option)
                        }}
                    >
                        <div className="flex flex-col flex-grow items-start px-2 py-1 w-11/12">
                            <label
                                className={classnames(
                                    "text-base font-semibold mb-2 cursor-pointer capitalize",
                                    selectedOption.label === option.label &&
                                        "text-primary-300"
                                )}
                            >
                                {option.label}
                            </label>{" "}
                            <div className="flex flex-row w-full items-center justify-start">
                                <div className={nativeCurrencyWidths[i]}>
                                    <span
                                        className={classnames(
                                            "text-xs",
                                            selectedOption.label ===
                                                option.label &&
                                                "text-primary-300"
                                        )}
                                    >
                                        {option.totalNativeCurrencyCostRange}
                                    </span>
                                </div>
                                <div className="flex flex-row space-x-2 items-center justify-start w-44">
                                    <div className="justify-self-start">
                                        <img
                                            src={nativeCurrencyIcon}
                                            alt={symbol}
                                            width="20px"
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <span
                                            className={classnames(
                                                "text-xs",
                                                selectedOption.label ===
                                                    option.label &&
                                                    "text-primary-300"
                                            )}
                                        >
                                            {option.totalETHCostRange}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-1/12">
                            <ImCheckmark
                                className={classnames(
                                    "text-sm",
                                    selectedOption.label === option.label
                                        ? "text-primary-300"
                                        : "hidden"
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Schema
const schema = yup.object({
    gasLimit: makeStringNumberFormField("Gas Limit is required", false),
    maxPriorityFeePerGas: makeStringNumberFormField(
        "Max tip is required",
        true
    ),
    maxFeePerGas: makeStringNumberFormField("Max fee is required", false),
})
type GasAdvancedForm = InferType<typeof schema>

// Advanced tab. Allows users to enter manual fee values.
const GasSelectorAdvanced = (props: GasComponentProps) => {
    const { gasFees, selectedOption, getGasOption, setSelectedGas } = props
    const {
        estimatedBaseFee: baseFeePerGas,
        gasPricesLevels,
    } = useGasPriceData()
    const { gasLowerCap } = useSelectedNetwork()

    const defaultFees: TransactionFeeData = {
        gasLimit: gasFees.gasLimit,
        maxPriorityFeePerGas:
            gasFees.maxPriorityFeePerGas ??
            BigNumber.from(gasPricesLevels.average.maxPriorityFeePerGas),
        maxFeePerGas:
            gasFees.maxFeePerGas ??
            BigNumber.from(gasPricesLevels.average.maxFeePerGas),
    }
    const [isCustom, setIsCustom] = useState<boolean>(
        selectedOption.label === "Custom"
    )
    const averageTip = BigNumber.from(
        gasPricesLevels.average.maxPriorityFeePerGas
    )

    const {
        register,
        handleSubmit,
        errors,
        setValue,
        getValues,
        setError,
    } = useForm<GasAdvancedForm>({
        defaultValues: {
            gasLimit: formatUnits(
                isCustom
                    ? selectedOption.gasFees.gasLimit!
                    : defaultFees.gasLimit!,
                "wei"
            ),
            maxPriorityFeePerGas: formatUnits(
                isCustom
                    ? selectedOption.gasFees.maxPriorityFeePerGas!
                    : defaultFees.maxPriorityFeePerGas!,
                "gwei"
            ),
            maxFeePerGas: formatUnits(
                isCustom
                    ? selectedOption.gasFees.maxFeePerGas!
                    : defaultFees.maxFeePerGas!,
                "gwei"
            ),
        },
        resolver: yupResolver(schema),
    })

    const handleCustomChange = () => {
        setIsCustom(true)
        setValue("gasLimit", formatUnits(defaultFees.gasLimit!, "wei"))
        setValue(
            "maxPriorityFeePerGas",
            formatUnits(defaultFees.maxPriorityFeePerGas!, "gwei")
        )
        setValue("maxFeePerGas", formatUnits(defaultFees.maxFeePerGas!, "gwei"))
    }

    const validateFees = (fees: TransactionFeeData) => {
        // Clean warnings
        setGasLimitWarning("")
        setMaxFeeWarning("")
        setTipWarning("")

        const baseFee = BigNumber.from(baseFeePerGas)

        // Validations
        if (fees.gasLimit?.lt(defaultFees.gasLimit!)) {
            setGasLimitWarning("Gas limit lower than suggested")
        }

        if (fees.maxFeePerGas?.lt(baseFee)) {
            setMaxFeeWarning("Max fee lower than base fee")
        }

        if (fees.maxFeePerGas?.lt(baseFee.add(fees.maxPriorityFeePerGas!))) {
            setError("maxFeePerGas", {
                message: "Max fee lower than base fee + tip",
            })
        }

        if (
            gasLowerCap &&
            gasLowerCap.maxFeePerGas &&
            fees.maxFeePerGas?.lt(gasLowerCap.maxFeePerGas)
        ) {
            setMaxFeeWarning("Max fee lower than network limit")
        }

        if (fees.maxPriorityFeePerGas?.lt(averageTip)) {
            setTipWarning(
                `Tip lower than suggested tip of ${formatUnits(
                    averageTip,
                    "gwei"
                )} Gwei`
            )
        }

        if (
            gasLowerCap &&
            gasLowerCap.maxPriorityFeePerGas &&
            fees.maxPriorityFeePerGas?.lt(gasLowerCap.maxPriorityFeePerGas)
        ) {
            setMaxFeeWarning("Tip lower than network limit")
        }
    }

    const handleBlur = () => {
        const values = getValues()

        const fees: TransactionFeeData = {
            gasLimit: BigNumber.from(
                values.gasLimit === "" ? "0" : values.gasLimit
            ),
            maxPriorityFeePerGas: parseUnits(
                values.maxPriorityFeePerGas === ""
                    ? "0"
                    : values.maxPriorityFeePerGas,
                "gwei"
            ),
            maxFeePerGas: parseUnits(
                values.maxFeePerGas === "" ? "0" : values.maxFeePerGas,
                "gwei"
            ),
        }

        validateFees(fees)
    }

    const handleSave = handleSubmit(async (values: GasAdvancedForm) => {
        const fees: TransactionFeeData = {
            gasLimit: BigNumber.from(values.gasLimit),
            maxPriorityFeePerGas: parseUnits(
                values.maxPriorityFeePerGas,
                "gwei"
            ),
            maxFeePerGas: parseUnits(values.maxFeePerGas, "gwei"),
        }

        const custom = getGasOption("Custom", fees)
        setSelectedGas(custom)
    })

    const [gasLimitWarning, setGasLimitWarning] = useState("")
    const [tipWarning, setTipWarning] = useState("")
    const [maxFeeWarning, setMaxFeeWarning] = useState("")

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full space-y-3 px-3 pb-3">
                <div className="flex flex-col">
                    <label className="leading-loose text-xs font-medium mb-1 text-gra">
                        Gas Limit
                    </label>
                    <input
                        type="text"
                        name="gasLimit"
                        ref={register}
                        className={classnames(
                            Classes.inputBordered,
                            "w-full",
                            !isCustom && "text-gray-400",
                            errors.gasLimit
                                ? "border-red-400 focus:border-red-600"
                                : gasLimitWarning
                                ? "border-yellow-400 focus:border-yellow-600"
                                : ""
                        )}
                        autoComplete="off"
                        onKeyDown={handleKeyDown}
                        onInput={handleChangeAmountWei((value) => {
                            setValue("gasLimit", value, {
                                shouldValidate: true,
                            })
                        })}
                        placeholder={formatUnits(
                            isCustom
                                ? selectedOption.gasFees.gasLimit!
                                : defaultFees.gasLimit!,
                            "wei"
                        )}
                        onFocus={() => {
                            !isCustom && handleCustomChange()
                        }}
                        onBlur={() => {
                            handleBlur()
                        }}
                        tabIndex={1}
                    />

                    {/* ERROR */}
                    <span
                        className={classnames(
                            "text-xs",
                            errors.gasLimit
                                ? "text-red-500"
                                : gasLimitWarning
                                ? "text-yellow-500"
                                : "m-0 h-0"
                        )}
                    >
                        {errors.gasLimit?.message || gasLimitWarning || ""}
                    </span>
                </div>
                <div className="flex flex-col relative">
                    <label className="leading-loose text-xs font-medium  mb-1">
                        Max Tip (per gas)
                    </label>
                    <EndLabel label="GWEI">
                        <input
                            type="text"
                            name="maxPriorityFeePerGas"
                            ref={register}
                            className={classnames(
                                Classes.inputBordered,
                                "w-full",
                                !isCustom && "text-gray-400",
                                errors.maxPriorityFeePerGas
                                    ? "border-red-400 focus:border-red-600"
                                    : tipWarning
                                    ? "border-yellow-400 focus:border-yellow-600"
                                    : ""
                            )}
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                            onInput={handleChangeAmountGwei((value) => {
                                setValue("maxPriorityFeePerGas", value, {
                                    shouldValidate: true,
                                })
                            })}
                            placeholder={formatUnits(
                                isCustom
                                    ? selectedOption.gasFees
                                          .maxPriorityFeePerGas!
                                    : defaultFees.maxPriorityFeePerGas!,
                                "gwei"
                            )}
                            onFocus={() => {
                                !isCustom && handleCustomChange()
                            }}
                            onBlur={() => {
                                handleBlur()
                            }}
                            tabIndex={2}
                        />
                        <div
                            className={classnames(
                                "absolute inset-y-0 right-8 flex items-center"
                            )}
                        >
                            <span className="text-gray-500 text-sm">GWEI</span>
                        </div>
                    </EndLabel>
                    {/* ERROR */}
                    <span
                        className={classnames(
                            "text-xs",
                            errors.maxPriorityFeePerGas
                                ? "text-red-500"
                                : tipWarning
                                ? "text-yellow-500"
                                : "m-0 h-0"
                        )}
                    >
                        {errors.maxPriorityFeePerGas?.message ||
                            tipWarning ||
                            ""}
                    </span>
                </div>
                <div className="flex flex-col relative">
                    <label className="leading-loose text-xs font-medium  mb-1">
                        Max fee (per gas)
                    </label>
                    <div className="flex flex-row relative w-full">
                        <input
                            type="text"
                            name="maxFeePerGas"
                            ref={register}
                            className={classnames(
                                Classes.inputBordered,
                                "w-full",
                                !isCustom && "text-gray-400",
                                errors.maxFeePerGas
                                    ? "border-red-400 focus:border-red-600"
                                    : maxFeeWarning
                                    ? "border-yellow-400 focus:border-yellow-600"
                                    : ""
                            )}
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                            onInput={handleChangeAmountGwei((value) => {
                                setValue("maxFeePerGas", value, {
                                    shouldValidate: true,
                                })
                            })}
                            placeholder={formatUnits(
                                isCustom
                                    ? selectedOption.gasFees.maxFeePerGas!
                                    : defaultFees.maxFeePerGas!,
                                "gwei"
                            )}
                            onFocus={() => {
                                !isCustom && handleCustomChange()
                            }}
                            onBlur={() => {
                                handleBlur()
                            }}
                            tabIndex={3}
                        />
                        <div
                            className={classnames(
                                "absolute inset-y-0 right-8 flex items-center"
                            )}
                        >
                            <span className="text-gray-500 text-sm">GWEI</span>
                        </div>
                    </div>
                    {/* ERROR */}
                    <span
                        className={classnames(
                            "text-xs",
                            errors.maxFeePerGas
                                ? "text-red-500"
                                : maxFeeWarning
                                ? "text-yellow-500"
                                : "m-0 h-0"
                        )}
                    >
                        {errors.maxFeePerGas?.message || maxFeeWarning || ""}
                    </span>
                </div>
                <span className="text-gray-500 text-xs">
                    Last base fee: {formatUnits(baseFeePerGas!, "gwei")} GWEI
                </span>
            </div>
            <div>
                <hr className="absolute left-0 border-0.5 border-gray-200 w-full" />
                <div className="flex flex-row w-full items-center pt-5 justify-between space-x-4 mt-auto px-4">
                    <Button
                        label="Save"
                        buttonClass={Classes.button}
                        type="button"
                        onClick={handleSave}
                        disabled={
                            Object.values(errors).filter(
                                (v) => v.message !== ""
                            ).length > 0
                        }
                    />
                </div>
            </div>
        </div>
    )
}

const tabs = [
    {
        label: "Basic",
        component: GasSelectorBasic,
    },
    {
        label: "Advanced",
        component: GasSelectorAdvanced,
    },
]

// Main Component
const GasPriceComponent: FunctionComponent<{
    defaultGas: {
        feeData: TransactionFeeData
        defaultLevel?: "low" | "medium" | "high"
    } // can receive either custom values (i.e. dApps or estimation) or a level to set as default basic value
    setGas: (gasFees: TransactionFeeData) => void
    disabled?: boolean
    isParentLoading?: boolean
    showEstimationError?: boolean
    displayOnlyMaxValue?: boolean
}> = ({
    defaultGas,
    setGas,
    isParentLoading,
    disabled,
    showEstimationError,
    displayOnlyMaxValue = false,
}) => {
    //Popup variables
    const ref = useRef(null)
    const [active, setActive] = useState(false)
    useOnClickOutside(ref, () => setActive(false))

    //State
    const {
        exchangeRates,
        nativeCurrency,
        localeInfo,
        networkNativeCurrency,
    } = useBlankState()!

    const {
        estimatedBaseFee: baseFeePerGas,
        gasPricesLevels,
    } = useGasPriceData()

    const {
        defaultNetworkLogo,
        nativeCurrency: { decimals: nativeCurrencyDecimals },
    } = useSelectedNetwork()

    const [baseFee, setBaseFee] = useState<BigNumber>(
        BigNumber.from(baseFeePerGas)
    )

    const [showEstimationWarning, setShowEstimationWarning] = useState(
        showEstimationError ?? false
    )

    const [
        transactionSpeeds,
        setTransactionSpeeds,
    ] = useState<TransactionSpeed>(getTransactionSpeeds(gasPricesLevels))

    const getGasOption = (label: string, gasFees: TransactionFeeData) => {
        // MinValue: (baseeFee + tip) * gasLimit
        // We assume that the baseFee could at most be reduced 25% in next 2 blocks so for calculating the min value we apply that reduction.

        // 25% of BaseFee => (baseFee * 25) / 100
        const percentage = baseFee
            .mul(BigNumber.from(25))
            .div(BigNumber.from(100))
        const minBaseFee = baseFee.sub(percentage)
        const minValue = minBaseFee
            .add(gasFees.maxPriorityFeePerGas!)
            .mul(gasFees.gasLimit!)

        // MaxValue: maxFeePerGas * gasLimit
        const maxValue = gasFees.maxFeePerGas!.mul(gasFees.gasLimit!)

        // When the user is applying a custom value, we check if the maxValue calculated is lower than the minValue, it means that the maxFee that the user is willing
        // to pay is lower than the min value calculated using baseFee + tip, so we will only display that value and not a range

        // Flag to determinate if we should display only a max value

        const minValueNativeCurrency = formatCurrency(
            toCurrencyAmount(
                minValue.lt(maxValue) ? minValue : maxValue,
                exchangeRates[networkNativeCurrency.symbol],
                nativeCurrencyDecimals
            ),
            {
                currency: nativeCurrency,
                locale_info: localeInfo,
                showCurrency: false,
                showSymbol: true,
                precision: 2,
            }
        )

        const maxValueNativeCurrency = formatCurrency(
            toCurrencyAmount(
                minValue.gt(maxValue) ? minValue : maxValue,
                exchangeRates[networkNativeCurrency.symbol],
                nativeCurrencyDecimals
            ),
            {
                currency: nativeCurrency,
                locale_info: localeInfo,
                showCurrency: false,
                showSymbol: true,
                precision: 2,
            }
        )

        const minValueFormatted = formatRounded(
            formatUnits(minValue.lt(maxValue) ? minValue : maxValue),
            5
        )

        const maxValueFormatted = formatRounded(
            formatUnits(minValue.gt(maxValue) ? minValue : maxValue),
            5
        )

        // For parent's label, apply displayOnlyMaxValue flag. Otherwise always display range
        const totalETHCost =
            (label !== "Custom" || minValue.lte(maxValue)) &&
            !displayOnlyMaxValue
                ? `${minValueFormatted} - ${maxValueFormatted}`
                : `${formatRounded(formatUnits(maxValue), 5)}`

        const totalNativeCurrencyCost =
            (label !== "Custom" || minValue.lte(maxValue)) &&
            !displayOnlyMaxValue
                ? `${minValueNativeCurrency} - ${maxValueNativeCurrency}`
                : maxValueNativeCurrency

        const totalETHCostRange =
            label !== "Custom" || minValue.lte(maxValue)
                ? `${minValueFormatted} - ${maxValueFormatted}`
                : `${formatRounded(formatUnits(maxValue), 5)}`

        const totalNativeCurrencyCostRange =
            label !== "Custom" || minValue.lte(maxValue)
                ? `${minValueNativeCurrency} - ${maxValueNativeCurrency}`
                : maxValueNativeCurrency

        return {
            label,
            gasFees,
            totalETHCost,
            totalNativeCurrencyCost,
            totalETHCostRange,
            totalNativeCurrencyCostRange,
        } as GasPriceOption
    }

    const [gasOptions, setGasOptions] = useState<GasPriceOption[]>([])

    // Selected gas state
    const [selectedGas, setSelectedGas] = useState<GasPriceOption>()

    // Tabs variables
    const [tab, setTab] = useState(tabs[!defaultGas.defaultLevel ? 1 : 0])
    const TabComponent = tab.component
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    // Effects
    useEffect(() => {
        // Waits till parent component finishes loading (estimation and transaction values)
        if (isParentLoading) {
            // This means there was a change on parent component that is updating values so we should reload all values.
            if (isLoaded) setIsLoaded(false)

            // keeps waiting for parent to finish
            return
        }

        //Update transaction speeds
        setTransactionSpeeds(getTransactionSpeeds(gasPricesLevels))

        //Get & set gas options
        let speedOptions: GasPriceOption[] = []
        for (let speed in transactionSpeeds) {
            speedOptions.push(
                getGasOption(speed, {
                    gasLimit: defaultGas.feeData.gasLimit,
                    maxPriorityFeePerGas:
                        transactionSpeeds[speed].maxPriorityFeePerGas,
                    maxFeePerGas: transactionSpeeds[speed].maxFeePerGas,
                })
            )
        }
        setGasOptions(speedOptions)

        // First load will check if comp received default values or level
        if (!isLoaded) {
            // If the default gas was set to a basic level, update the selected option with the new gas values
            if (defaultGas.defaultLevel) {
                const defaultOption = speedOptions.find(
                    (s) => s.label === defaultGas.defaultLevel
                )

                if (defaultOption) {
                    setSelectedGas(defaultOption)
                    setGas(defaultOption.gasFees!)
                    setTab(tabs[0])
                }
            } else {
                // If the default gas was set to custom values, update them and set the advance tab as active
                const defaultOption = getGasOption("Custom", defaultGas.feeData)
                setSelectedGas(defaultOption)
                setGas(defaultOption.gasFees!)
                setTab(tabs[1])
            }
        }

        setIsLoaded(true)

        //Updated selected gas on gas price change
        if (isLoaded && selectedGas!.label !== "Custom") {
            const selected = speedOptions.find(
                (s) => s.label === selectedGas!.label
            )
            if (selected) {
                setSelectedGas(selected)
                setGas(selectedGas!.gasFees!)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isParentLoading, gasPricesLevels, defaultGas.feeData.gasLimit])

    useEffect(() => {
        setBaseFee(BigNumber.from(baseFeePerGas))
    }, [baseFeePerGas])

    // Effect to check if estimation failed when switching to a new tx
    useEffect(() => {
        if (showEstimationError && !showEstimationWarning)
            setShowEstimationWarning(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEstimationError])

    return (
        <>
            {/* Label */}
            <div
                className={classnames(
                    Classes.blueSection,
                    active && Classes.blueSectionActive
                )}
                onClick={() =>
                    !disabled &&
                    !isParentLoading &&
                    isLoaded &&
                    setActive(!active)
                }
            >
                <div
                    className={classnames(
                        "flex justify-start w-full items-center",
                        displayOnlyMaxValue && "space-x-4"
                    )}
                >
                    <div className={"text-xs font-semibold"}>
                        {isParentLoading || !isLoaded
                            ? "Loading prices..."
                            : capitalize(selectedGas!.label)}
                    </div>

                    <div className="flex flex-row w-full items-center justify-around text-xs">
                        {!isParentLoading &&
                            isLoaded &&
                            (displayOnlyMaxValue ? (
                                <div className="flex flex-row w-full items-center space-x-4">
                                    <span className="text-xs text-gray-600">
                                        {selectedGas!.totalNativeCurrencyCost}
                                    </span>
                                    <div className="flex flex-row space-x-1 items-center">
                                        <img
                                            src={defaultNetworkLogo}
                                            alt={networkNativeCurrency.symbol}
                                            width="20px"
                                            draggable={false}
                                        />
                                        <span className="text-xs">
                                            {selectedGas!.totalETHCost}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-xs text-gray-600">
                                        {selectedGas!.totalNativeCurrencyCost}
                                    </span>
                                    <div className="flex flex-row space-x-1 items-center justify-self-end">
                                        <div className="justify-self-start">
                                            <img
                                                src={defaultNetworkLogo}
                                                alt={
                                                    networkNativeCurrency.symbol
                                                }
                                                width="20px"
                                                draggable={false}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <span className="text-xs">
                                                {selectedGas!.totalETHCost}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ))}
                    </div>
                </div>
                <div className="flex justify-end items-center w-4 h-full">
                    {isParentLoading || !isLoaded ? (
                        <Spinner />
                    ) : (
                        <ArrowUpDown active={active} />
                    )}
                </div>
            </div>
            <WarningDialog
                open={showEstimationWarning}
                onDone={() => setShowEstimationWarning(false)}
                title="Gas estimation failed"
                message="There was an error estimating fee values. This transaction might fail when confirmed."
            />
            {/* Modal */}

            <Dialog open={active} onClickOutside={() => setActive(false)}>
                <span className="absolute top-0 right-0 p-4 z-50">
                    <div
                        onClick={() => setActive(false)}
                        className=" cursor-pointer p-2 ml-auto -mr-2 text-gray-900 transition duration-300 rounded-full hover:bg-primary-100 hover:text-primary-300"
                    >
                        <CloseIcon size="10" />
                    </div>
                </span>
                <div>
                    <div className="flex flex-col w-full space-y-2">
                        <div className="z-10 flex flex-row items-center p-2 bg-white bg-opacity-75">
                            <h2 className="p-0 text-lg font-bold">Gas Price</h2>
                            <div className="group relative">
                                <a
                                    href="https://ethereum.org/en/developers/docs/gas/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <AiFillInfoCircle
                                        size={26}
                                        className="pl-2 text-primary-200 cursor-pointer hover:text-primary-300"
                                    />
                                </a>
                                <Tooltip
                                    content={
                                        <div className="flex flex-col font-normal items-start text-xs text-white-500">
                                            <div className="flex flex-row items-end space-x-7">
                                                <span>
                                                    Gas is used to operate on
                                                    the network.
                                                </span>{" "}
                                            </div>
                                            <div className="flex flex-row items-end space-x-4">
                                                <span>
                                                    Click on this icon to learn
                                                    more.
                                                </span>{" "}
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                        <HorizontalSelect
                            options={tabs}
                            value={tab}
                            onChange={setTab}
                            display={(t) => t.label}
                            disableStyles
                            optionClassName={(value) =>
                                `flex-1 flex flex-row items-center justify-center p-3 text-sm
                                            ${
                                                tab === value
                                                    ? "border-primary-300 border-b-2 text-primary-300 font-bold"
                                                    : "border-gray-200 text-gray-500 border-b"
                                            }`
                            }
                            containerClassName="flex flex-row -ml-3"
                            containerStyle={{
                                width: "calc(100% + 1.5rem)",
                            }}
                        />
                        <TabComponent
                            symbol={networkNativeCurrency.symbol}
                            nativeCurrencyIcon={defaultNetworkLogo}
                            options={gasOptions}
                            gasFees={defaultGas.feeData}
                            selectedOption={selectedGas!}
                            setSelectedGas={(option: GasPriceOption) => {
                                setSelectedGas(option)
                                setGas(option.gasFees)
                                setShowEstimationWarning(false)
                                setActive(false)
                            }}
                            getGasOption={getGasOption}
                        />
                    </div>
                </div>
                {/*</div>*/}
            </Dialog>
        </>
    )
}

export default GasPriceComponent
