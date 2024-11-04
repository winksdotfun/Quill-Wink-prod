import React from 'react'
import Assets from '../Assets'

// Define a function to return the correct icon based on risk value
const getRiskIcon = (risk) => {
    switch (risk) {
        case 0:
            return Assets.XVoilet;
        case 1:
            return Assets.Caution;
        case 2:
            return Assets.Exclamatory;
        case 3:
            return Assets.Dot;
        case 4:
            return Assets.ThumbUp;
        case 5:
            return Assets.Tick;
        case 6:
            return Assets.Star;
        case 7:
            return Assets.DotOutline;
        default:
            return Assets.XVoilet; // fallback icon if risk value is out of range
    }
};

const Status = ({ 
    holdersCount, 
    currentLiquidity, 
    lockedLiquidity, 
    pairs, 
    holdersCountRisk, 
    currentLiquidityRisk, 
    lockedLiquidityRisk, 
    pairsRisk 
}) => {
  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="text-xs sm:text-sm">
        <p>Holders</p>
        <p className="text-[10px] sm:text-lg font-bold flex items-center gap-1">
          <img
            className="h-3 sm:h-4"
            src={getRiskIcon(holdersCountRisk)}
            alt=""
          />
          {holdersCount}
        </p>
      </div>
      <div className="text-xs sm:text-sm">
        <p>Current Liquidity</p>
        <p className="text-[10px] sm:text-lg font-bold flex items-center gap-1">
          <img
            className="h-3 sm:h-4"
            src={getRiskIcon(currentLiquidityRisk)}
            alt=""
          />
          ${currentLiquidity}
        </p>
      </div>
      <div className="text-xs sm:text-sm">
        <p>Locked Liquidity</p>
        <p className="text-[10px] sm:text-lg font-bold flex items-center gap-1">
          <img
            className="h-3 sm:h-4"
            src={getRiskIcon(lockedLiquidityRisk)}
            alt=""
          />
          ${lockedLiquidity}
        </p>
      </div>
      <div className="text-xs sm:text-sm">
        <p>Trading Pairs</p>
        <p className="text-[10px] sm:text-lg font-bold flex items-center gap-1">
          <img className="h-3 sm:h-4" src={getRiskIcon(pairsRisk)} alt="" />
          {pairs}
        </p>
      </div>
    </div>
  );
}

export default Status;