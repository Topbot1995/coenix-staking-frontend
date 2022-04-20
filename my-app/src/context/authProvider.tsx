import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MAIN_CAINID, MAIN_NET, PRODUCT_MODE, TEST_CAINID, TEST_NET } from "../config/constants";
import { IAuthContextState } from "../interface/stakeType";
import { useAppDispatch } from "../state/store";
import { connectToken } from "../state/tokenReducer";
import { NFTState, state, tokenState } from "../state/types";

export const AuthContext = createContext<IAuthContextState>(
    {} as IAuthContextState,
);

const AuthProvider: React.FC = ({children}) => {
    const [wallet, setWallet] = useState<string>();
    const [loaderShow, setLoaderShow] = useState<boolean>(true);
    const [web3Provider, setWeb3Provider] = useState<string>(PRODUCT_MODE ? MAIN_NET : TEST_NET);
    const [isConnected, setIsConnected] = useState<boolean>(false);    
    const [chainId, setChainId] = useState<number>(PRODUCT_MODE ? MAIN_CAINID : TEST_CAINID);
    const [tokenData, setTokenData] = useState<tokenState>({wallet:"0x00000000000000"} as tokenState)
    const [NFTData, setNFTData] = useState<NFTState>({wallet:"0x00000000000000"} as NFTState)
    const dispatch = useAppDispatch();   

    return (
        <AuthContext.Provider
        value = {{
            wallet,
            setWallet,
            loaderShow,
            setLoaderShow,
            web3Provider,
            setWeb3Provider,
            isConnected,
            setIsConnected,
            chainId,
            setChainId,
            tokenData,
            setTokenData,
            NFTData,
            setNFTData
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;