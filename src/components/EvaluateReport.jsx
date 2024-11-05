import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Assets from './Assets';
import Status from './Evaluate/Status';
import Report from './Evaluate/Report';
import Info from './Evaluate/Info';
import Polygon from "../assets/icons/Polygon.png"
import axios from 'axios';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';


const EvaluateReport = ({ onBackClick, selectedToken, tokenAddress, chainId }) => {
  const [valueFetch, setValueFetch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [owner, setOwner] = useState('')
  const [ercerror, setErcerror] = useState(false)

  const calculateAge = (dateString) => {
    if (ercerror) {
      return;
    }

    const [day, month, year] = dateString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    // Calculate the age in milliseconds
    const ageInMilliseconds = today - birthDate;

    // Calculate age in years, months, and days
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const ageInMonths = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 30));
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

    if (ageInYears > 0) {
      return `${ageInYears} years`;
    } else if (ageInMonths > 0) {
      return `${ageInMonths} months`;
    } else {
      return `${ageInDays} days`;
    }
  };

  const formatValue = (value) => {
    return isNaN(value) ? '-' : value;
  };

  const fetchTokenInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://check-api.quillai.network/api/v1/tokens/frontend/information/${tokenAddress}?chainId=${chainId}&distinctId=$device:1921f267d7f65c-06d6ddb090976-1a525637-122897-1921f267d7f65c&generateGptInput=true&generateChecksDescription=true`,
        {
          headers: {
            'x-api-key': '6muNpTyDvR9hGJBuG1muh5VlKE74V6Ik4cWNBmg0',
          },
        }
      );

      console.log(res, "res");
      if (res.status === 200) {
        const data = await res.json();

        setValueFetch(data);
        console.log('====================================');
        console.log(data);
        if (data.errorStatus === 420) {
          setErcerror(true)
          
          // Log ERC error
          logEvent(analytics, 'erc_error', {
            token_type: selectedToken,
            chain_id: chainId,
            address: tokenAddress
          });
        }

        // Log successful analysis
        logEvent(analytics, 'analysis_complete', {
          token_type: selectedToken,
          chain_id: chainId,
          address: tokenAddress,
          is_honeypot: data?.honeypotDetails?.isPairHoneypot === 1,
          total_score: data?.honeypotDetails?.overAllScorePercentage,
          holders_count: data?.marketChecks?.marketCheckDescription?.holdersDescription?.holdersCount?.number
        });

        // Track risk levels
        logEvent(analytics, 'risk_assessment', {
          critical_points: data?.tokenInformation.totalChecksInformation?.aggregatedCount[0]?.count || 0,
          risky_points: data?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "RISKY")?.count || 0,
          medium_points: data?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Medium Risk")?.count || 0,
          neutral_points: data?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Neutral")?.count || 0
        });

        // Track if it's a honeypot
        if (data?.honeypotDetails?.isPairHoneypot === 1) {
          logEvent(analytics, 'honeypot_detected', {
            token_type: selectedToken,
            address: tokenAddress,
            chain_id: chainId
          });
        }

        setOwner(data?.tokenInformation?.generalInformation?.ownerAddress)
        console.log('====================================');
      }

    } catch (error) {
      setError('Failed to fetch token information');
      // Log error event
      logEvent(analytics, 'fetch_error', {
        token_type: selectedToken,
        chain_id: chainId,
        address: tokenAddress,
        error_message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenInfo();
      // Add report view event when component mounts
      logEvent(analytics, 'report_viewed', {
        token_type: selectedToken,
        chain_id: chainId,
        address: tokenAddress
      });
    }
  }, [tokenAddress, chainId]);

  const tokenImages = {
    ETH: Assets.ETH,
    BSC: Assets.BSC,
    Polygon: Assets.Polygon,
    Base: Assets.Base,
  };

  const buttonColors = {
    ETH: '#000000',
    BSC: '#CA8A04',
    POL: '#8247E5',
    Base: '#1A54F4',
    SOL: '#300D5A',
  };

  const totalScore = !ercerror && parseFloat(valueFetch?.honeypotDetails?.overAllScorePercentage);
  const tokenCreationDate = !ercerror && valueFetch?.tokenInformation?.generalInformation?.tokenCreationDate;

  console.log("token creation date", !ercerror && tokenCreationDate);
  console.log("token creation date in real", !ercerror && valueFetch?.tokenInformation?.generalInformation?.tokenCreationDate);
  const currentDate = new Date();

  let buyTax = 0;
  let sellTax = 0;
  let transferTax = 0;

  if (valueFetch?.honeypotDetails) {
    const details = valueFetch.honeypotDetails;
    buyTax = parseFloat(details?.buyTax?.number || "0");
    sellTax = parseFloat(details?.sellTax?.number || "0");
    transferTax = parseFloat(details?.transferTax?.number || "0");
  }

  const buyTaxRisk = (valueFetch?.honeypotDetails?.buyTax?.risk);
  const sellTaxRisk = (valueFetch?.honeypotDetails?.buyTax?.risk);
  const transferTaxRisk = (valueFetch?.honeypotDetails?.buyTax?.risk);



  let tokenAge = 'Unknown';
  if (valueFetch) {
    const ageInMilliseconds = currentDate - tokenCreationDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    // tokenAge = `${Math.floor(ageInYears)} years`;
    tokenAge = calculateAge(tokenCreationDate)
    console.log("total age", tokenAge);

  }

  const criticalPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0].count || 0;
  console.log("fgxhgdf", !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0]);
  console.log("fgxdthtdhdfghghgdf", !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0].count);

  const riskyPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "RISKY")?.count || 0;
  const mediumPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Medium Risk")?.count || 0;
  const neutralPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Neutral")?.count || 0;

  console.log(criticalPoint, riskyPoint, mediumPoint, neutralPoint);

  const holdersCount = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.holdersDescription?.holdersCount?.number);
  const holdersCountRisk = (!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.holdersDescription?.holdersCount?.risk);

  const currentLiquidity = (!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.totalLpSupplyInUsd?.number);
  const currentLiquidityRisk = (!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.totalLpSupplyInUsd?.risk);

  const lpHolders = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.lpHolderCount?.number));
  const lpHoldersRisk = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.lpHolderCount?.risk));

  const pairs = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.tradingPairCount?.number);
  const pairsRisk = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.tradingPairCount?.risk);

  const critical = !ercerror && valueFetch?.riskCategories?.critical || 0;
  const risky = !ercerror && valueFetch?.riskCategories?.risky || 0;
  const medium = !ercerror && valueFetch?.riskCategories?.medium || 0;
  const neutral = !ercerror && valueFetch?.riskCategories?.neutral || 0;

  // Add this where you define other constants
  useEffect(() => {
    if (valueFetch && !ercerror) {
      // Track high-risk tokens
      if (criticalPoint > 0) {
        logEvent(analytics, 'high_risk_token', {
          token_type: selectedToken,
          address: tokenAddress,
          critical_count: criticalPoint,
          total_score: totalScore
        });
      }

      // Track suspicious tax rates
      if (buyTax > 10 || sellTax > 10) {
        logEvent(analytics, 'high_tax_detected', {
          token_type: selectedToken,
          address: tokenAddress,
          buy_tax: buyTax,
          sell_tax: sellTax
        });
      }
    }
  }, [valueFetch]);

  const tokenImage = tokenImages[selectedToken]
  // Honeypot status message
  const honeypotStatus = !ercerror && valueFetch?.honeypotDetails?.isPairHoneypot === 1
    ? "Is a Honeypot"
    : "Not a Honeypot";

  return (
    <div className="flex justify-center">
      {/* <div
    className="bg-[#18162099]/60 rounded-[10px] backdrop-filter h-full backdrop-blur-sm w-full mx-3 jost text-white"
    style={{ boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.5)' }}
  > */}
      <div
        className="bg-[#18162099]/60 rounded-[10px] backdrop-filter h-full backdrop-blur-sm sm:w-[460px] w-[280px] mx-3 jost text-white"
        style={{ boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.5)' }}
      >
        {
          !ercerror && <> <div className="bg-[#181B2E] rounded-t-[10px] p-[5px] sm:p-[15px] px-[8px] sm:px-[20px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Skeleton for Avatar and Token Name */}
                {loading ? (
                  <>
                    <Skeleton circle={true} height={20} width={20} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={50} height={15} />
                  </>
                ) : (
                  <>
                    {selectedToken && (
                      <img className=' h-3 sm:h-5' src={valueFetch?.tokenInformation?.generalInformation?.tokenImageLink || tokenImages[selectedToken] || Polygon} alt="Avatar" />
                    )}
                    <div className=" flex gap-1 sm:gap-2 items-baseline">
                      <p className="text-sm sm:text-xl text-center max-w-16 sm:max-w-44 truncate">{valueFetch?.tokenInformation?.generalInformation?.tokenName || 'Token Name'}</p>
                      <p className='text-[8px] sm:text-xs font-light'>({valueFetch?.tokenInformation?.generalInformation.tokenSymbol || 'Symbol'})</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex rounded-[20px]">
                {loading ? (
                  <Skeleton height={30} width={80} />
                ) : (

                  <div className='border p-1 rounded'>
                    <img onClick={onBackClick} src={"https://cdn.iconscout.com/icon/premium/png-256-thumb/back-arrow-9601866-8212676.png?f=webp&w=256"} className='w-3 sm:w-5 h-3 sm:h-5' alt="" />
                  </div>
                )}
              </div>
            </div>

            {/* Token Address */}
            <p className='text-xs text-white flex items-center'>
              {loading ? (
                <Skeleton width={250} />
              ) : (
                selectedToken && (
                  <span
                    className="mr-2 p-1 px-3 rounded-[5px] text-xs sm:text-sm flex gap-1 items-center"
                    style={{ backgroundColor: buttonColors[selectedToken] || '#000000' }}  // Fallback to black if no token selected
                  >
                    {tokenImages[selectedToken] && (
                      <img src={tokenImages[selectedToken]} alt={selectedToken} className="h-3" />
                    )}
                    {selectedToken}
                  </span>
                )
              )}
              <span className='overflow-scroll lg:overflow-visible scrollbar-hide w-32 truncate sm:w-full '>
                {loading ? <Skeleton width={200} /> : (tokenAddress || 'Enter Token Address')}
              </span>
            </p>
          </div>

            <div className="px-[8px] sm:px-[20px] pt-[8px] sm:pt-[20px] pb-[4px] sm:pb-[10px]">
              <div className="flex items-center justify-between h-full">
                {/* Status and Report */}
                {loading ? (
                  <>
                    <Skeleton width={100} height={100} />
                    <Skeleton width={200} height={100} />
                  </>
                ) : (
                  <>
                    <Status totalScore={totalScore} tokenAge={tokenAge} honeypotStatus={honeypotStatus} owner={owner} />
                    <div className="border-l-2 border-white/10 mx-5 self-stretch"></div>
                    <Report critical={criticalPoint} risky={riskyPoint} medium={mediumPoint} neutral={neutralPoint} />
                  </>
                )}
              </div>

              <div className="border-b-2 border-white/10 my-1 self-stretch"></div>

              {/* Info Section */}
              {loading ? (
                <Skeleton width={400} height={60} />
              ) : (
                <Info
                  holdersCount={formatNumber(holdersCount)}
                  holdersCountRisk={holdersCountRisk}
                  currentLiquidity={currentLiquidity}
                  currentLiquidityRisk={currentLiquidityRisk}
                  lpHolders={lpHolders}
                  lpHoldersRisk={lpHoldersRisk}
                  buyTax={buyTax}
                  buyTaxRisk={buyTaxRisk}
                  sellTax={sellTax}
                  sellTaxRisk={sellTaxRisk}
                  transferTax={transferTax}
                  transferTaxRisk={transferTaxRisk}
                  pairs={pairs}
                  pairsRisk={pairsRisk}
                />
              )}

              {/* Honeypot Status Display */}
              {/* <div className="text-center text-lg mt-2">
        {loading ? <Skeleton width={200} height={30} /> : <p>{honeypotStatus}</p>}
      </div> */}
            </div>
          </>
        }

        {
          ercerror && <div className='m-1 sm:m-5 flex flex-col justify-center items-center py-1 sm:py-3 pt-1 sm:pt-4'>  <p className=' text-sm sm:text-3xl  flex gap-2 sm:gap-4  '> <img src={
            "https://check.quillai.network/icons/X.svg"} className='w-5 sm:w-7 ' alt='x' /> ERC-20 contract not be found at the given address </p> <br />
            <div className='flex justify-center text-xs sm:text-base items-center px-2 sm:px-5 ' >
              Please confirm the contract is ERC-20 and on the correct chain.
            </div>
            <div >
              <button className='underline' onClick={onBackClick}>Go back</button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default EvaluateReport;