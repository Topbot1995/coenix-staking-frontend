import BigNumber from "bignumber.js";
import Web3 from "web3";
import tokenABI from '../ABI/tokenABI.json';
import stakingABI from '../ABI/tokenStakeABI.json';

import NFTABI from '../ABI/NFTABI.json'
import NFTStakingABI from '../ABI/NFTStaking.json'

import { TEST_NFT_ADDR, TEST_NFT_STAKING_ADDR, TEST_TOKEN_ADDR, TEST_TOKEN_STAKING_ADDR } from "../config/constants";

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
    const stakedBalance: BigNumber = await stakeContract.methods.getStakedAmount().call({ from: wallet[0] }, function (error: any, res: any) {
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
        isLocked: isLocked,
        unStakeFee: unStakeFee,
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
    const tokenContract = await getContract(NFTABI, TEST_NFT_ADDR, Web3Provider);
    const stakeContract = await getContract(NFTStakingABI, TEST_NFT_STAKING_ADDR, Web3Provider);

    const balance: BigNumber = await tokenContract.methods.balanceOf(wallet[0]).call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('balance' + balance);
    let nft_balanceIds = [];
    let nft_balanceUris = [];

    let balanceInt = parseInt(balance.toString());

    if (balanceInt > 0) {
      for(let i=0; i<balanceInt; i++) {
        let info = await get_nftId(wallet[0] , i, Web3Provider);
        nft_balanceIds.push(info.id);
        nft_balanceUris.push(info.uri);
        console.log('balance' + i);
      }
    }
    console.log('balanceids' + nft_balanceIds);
    const stakedBalance: BigNumber = await stakeContract.methods.userStakedAmount().call({ from: wallet[0] }, function (error: any, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('stakedBalance' + nft_balanceIds);
    const stakedIds: BigNumber[] = await stakeContract.methods.getStakedIds().call({ from: wallet[0] }, function (error: any, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    
    let stakedInt = parseInt(stakedBalance.toString());

    let nft_stakeUris = [];

    if (stakedIds.length > 0) {
      for(let i=0; i<stakedIds.length; i++) {
        let uri = await get_nftURI(wallet[0], parseInt(stakedIds[i].toString()), Web3Provider);
        nft_stakeUris.push(uri);
      }
    }
    
    console.log('stakedBalance' + stakedBalance);
    const tvl: BigNumber = await stakeContract.methods.totalStakedAmount().call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
    console.log('tvl' + tvl);
    const stakers: number = await stakeContract.methods.totalStakers().call(function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });

    const minDays: number = await stakeContract.methods.minDays().call(function (error: string, res: any) {
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
    return {
        balance: nft_balanceIds,
        stakedBalance: stakedIds,
        balanceURIs: nft_balanceIds,        
        reward: reward,
        tvl: tvl,
        stakers: stakers,        
        isConnected: true,
        wallet: wallet[0],
        loading: false,
        minDays
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

export const harvestSend = async (Web3Provider: string, chainId: Number, wallet: string) => {

    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await stakeContract.methods.harvest(false).send({ from: wallet }, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
}

export const approveSend = async (Web3Provider: string, chainId: Number, fromWallet: string, toWallet: string, amount: string) => {

    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await tokenContract.methods.approve(toWallet, amount).send({ from: fromWallet }, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    })
}

export const stakeSend = async (Web3Provider: string, chainId: Number, wallet: string, amount: string) => {

    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);

    await stakeContract.methods.stake(amount).send({ from: wallet }, function (error: string, res: any) {
        if (error) {
            console.log(error);
            return;
        }
        return res;
    });
}

export const unStakeSend = async (Web3Provider: string, chainId: Number, wallet: string, amount: string) => {

    const tokenContract = await getContract(tokenABI, TEST_TOKEN_ADDR, Web3Provider);
    const stakeContract = await getContract(stakingABI, TEST_TOKEN_STAKING_ADDR, Web3Provider);
    console.log(amount)

    await stakeContract.methods.unStake(amount).send({ from: wallet }, function (error: string, res: any) {
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

export const getAPY = (rewardPB: BigNumber, totalAmount: BigNumber): number => {
    return parseInt(new BigNumber(rewardPB).times(63072000).dividedBy(new BigNumber(totalAmount)).toString());
}

async function get_nftId(account: string, index: number, Web3Provider: string) {

    const nftToken = getContract(NFTABI, TEST_NFT_ADDR, Web3Provider);

    let id = await nftToken.methods
        .tokenOfOwnerByIndex(account, index)
        .call({ from: account }, function (err: string, res: any) {
            if (err) {
                console.log("An error occured", err);
                return;
            }
            return res;
        });

    let URI = await nftToken.methods
        .tokenURI(id)
        .call({ from: account }, function (err: string, res: any) {
            if (err) {
                console.log("An error occured", err);
                return;
            }
            return res;
        });

    return { uri: URI, id: id };

}

async function get_nftURI(account: string, id: number, Web3Provider: string) {

    const nftToken = getContract(NFTABI, TEST_NFT_STAKING_ADDR, Web3Provider);

    let URI = await nftToken.methods
        .tokenURI(id)
        .call({ from: account }, function (err: string, res: any) {
            if (err) {
                console.log("An error occured", err);
                return;
            }
            return res;
        });

    return URI;

}
export const secToDay = (seconds:BigNumber) => {
    return parseInt(new BigNumber(seconds).dividedBy(86400).toString());
}