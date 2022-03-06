import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { ButtonWithLoading } from "../../components/button/ButtonWithLoading"
import ToggleButton from "../../components/button/ToggleButton"
import SuccessDialog from "../../components/dialog/SuccessDialog"
import PopupFooter from "../../components/popup/PopupFooter"
import PopupHeader from "../../components/popup/PopupHeader"
import PopupLayout from "../../components/popup/PopupLayout"
import { useBlankState } from "../../context/background/backgroundHooks"
import { setUserSettings } from "../../context/commActions"
import useAsyncInvoke from "../../util/hooks/useAsyncInvoke"

const AddressWarningPreferencesPage = () => {
    const { settings } = useBlankState()!
    const { run, isSuccess, isError, isLoading } = useAsyncInvoke()
    const history = useHistory()
    const [
        newAddressWarningSetting,
        setNewAddressWarningSetting,
    ] = useState<boolean>(settings.hideAddressWarning)
    const onSave = async () => {
        run(
            setUserSettings({
                ...settings,
                hideAddressWarning: newAddressWarningSetting,
            })
        )
    }
    if (isError) {
        throw new Error("Could not update the address warning configuration.")
    }
    const isDirty = newAddressWarningSetting !== settings.hideAddressWarning
    return (
        <PopupLayout
            header={<PopupHeader title="Address Warning" close="/" />}
            footer={
                <PopupFooter>
                    <ButtonWithLoading
                        label="Save"
                        disabled={!isDirty}
                        onClick={onSave}
                        isLoading={isLoading}
                    />
                </PopupFooter>
            }
        >
            <div className="flex flex-col p-6 space-y-6 w-full">
                <span className="text-sm text-gray-500">
                    Warn when a transaction account is different from the one
                    selected in the wallet.
                </span>
                <SuccessDialog
                    open={isSuccess}
                    title="Address Warning"
                    timeout={800}
                    message="Your changes have been succesfully saved!"
                    onDone={history.goBack}
                />
                <ToggleButton
                    label="Show Different Addresses Warning"
                    defaultChecked={newAddressWarningSetting}
                    onToggle={setNewAddressWarningSetting}
                />
            </div>
        </PopupLayout>
    )
}

export default AddressWarningPreferencesPage