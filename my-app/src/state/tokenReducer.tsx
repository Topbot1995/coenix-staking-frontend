import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { stakeTypeData, TEST_TOKEN_ADDR, TEST_TOKEN_STAKING_ADDR } from "../config/constants";
import { getAccount, getContract } from "../utils/contractHelper";
import tokenABI from '../ABI/tokenABI.json';
import stakingABI from '../ABI/tokenStakeABI.json';
import BigNumber from "bignumber.js";
const initialState = {
    balance: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    tvl: new BigNumber(0),
    stakers: 0,
    stakingInfo: stakeTypeData,
    isConnected: false,
    wallet: "",
    loading: false,
}

export const connectToken = createAsyncThunk<any, { web3Provider: string; chainId: Number }>(
    'token/connectToken', async ({ web3Provider, chainId }) => {
        const data = await fetchTokenData(web3Provider, chainId);
        console.log(data)
        return data;
    }
)

export const fetchTokenData = async (Web3Provider: string, chainId: Number) => {

    const wallet: string[] = await getAccount(Web3Provider);
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);
    const balance: BigNumber = await tokenContract.methods.balanceOf(wallet[0]).call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('balance' + balance);
    const stakedBalance: BigNumber = await stakeContract.methods.getStakedAmount().call(function (error: any, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('stakedBalance' + stakedBalance);
    const tvl: BigNumber = await stakeContract.methods.getTVL().call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('tvl' + tvl);
    const stakers: number = await stakeContract.methods.getTotalStakers().call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('stakers' + stakers);
    let stakingInfo: any = await stakeContract.methods.getStakeInfo().call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    // stakingInfo = {
    //     minDays: stakingInfo[0],
    //     unStakeFee: stakingInfo[1],
    //     harvestFee: 12,
    //     ApyRate: 120,
    //     status: false,
    // }
    stakingInfo = Object.values(stakingInfo);
    stakingInfo = {
        minDays: stakingInfo[0],
        unStakeFee: stakingInfo[1],
        harvestFee: 12,
        ApyRate: 120,
        status: false,
    }
    console.log('end' + stakingInfo);
    return {
        balance: balance,
        stakedBalance: stakedBalance,
        tvl: tvl,
        stakers: stakers,
        stakingInfo: stakingInfo,
        isConnected: true,
        wallet: wallet[0],
        loading: false
    };
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectToken.pending, (state) => {
                state.loading = true;
                console.log(state.loading);
            })
            .addCase(connectToken.fulfilled, (state, action) => {
                state.balance = new BigNumber(1000)
            })
            .addDefaultCase((state, action) => { });
    }
})

export default tokenSlice.reducer;