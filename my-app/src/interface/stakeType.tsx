import { CCardImageProps } from "@coreui/react/dist/components/card/CCardImage";
import { tokenState } from "../state/types";

export interface IStakeType {
    minDays: number,
    unStakeFee: number,
    harvestFee: number,
    ApyRate: number,
    status: boolean,
    isLocked: boolean
}

export interface IAuthContextState {
    isConnected: boolean,
    setIsConnected: Function,
    loaderShow: boolean,
    setLoaderShow: Function,
    wallet: string | undefined,
    setWallet: Function,
    web3Provider: string | undefined,
    setWeb3Provider: Function,
    chainId: Number,
    setChainId: Function,
    tokenData: tokenState,
    setTokenData: Function,
    NFTData: tokenState,
    setNFTData: Function,
}


declare global {
    interface Window {
        ethereum: any        
        web3: any;
    }
}