import React from 'react';
import Assets from '../Assets';

const Report = ({ critical, risky, medium, neutral }) => {
    return (
        <div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between space-x-3 sm:space-x-9 items-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <img className='h-3 sm:h-4' src={Assets.XVoilet} alt="" />
                        <p>Critical:</p>
                    </div>
                    <p>{critical}</p>
                </div>
                <div className="flex justify-between space-x-3 sm:space-x-9 items-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <img className='h-3 sm:h-4' src={Assets.Caution} alt="" />
                        <p>Risky:</p>
                    </div>
                    <p>{risky}</p>
                </div>
                <div className="flex justify-between space-x-3 sm:space-x-9 items-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <img className='h-3 sm:h-4' src={Assets.Exclamatory} alt="" />
                        <p>Medium:</p>
                    </div>
                    <p>{medium}</p>
                </div>
                <div className="flex justify-between space-x-3 sm:space-x-9 items-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <img className='h-3 sm:h-4' src={Assets.Dot} alt="" />
                        <p>Neutral:</p>
                    </div>
                    <p>{neutral}</p>
                </div>
            </div>
        </div>
    );
};

export default Report; 