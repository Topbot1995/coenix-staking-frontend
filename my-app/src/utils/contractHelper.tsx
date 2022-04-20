import BigNumber from "bignumber.js";
import Web3 from "web3";
import tokenABI from '../ABI/tokenABI.json';
import stakingABI from '../ABI/tokenStakeABI.json';
import { TEST_TOKEN_ADDR, TEST_TOKEN_STAKING_ADDR } from "../config/constants";

export const getContract = (abi: any, address: string, web3Provider: string) => {
    const currentWeb3 = new Web3(web3Provider);
    return new currentWeb3.eth.Contract(abi, address);
};

export const getAccount = async (web3Provider: string) => {
    const currentWeb3 = new Web3(web3Provider);
    let account = await currentWeb3.eth.getAccounts((error: any, accounts: string[]) => {
        if (error) {
            console.log(error);
            return;
        }
        return accounts;
    });

    return account;
}


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
    const stakedBalance: BigNumber = await stakeContract.methods.getStakedAmount().call({from: wallet[0]},function (error: any, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    const isLocked: string = await stakeContract.methods.isLocked(wallet[0]).call(function (error: any, res: any) {
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
    const unStakeFee: BigNumber = await stakeContract.methods.getUnstakeFeePercent(wallet[0]).call(function (error: string, res: any) {
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
    const reward: number = await stakeContract.methods.getPending(wallet[0]).call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });

    const rewardPerBlock: number = await stakeContract.methods.rewardPerBlock().call(function (error: string, res: any) {
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
    // stakingInfo = {getPending
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
        ApyRate: 140,
        status: false,
    }
    console.log('end' + stakingInfo);
    return {
        balance: balance,
        stakedBalance: stakedBalance,
        reward: reward,
        tvl: tvl,
        isLocked:isLocked,
        unStakeFee:unStakeFee,
        stakers: stakers,
        stakingInfo: stakingInfo,
        isConnected: true,
        wallet: wallet[0],
        rewardPerBlock: rewardPerBlock,
        loading: false
    };
}

export const fetchNFTData = async (Web3Provider: string, chainId: Number) => {

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
    const stakedBalance: BigNumber = await stakeContract.methods.getStakedAmount().call({from: wallet[0]},function (error: any, res: any) {
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
    const reward: number = await stakeContract.methods.getPending(wallet[0]).call(function (error: string, res: any) {
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
    // stakingInfo = {getPending
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
        ApyRate: 140,
        status: false,
    }
    console.log('end' + stakingInfo);
    return {
        balance: balance,
        stakedBalance: stakedBalance,
        reward: reward,
        tvl: tvl,
        stakers: stakers,
        stakingInfo: stakingInfo,
        isConnected: true,
        wallet: wallet[0],
        loading: false
    };
}

export const fetchReward = async (Web3Provider: string, chainId: Number) => {

    const wallet: string[] = await getAccount(Web3Provider);
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    const reward: number = await stakeContract.methods.getPending(wallet[0]).call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    return reward;
}

export const harvestSend = async (Web3Provider: string, chainId: Number, wallet:string) => {
    
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await stakeContract.methods.harvest(false).send({from: wallet}, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
}

export const approveSend = async (Web3Provider: string, chainId: Number, fromWallet:string, toWallet:string, amount:string) => {
    
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await tokenContract.methods.approve(toWallet, amount).send({from:fromWallet}, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    })
}

export const stakeSend = async (Web3Provider: string, chainId: Number, wallet:string, amount:string) => {
    
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await stakeContract.methods.stake(amount).send({from:wallet}, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
}

export const unStakeSend = async (Web3Provider: string, chainId: Number, wallet:string, amount:string) => {
    
    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);
    console.log(amount)

    await stakeContract.methods.unStake(amount).send({from:wallet}, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
}

export const fromWei = (amount: BigNumber) => {
    let value = amount.toString();
    return Web3.utils.fromWei(value);
}

export const toWei = (amount: string) => {
    return Web3.utils.toWei(amount);
}

export const getAPY = (rewardPB:BigNumber, totalAmount:BigNumber):number => {
    return parseInt(new BigNumber(rewardPB).times(63072000).dividedBy(new BigNumber(totalAmount)).toString());
}