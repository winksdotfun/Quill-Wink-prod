import React from 'react';
import Assets from '../Assets';

const Status = ({ totalScore, tokenAge, honeypotStatus, owner }) => {
  // Function to determine the background color based on the totalScore
  const getBackgroundColor = (score) => {
    if (score < 14.28) return '#6A116A'; // 0-14.28%
    if (score < 28.56) return '#B40E00'; // 14.28-28.56%
    if (score < 42.84) return '#DE9600'; // 28.56-42.84%
    if (score < 57.12) return '#2CA3C0'; // 42.84-57.12%
    if (score < 71.4) return '#469B44'; // 57.12-71.4%
    if (score < 85.68) return '#37751D'; // 71.4-85.68%
    return '#2D5D17'; // 85.68-100%
  };

  const handleCopy = () => {
    if (owner) {
      navigator.clipboard.writeText(owner).then(() => {
        // alert('Address copied to clipboard!'); // Optional: you can show a message
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  // Set background color and asset based on honeypot status
  const honeypotBgColor = honeypotStatus === "Is a Honeypot" ? '#B40E00' : '#FFFFFF10';
  const honeypotIcon = honeypotStatus === "Is a Honeypot" ? Assets.Honeypot : Assets.Token;

  return (
    <div>
      <div className="flex gap-1 sm:gap-4 text-xs sm:text-sm">
        <div className="space-y-2 sm:space-y-3">
          <div className="">
            <p className='text-[#DDDDDD] text-xs sm:text-base'>Last Known Status:</p>
            <div
              className="h-fit sm:h-10 w-fit rounded-[8px] p-[6px] sm:p-[10px] flex items-center gap-1 sm:gap-2"
              style={{ backgroundColor: honeypotBgColor }} // Set honeypot background color
            >
              <img className='h-4 sm:h-6' src={honeypotIcon} alt="" /> {/* Set honeypot asset */}
              <p className='text-xs hidden sm:flex'>{honeypotStatus}</p>
            </div>
          </div>
          <div className="w-fit">
            <p className='text-[#DDDDDD] text-xs sm:text-base'>Token Age:</p>
            <p className='text-center text-xs sm:text-base'>{tokenAge} </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="w-fit">
            <p className='text-[#DDDDDD] text-xs sm:text-base'>Overall Score:</p>
            {/* <div
              className="h-10 w-full rounded-[8px] flex justify-center items-center mx-auto"
              style={{ backgroundColor: getBackgroundColor(totalScore) }} // Set background color dynamically
            >
              <p className='text-base font-semibold'>{totalScore}%</p>
            </div> */}
            <p
              className="h-6 sm:h-10 w-full rounded-[8px] flex justify-center items-center mx-auto"
              style={{ backgroundColor: getBackgroundColor(totalScore) }} // Set background color dynamically
            >
              <span className="flex items-baseline">
                <span className=" text-base sm:text-xl font-semibold">
                  {Math.floor(Number(totalScore) || 0)}{/* Integer part */}
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  .{(Number(totalScore) || 0).toFixed(2).split('.')[1]}{/* Decimal part */}
                </span>
                <span className="text-xs sm:text-sm font-medium">%</span> {/* Percent symbol */}
              </span>
            </p>
          </div>
          <div className="w-fit cursor-pointer" onClick={handleCopy}>
            <p className='text-[#DDDDDD] text-xs sm:text-base'>Ownership:</p>
            {owner !== '' && owner !== 'Renounced' ? (
              <>
                {owner.slice(0, 4)}...{owner.slice(-4)}
              </>
            ) : (
              <>{owner === 'Renounced' ? owner : <img className='h-3 sm:h-4 mx-auto' src={Assets.X} alt="X" />}</>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;