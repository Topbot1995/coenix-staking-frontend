import React, { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './components/header';
import TopNav from './components/topnav';
import StakeType from './components/stakeType';
import StakeTabLink from './components/stakeTablink';
import { AuthContext } from './context/authProvider';
import { useSelector } from 'react-redux';
import { state } from './state/types';
import { PageLoader } from './components/loader';
import { approveSend, fetchNFTData, fetchReward, fetchTokenData, fromWei, getAccount, harvestSend, secToDay, stakeSend, toWei, unStakeSend } from './utils/contractHelper';
import BigNumber from 'bignumber.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MAIN_NET, MAIN_TOKEN_STAKING_ADDR, PRODUCT_MODE, TEST_NET, TEST_TOKEN_STAKING_ADDR } from './config/constants';
import Web3 from 'web3';
import NFTCard from './components/NFTCard';
import { CCol, CContainer, CRow } from '@coreui/react';



const TOKEN_STAKING_ADDR = PRODUCT_MODE ? TEST_TOKEN_STAKING_ADDR : MAIN_TOKEN_STAKING_ADDR;

function NFTStaking() {

  const { wallet, chainId, setWallet, isConnected, setIsConnected, web3Provider, setWeb3Provider, tokenData, setTokenData, NFTData, setNFTData, setLoaderShow, loaderShow } = useContext(AuthContext);

  const stakeAmount = React.useRef<HTMLInputElement>(null);
  const unStakeAmount = React.useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState<{ stake: boolean, unStake: boolean, harvest: boolean }>({ stake: false, unStake: false, harvest: false })
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
    await fetchNFTData(web3Provider, chainId);
  }

  const notify = (message: string, flag: boolean = false) => flag ? toast.success(message) : toast.error(message);

  const inputChange = (flag: boolean = true) => {
    if (!isConnected) return false;
    if (flag) {
      setError({ ...error, stake: false });
      if (stakeAmount.current?.value) {
        let x = parseFloat(fromWei(tokenData.balance))
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
            <div className="col-lg-12 pl-25 md-pl-15">
              <div className="project-item project-value-inner d-flex justify-content-between align-items-center mb-30">
                <div className="project-value">
                  <h3 className="mb-15">{NFTData.tvl ? fromWei(NFTData.tvl) : "--"}</h3>
                  <span>Total Value Locked</span>
                </div>
                <div className="project-value">
                  <h3 className="mb-15">{NFTData ? `200` : "--"} %</h3>
                  <span>Apy</span>
                </div>
                <div className="project-value">
                  <h3 className="mb-15">{NFTData.stakers ? NFTData.stakers : "--"}</h3>
                  <span>Number of Stakers</span>
                </div>
                <div className="project-value-image">
                  <img className="heading-right-image" src="assets/images/project/rank.png" alt="rank" />
                </div>
              </div>
            </div>
            <div className="col-lg-12 pr-25 md-pr-15">
              <div className="project-item">
                <div className="project-info border-bottom-2">
                  <h4 className="mb-15">Total Reward</h4>
                  <h3 className="mb-15 d-inline col-sm-6">{NFTData.reward ? fromWei(NFTData.reward) : "--"}<span className="buse">CRO</span></h3>
                  <button className='d-inline col-sm-6 harvest-btn' onClick={() => { harvest() }}>Harvest</button>
                </div>
                <ul className="date-listing mb-35">
                  {
                    <StakeTabLink minDays={NFTData.minDays ? secToDay(NFTData.minDays) : 0} />
                  }
                </ul>
                <div className="project-content">
                  {/* {
                    <StakeType minDays={tokenData.stakingInfo ? tokenData.stakingInfo.minDays : 0} unStakeFee={tokenData.stakingInfo ? tokenData.stakingInfo.unStakeFee : 0} harvestFee={tokenData.stakingInfo ? tokenData.stakingInfo.harvestFee : 0} ApyRate={tokenData.stakingInfo ? tokenData.stakingInfo.ApyRate : 0} status={tokenData.stakingInfo ? tokenData.stakingInfo.status : true} />
                  } */}
                </div>
                <div className="project-form-list">
                  <h5 className="mb-18">Balance:  {NFTData.balance ? NFTData.balance.length : "--"}CRO</h5>
                  <div className="balance-form-area mb-27">
                    <div className="white-shape-small approve" onClick={() => { stake() }}>
                      <input type="submit" value="STAKE" />
                      <span className="hover-shape1"></span>
                      <span className="hover-shape2"></span>
                      <span className="hover-shape3"></span>
                    </div>
                  </div>
                  <CContainer>
                    <CRow>
                      <CCol sm="auto mb-4"><NFTCard id={1} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                      <CCol sm="auto mb-4"><NFTCard id={2} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                      <CCol sm="auto mb-4"><NFTCard id={3} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                      {NFTData.stakedBalance ? NFTData.stakedBalance.map((value, index) => {
                        return (
                          <CCol sm="auto mb-4" key={index}><NFTCard key={index} id={parseInt(value.toString())} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                        )
                      }):`No Staked Tokens`} 
                    </CRow>
                  </CContainer>
                  <h5 className="mb-18">Staked: {NFTData.stakedBalance ? NFTData.stakedBalance.length : "--"} CRO</h5>
                  <div className="balance-form-area mb-27">
                    <CContainer>
                      <CRow>
                        <CCol sm="auto mb-4"><NFTCard id={1} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                        <CCol sm="auto mb-4"><NFTCard id={2} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                        <CCol sm="auto mb-4"><NFTCard id={3} ImgUrl={"../assets/images/LatestNews/News_Img1.png"} /> </CCol>
                      </CRow>
                    </CContainer>
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

          </div>
        </div>
      </div>


      <div className="gamfi-footer-section">
        <div className="container">
          <div className="footer-cta-area text-center active-shape hover-shape-inner">
            <h2 className="title mb-15">
              Apply for project<br />
              incubation
            </h2>
            <div className="dsc mb-40">
              If you want to lanuch an IGO/IDO, It will be your perfect choice
            </div>
            <a className="banner-btn wow fadeInUp black-shape" data-wow-delay="300ms" data-wow-duration="2500ms" href="igo-apply.html">
              <span className="btn-text">Apply For IGO</span>
              <span className="hover-shape1"></span>
              <span className="hover-shape2"></span>
              <span className="hover-shape3"></span>
            </a>
            <span className="border-shadow shadow-1"></span>
            <span className="border-shadow shadow-2"></span>
            <span className="border-shadow shadow-3"></span>
            <span className="border-shadow shadow-4"></span>
            <span className="hover-shape-bg hover_shape1"></span>
            <span className="hover-shape-bg hover_shape2"></span>
            <span className="hover-shape-bg hover_shape3"></span>
          </div>
        </div>
        <div className="footer-area">
          <div className="container">
            <div className="sec-heading text-center">
              <div className="sub-inner mb-52">
                <img className="heading-right-image" src="assets/images/icons/steps2.png" alt="Steps-Image" />
                <span className="sub-title white-color">Find us on Social</span>
                <img className="heading-left-image" src="assets/images/icons/steps.png" alt="Steps-Image" />
              </div>
            </div>
            <div className="footer-listing text-center mb-100 md-mb-70">
              <ul className="footer-icon-list">
                <li><a href="#"><i className="icon-twitter"></i></a></li>
                <li><a href="#"><i className="icon-telegram"></i></a></li>
                <li><a href="#"><i className="icon-medium"></i></a></li>
                <li><a href="#"><i className="icon-discord"></i></a></li>
                <li><a href="#"><i className="icon-linkedin"></i></a></li>
                <li><a href="#"><i className="icon-instagram"></i></a></li>
                <li><a href="#"><i className="icon-facebook"></i></a></li>
              </ul>
            </div>
            <div className="footer-logo text-center mb-45">
              <img src="assets/images/logo.png" alt="Footer-logo" />
            </div>
            <div className="footer-mainmenu text-center mb-20">
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">How it works</a></li>
                <li><a href="#">Token info</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Social media</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="copyright-area text-center mb-0">
              <div className="dsc mb-37">Copyright © 2022. All Rights Reserved by <a target="_blank" className="gafi" href="#">GaFi</a></div>
            </div>
            <div className="scrollup text-center">
              <a href="#"><i className="icon-arrow_up"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade " id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modals-title  mb-0" id="exampleModalLabel">Connect Wallet</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="icon-x"></i></button>
            </div>
            <div className="modal-body">
              <p className="mb-20">Please select a wallet to connect to this marketplace</p>
              <div className="connect-section">
                <ul className="heading-list">
                  <li><a href="#"><span><img src="assets/images/icons/meta-mask.png" alt="Meta-mask-Image" /></span>MetaMask</a></li>
                  <li><a href="#"><span><img src="assets/images/icons/coinbase.png" alt="Coinbase-Image" /></span>Coinbase</a></li>
                  <li><a href="#"><span><img src="assets/images/icons/trust.png" alt="Trust-Image" /></span>Trust Wallet</a></li>
                  <li><a href="#"><span><img src="assets/images/icons/wallet.png" alt="Wallet-Image" /></span>WalletConnect</a></li>
                </ul>
              </div>
              <p>By connecting your wallet, you agree to our <a href="#"><span className="modal-title">Terms of Service </span></a>and our <a href="#"><span className="modal-title"> Privacy Policy</span></a>.</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default NFTStaking;
