import { IStakeType } from "../interface/stakeType";

export const PRODUCT_MODE:boolean = false;

export const MAIN_NET:string = "https://cronos-testnet-3.crypto.org:8545/";
export const TEST_NET:string = "https://cronos-testnet-3.crypto.org:8545/";

export const MAIN_CAINID:number = 0x19;
export const TEST_CAINID:number = 0x152;

// token contract address
export const MAIN_TOKEN_ADDR:string = "0x6E0D5Bd8e9eB62FBC29D372a8e1Ce6023B29BBcB";
export const TEST_TOKEN_ADDR:string = "0x6E0D5Bd8e9eB62FBC29D372a8e1Ce6023B29BBcB";

// token staking contract address
export const MAIN_TOKEN_STAKING_ADDR:string = "0x88148635c5088474b925f469D74682f520Eb6F22";
export const TEST_TOKEN_STAKING_ADDR:string = "0x88148635c5088474b925f469D74682f520Eb6F22";

// nft contract address
export const MAIN_NFT_ADDR:string = "0x9c2bfABF66187F4D95b098700B394a5092f36c58";
export const TEST_NFT_ADDR:string = "0x9c2bfABF66187F4D95b098700B394a5092f36c58";

// nft staking contract address
export const MAIN_NFT_STAKING_ADDR:string = "0xE449eD1baf58CB7940117D6DBFC9e0c44f438CfE";
export const TEST_NFT_STAKING_ADDR:string = "0xE449eD1baf58CB7940117D6DBFC9e0c44f438CfE";

export const stakeTypeData:IStakeType = {
    minDays: 7,
    unStakeFee: 10,
    harvestFee: 12,
    ApyRate: 140,
    status: false,
    isLocked:true
};

