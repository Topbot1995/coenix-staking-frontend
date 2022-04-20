import BigNumber from "bignumber.js";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { MAIN_CAINID, MAIN_NET, PRODUCT_MODE, TEST_CAINID, TEST_NET, TEST_TOKEN_ADDR, TEST_TOKEN_STAKING_ADDR } from "../config/constants";
import { AuthContext } from "../context/authProvider";
import { useAppDispatch } from "../state/store";
import { fetchTokenData, getAccount } from "../utils/contractHelper";

const Header = () => {

    const { chainId, isConnected, setIsConnected, setWeb3Provider, tokenData, setTokenData, loaderShow, setLoaderShow, setWallet } = useContext(AuthContext);

    const [address, setAddress] = useState<string>("Connect");

    const connect = async () => {

        setLoaderShow(true);
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


    useEffect(() => {
        if (tokenData.wallet != "0x00000000000000") {
            setAddress(shortenAddress(tokenData.wallet));
            setLoaderShow(false);
        }

        return () => {

        }
    }, [tokenData])

    const shortenAddress = (address: string): string =>
        `${address.substr(0, 6)}...${address.substr(
            address.length - 4,
            address.length,
        )}`;

    return (
        <header id="gamfi-header" className="gamfi-header-section default-header">
            <div className="menu-area menu-sticky">
                <div className="container">
                    <div className="heaader-inner-area d-flex justify-content-between align-items-center">
                        <div className="gamfi-logo-area d-flex justify-content-between align-items-center">
                            <div className="logo">
                                <a href="index.html"><img src="assets/images/logo.png" alt="logo" /></a>
                            </div>
                            <div className="header-menu">
                                <ul className="nav-menu">
                                    <li><a href="index.html">Home</a>
                                    </li>
                                    <li><a href="project.html">Projects</a>
                                    </li>
                                    <li className="active"><a href="staking.html">Staking</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="gamfi-btn-area">
                            <ul>
                                <li>
                                    <a id="nav-expander" className="nav-expander bar" href="#">
                                        <div className="bar">
                                            <span className="dot1"></span>
                                            <span className="dot2"></span>
                                            <span className="dot3"></span>
                                        </div>
                                    </a>
                                </li>
                                <li className="buy-token">
                                    <a className="readon black-shape" href="#">
                                        <span className="btn-text">Buy Token </span>
                                        <i className="icon-arrow_down"></i>
                                        <span className="hover-shape1"></span>
                                        <span className="hover-shape2"></span>
                                        <span className="hover-shape3"></span>
                                    </a>
                                    <ul>
                                        <li><a href="#"><img src="assets/images/icons/pancake.png" alt="pancake" /> PancakeSwap</a></li>
                                        <li><a href="#"><img src="assets/images/icons/uniswap.png" alt="uniswap" /> UniSwap</a></li>
                                        <li><a href="#"><img src="assets/images/icons/market.png" alt="market" /> CoinMarketCap</a></li>
                                        <li><a href="#"><img src="assets/images/icons/gate.png" alt="gate" /> Gate.io</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <button type="button" className="readon white-btn hover-shape" onClick={() => { connect(); }}><img src="assets/images/icons/connect.png" alt="Icon" />
                                        <span className="btn-text">{address} </span>
                                        <span className="hover-shape1"></span>
                                        <span className="hover-shape2"></span>
                                        <span className="hover-shape3"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="right_menu_togle mobile-navbar-menu" id="mobile-navbar-menu">
                <div className="close-btn">
                    <a id="nav-close2" className="nav-close">
                        <div className="line">
                            <span className="line1"></span>
                            <span className="line2"></span>
                        </div>
                    </a>
                </div>
                <div className="sidebar-logo mb-30">
                    <a href="index.html"><img src="assets/images/logo-dark.png" alt="" /></a>
                </div>
                <ul className="nav-menu">
                    <li className="current-menu-item"><a href="index.html">Home</a>
                    </li>
                    <li><a href="project.html">Projects</a>
                    </li>
                    <li><a href="staking.html">Staking</a>
                    </li>
                    <li className="menu-item-has-children">
                        <a href="#">Buy Token</a>
                        <ul className="sub-menu">
                            <li><a href="#">PancakeSwap</a></li>
                            <li><a href="#">UniSwap</a></li>
                            <li><a href="#">CoinMarketCap</a></li>
                            <li><a href="#">Gate.io</a></li>
                        </ul>
                    </li>
                    <li>
                        <button type="button" className="readon black-shape-big connectWalletBtnforMobile" data-bs-toggle="modal" data-bs-target="#exampleModal"><img src="assets/images/icons/connect_white.png" alt="Icon" />
                            <span className="btn-text">Connect </span>
                            <span className="hover-shape1"></span>
                            <span className="hover-shape2"></span>
                            <span className="hover-shape3"></span>
                        </button>
                    </li>
                </ul>
            </nav>

        </header>
    );
}

export default Header;