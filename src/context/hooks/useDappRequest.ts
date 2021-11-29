import { useBlankState } from "../background/backgroundHooks"

// Type of dapp request
export enum DappReq {
    ASSET = "ASSET",
    SIGNING = "SIGNING",
    SWITCH_NETWORK = "SWITCH_NETWORK",
}

export const useDappRequest = () => {
    const { dappRequests } = useBlankState()!

    // If no requests left, return undefined
    if (
        typeof dappRequests === "undefined" ||
        (typeof dappRequests === "object" &&
            Object.keys(dappRequests).length === 0)
    ) {
        return undefined
    }

    // Get the object entries ordered by submission time
    const requests = Object.entries(dappRequests).sort(
        ([_id, { time: timeA }], [_id2, { time: timeB }]) => timeA - timeB
    )

    // Get first dApp request (origin, site data and parameters)
    const [
        requestId,
        { origin, siteMetadata, params: dappReqData, type },
    ] = requests[0]

    // Get requests count
    const requestCount = requests.length

    return {
        dappReqData,
        requestCount,
        requestId,
        origin,
        siteMetadata,
        type,
    }
}
