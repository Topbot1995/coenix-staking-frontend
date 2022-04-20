import BigNumber from "bignumber.js";
import { stakeTypeData } from "../config/constants";
import { IStakeType } from "../interface/stakeType";

export interface tokenState {
    balance: BigNumber,
    stakedBalance: BigNumber,
    tvl: BigNumber,
    stakers: number,
    reward: BigNumber,
    unStakeFee:BigNumber,
    stakingInfo: IStakeType,
    isLocked: string,
    isConnected: boolean,
    wallet: string,
    loading: boolean,
    rewardPerBlock: BigNumber
}

export interface NFTState {
    balance: BigNumber[],
    balanceURIs: number[],
    StakeURIs: number[],
    stakedBalance: BigNumber[],    
    tvl: BigNumber,    
    stakers: number,
    reward: BigNumber,    
    isConnected: boolean,
    wallet: string,
    loading: boolean,
    minDays: BigNumber,    
}


export interface state {
    token: tokenState,
    nft: tokenState,
}

export const initalState = {
    token: {
        balance: "0",
        stakedBalance: "0",
        tvl: "0",
        stakers: 0,
        stakingInfo: stakeTypeData,
        isConnected: false,
        wallet: "",
        loading: false
    },
    nft: {
        balance: "0",
        stakedBalance: "0",
        tvl: "0",
        stakers: 0,
        stakingInfo: stakeTypeData,
        isConnected: false,
        wallet: "",
        loading: false
    }
}
