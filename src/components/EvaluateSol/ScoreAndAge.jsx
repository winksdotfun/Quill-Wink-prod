import React from 'react';

const ScoreAndAge = ({ totalScore, tokenAge }) => {
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

  return (
    <div className="flex gap-4">
      <div className="text-xs sm:text-sm">
        <p>Overall Score: </p>
        <p
          className="sm:h-12 sm:w-[110px] h-8 rounded-[4px] text-base sm:text-2xl font-semibold flex justify-center items-center"
          style={{ backgroundColor: getBackgroundColor(totalScore) }} // Set background color dynamically
        >
          <span className="flex items-baseline">
            <span className=" text-base sm:text-2xl font-semibold">
              {Math.floor(Number(totalScore) || 0)}
              {/* Integer part */}
            </span>
            <span className="text-xs sm:text-lg font-medium">
              .{(Number(totalScore) || 0).toFixed(2).split(".")[1]}
              {/* Decimal part */}
            </span>
            <span className="text-xs sm:text-lg font-medium">%</span>{" "}
            {/* Percent symbol */}
          </span>
        </p>
      </div>
      <div className="text-xs sm:text-sm">
        <p>Token Age: </p>
        <p className="sm:h-12 h-8 sm:w-[110px] bg-[#FFFFFF]/10 rounded-[4px] flex justify-center text-base sm:text-2xl font-medium items-center">
          {tokenAge}
        </p>
      </div>
    </div>
  );
};

export default ScoreAndAge;