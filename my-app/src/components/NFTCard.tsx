import { CButton, CCard, CCardBody, CCardImage, CCardText, CCardTitle } from "@coreui/react";
import React, { useState } from "react";
import Image from '../assets/images/LatestNews/News_Img1.png';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilList, cilShieldAlt } from '@coreui/icons';

const NFTCard: React.FC<{ id?: number, ImgUrl?: string }> = ({ id, ImgUrl }) => {

    const [toggleSelect, setToggleSelect] = useState<boolean>(false);

    const CardImage: React.FC<{ img: string | undefined; }> = () => (
        <img src={ImgUrl}></img>
    )

    return (
        <CCard color="dark" textColor="white" onClick={() => { setToggleSelect(!toggleSelect) }} style={{width:"200px"}}>
            <CCardBody>
                {toggleSelect && <CIcon icon={cilCheck} size="lg" style={{width:"25px", position:"absolute", left:"80%"}} color="#31dee9"/>}  
                <CCardTitle>#{id}</CCardTitle>
            </CCardBody>

            <CCardImage orientation="bottom" component={CardImage} />
        </CCard>
    )
}

export default NFTCard;