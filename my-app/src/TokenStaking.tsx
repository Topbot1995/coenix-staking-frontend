import React, { useContext, useEffect, useRef, useState } from 'react';
import StakeType from './components/stakeType';
import StakeTabLink from './components/stakeTablink';
import { AuthContext } from './context/authProvider';
import { useSelector } from 'react-redux';
import { state } from './state/types';
import { PageLoader } from './components/loader';
import { approveSend, fetchReward, fetchTokenData, fromWei, getAccount, getAPY, harvestSend, stakeSend, toWei, unStakeSend } from './utils/contractHelper';
import BigNumber from 'bignumber.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MAIN_NET, MAIN_TOKEN_STAKING_ADDR, PRODUCT_MODE, TEST_NET, TEST_TOKEN_STAKING_ADDR } from './config/constants';
import Web3 from 'web3';
import "./App.css";

const TOKEN_STAKING_ADDR = PRODUCT_MODE ? TEST_TOKEN_STAKING_ADDR : MAIN_TOKEN_STAKING_ADDR;

function TokenStaking() {

  const Percent = () => (
    <span style={{fontFamily:"Segoe UI"}}>%</span>
  )

  const { wallet, chainId, setWallet, isConnected, setIsConnected, web3Provider, setWeb3Provider, tokenData, setTokenData, setLoaderShow, loaderShow } = useContext(AuthContext);


  const balance = useSelector((state: state) => state.token);
  const stakeAmount = React.useRef<HTMLInputElement>(null);
  const unStakeAmount = React.useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ stake: boolean, unStake: boolean, harvest: boolean }>({ stake: false, unStake: false, harvest: false })

  const maxAmount = (flag: boolean = true) => {
    if (!isConnected) return false;
    if (flag) {
      setError({ ...error, stake: false });
    } else {
      setError({ ...error, unStake: false });

    }
  }

  const update = async () => {
    if (window.ethereum == undefined || !window.ethereum.isMetaMask) {
      return false;
    }
    let web3Provider;
    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log("User denied account access");
        return false;
      }
    } else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    } else {

      web3Provider = new Web3.providers.HttpProvider(PRODUCT_MODE ? MAIN_NET : TEST_NET);
    }

    const currentWeb3 = new Web3(web3Provider);
    setWeb3Provider(web3Provider);
    setIsConnected(true);
    const walletAddress: string[] = await getAccount(web3Provider);
    setWallet(walletAddress[0]);
    await setTokenData(await fetchTokenData(web3Provider, chainId));
  }

  const notify = (message: string, flag: boolean = false) => flag ? toast.success(message) : toast.error(message);

  const inputChange = (flag: boolean = true) => {
    if (!isConnected) return false;
    if (flag) {
      setError({ ...error, stake: false });
      if (stakeAmount.current?.value) {
        let x = parseFloat(fromWei(tokenData.balance));
        let y = parseFloat(stakeAmount.current?.value)
        if (0 >= y || x < y) {
          setError({ ...error, stake: true });
          console.log(error);
        }
      }
    } else {
      setError({ ...error, unStake: false });
      if (unStakeAmount.current?.value) {
        let x = parseFloat(fromWei(tokenData.stakedBalance))
        let y = parseFloat(unStakeAmount.current?.value)
        if (0 >= y || x < y) {
          setError({ ...error, unStake: true });
        }
      }
    }

  }

  const harvest = async () => {
    if (!isConnected) {
      notify("Please connect your wallet!");
    }
    if (tokenData.reward == new BigNumber(0)) {
      notify("Attention! No Reward to Claim");
      return false;
    }
    if (web3Provider && wallet)
      await toast.promise(
        harvestSend(web3Provider, chainId, wallet),
        {
          pending: 'Promise is pending',
          success: 'Promise resolved 👌',
          error: 'Promise rejected 🤯'
        }
      )
    update();
  }

  const unStake = async () => {
    if (!isConnected) {
      notify("Please connect your wallet!");
    }
    if (tokenData.stakedBalance == new BigNumber(0)) {
      notify("Attention! No Balance to Unstake");
      return false;
    }
    let amount = '0';
    if (unStakeAmount.current?.value) {
      amount = toWei(unStakeAmount.current?.value);
    }
    if (web3Provider && wallet)
      await toast.promise(
        unStakeSend(web3Provider, chainId, wallet, amount),
        {
          pending: 'Promise is pending',
          success: 'Promise resolved 👌',
          error: 'Promise rejected 🤯'
        }
      )
    update();
  }

  const stake = async () => {
    if (!isConnected) {
      notify("Please connect your wallet!");
      return false;
    }
    if (error.stake) {
      notify("Please enter valid amount!");
      return false;
    }
    let amount = '0';
    if (stakeAmount.current?.value) {
      amount = toWei(stakeAmount.current?.value);
    }
    if (web3Provider && wallet) {

      await toast.promise(
        approveSend(web3Provider, chainId, wallet, TOKEN_STAKING_ADDR, amount),
        {
          pending: 'Promise is pending',
          success: 'Promise resolved 👌',
          error: 'Promise rejected 🤯'
        }
      )
      await toast.promise(
        stakeSend(web3Provider, chainId, wallet, amount),
        {
          pending: 'Promise is pending',
          success: 'Promise resolved 👌',
          error: 'Promise rejected 🤯'
        }
      )
    }

    update();

  }

  useEffect(() => {
    setLoaderShow(false);

    const updateReward = async () => {
      if (web3Provider && isConnected) {
        let reward = await fetchReward(web3Provider, chainId);
        setTokenData({ ...tokenData, reward: reward });
      }
      console.log('rrrrrrrrrr');
    }

    const interval = setInterval(updateReward, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [tokenData])

  return (
    <>
      {loaderShow ? <PageLoader /> : <></>}
      <ToastContainer closeButton={false} position="top-right" />
      <div className="participat-information project-details-conent gamfi-about-secion pb-80 md-pb-50">
        <div className="container">
          <div className="row pt-70">
            <div className="col-lg-6 pr-25 md-pr-15">
              <div className="project-item">
                <div className="project-info border-bottom-2">
                  <h4 className="mb-15">Total Reward</h4>
                  <h3 className="mb-15 d-inline col-sm-6">{tokenData.reward ? parseFloat(fromWei(tokenData.reward)).toFixed(5) : "--"}<span className="buse">CRO</span></h3>
                  <button className='d-inline col-sm-6 harvest-btn' onClick={() => { harvest() }}>Harvest</button>
                  <span className='d-block'>Total Stake</span>
                </div>
                <ul className="date-listing mb-35">
                  {
                    <StakeTabLink minDays={tokenData.stakingInfo ? tokenData.stakingInfo.minDays : 0} />
                  }
                </ul>
                <div className="project-content">
                  {
                    <StakeType minDays={tokenData.stakingInfo ? tokenData.stakingInfo.minDays : 0} unStakeFee={tokenData.unStakeFee ? parseInt(tokenData.unStakeFee.toString()) : 0} harvestFee={tokenData.stakingInfo ? tokenData.stakingInfo.harvestFee : 0} ApyRate={tokenData.rewardPerBlock ? getAPY(tokenData.rewardPerBlock, tokenData.tvl) : 0} status={tokenData.stakingInfo ? tokenData.stakingInfo.status : true} isLocked = {tokenData.isLocked == "true" ? true : false} />
                  }
                </div>
                <div className="project-form-list">
                  <h5 className="mb-18">Balance:  {tokenData.balance ? parseFloat(fromWei(tokenData.balance)).toFixed(5) : "--"}CRO</h5>
                  <div className="balance-form-area mb-27">
                    <input type="number" className={error.stake ? `error-input` : ``} placeholder="00.00" ref={stakeAmount} onChange={() => { inputChange() }} min="0" defaultValue={0} />
                    {/* <span className="max" onClick={() => {maxAmount()}}>MAX</span> */}
                    <div className="white-shape-small approve" onClick={() => { stake() }}>
                      <input type="submit" value="STAKE" />
                      <span className="hover-shape1"></span>
                      <span className="hover-shape2"></span>
                      <span className="hover-shape3"></span>
                    </div>

                  </div>
                  <h5 className="mb-18">Staked: {tokenData.stakedBalance ? fromWei(tokenData.stakedBalance) : "--"} CRO</h5>
                  <div className="balance-form-area mb-27">
                    <input type="number" className={error.unStake ? `error-input` : ``} placeholder="0.00" ref={unStakeAmount} onChange={() => { inputChange(false) }} min="0" defaultValue={0} />
                    {/* <span className="max" onClick={() => {maxAmount(false)}}>MAX</span> */}
                    <div className="white-shape-small" onClick={() => { unStake() }}>
                      <input type="submit" value="UnStake" />
                      <span className="hover-shape1"></span>
                      <span className="hover-shape2"></span>
                      <span className="hover-shape3"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 pl-25 md-pl-15">
              <div className="project-item project-value-inner d-flex justify-content-between align-items-center mb-30">
                <div className="project-value">
                  <h3 className="mb-15">{tokenData.tvl ? fromWei(tokenData.tvl) : "--"} CRO</h3>
                  <span>Total Value Locked</span>
                </div>
                <div className="project-value-image">
                  <img className="heading-right-image" src="assets/images/project/rank.png" alt="rank" />
                </div>
              </div>
              <div className="project-item project-value-inner d-flex justify-content-between align-items-center mb-30">
                <div className="project-value">
                  <h3 className="mb-15">{tokenData.rewardPerBlock ? getAPY(tokenData.rewardPerBlock, tokenData.tvl) : 0}</h3>
                  <span>Apy</span>
                </div>
                <div className="project-value-image">
                  <img className="heading-right-image" src="assets/images/project/rank2.png" alt="rank" />
                </div>
              </div>
              <div className="project-item project-value-inner d-flex justify-content-between align-items-center">
                <div className="project-value">
                  <h3 className="mb-15">{tokenData.stakers ? tokenData.stakers : "--"}</h3>
                  <span>Number of Stakers</span>
                </div>
                <div className="project-value-image">
                  <img className="heading-right-image" src="assets/images/project/rank3.png" alt="rank" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default TokenStaking;
