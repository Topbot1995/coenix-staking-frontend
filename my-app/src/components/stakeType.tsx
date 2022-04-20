import React from 'react';
import { IStakeType } from '../interface/stakeType';

const StakeType: React.FC<IStakeType> = (propData) => {

    const Percent = (data:number) => (
        <label className='not-michrome'>{`${data}%`}</label>
    )

    return (
        <div id="sevenDays" className="StakeTabcontent">
            <div className="project-media mb-40">
                <ul className="project-listing">
                    <li>Lock period: <strong>{propData.minDays} days</strong> <span>APY Rate</span></li>
                    <li>Re-locks on Registration: <strong>Yes</strong> <a href="#"><span className="big-text">{Percent(propData.ApyRate)}</span></a></li>
                    <li>Early Unstake Fee: <strong>{Percent(propData.unStakeFee)}</strong><span>*APY is dynamic</span></li>
                    <li>Harvest Fee: <strong>{Percent(propData.harvestFee)}</strong></li>
                    <li>Status: <strong>{propData.isLocked ? "Unlocked" : "Locked"}</strong></li>
                </ul>
            </div>
        </div>
    );
}
export default StakeType;