import React, { useState, useEffect } from 'react';
import Assets from './components/Assets';
import SelectToken from './components/SelectToken';
import EvaluateReport from './components/EvaluateReport';
import EvaluateSol from './components/EvaluateSol'; // Import EvaluateSol component
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';


const App = () => {
  const [showReport, setShowReport] = useState(false); // Toggle between SelectToken and EvaluateReport/EvaluateSol
  const [selectedToken, setSelectedToken] = useState(''); // State to store selected token
  const [tokenAddress, setTokenAddress] = useState(''); // State to store entered token address
  const [chainId, setChainId] = useState(null); // State to store chainId
  const [empty, setEmpty] = useState(false);
  const [buttonclick, setButtonclick] = useState(false);

  // Track initial page load
  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: 'Token Checker Home',
      page_location: window.location.href
    });
    logEvent(analytics, 'app_open', {
      appName: "QuillCheck X Wink",
      openTime: new Date().toISOString(),
    })
  }, []);

  const handleCheckClick = () => {
     // Track validation attempts
     logEvent(analytics, 'check_token_attempt', {
      token_type: selectedToken,
      address_length: tokenAddress.length,
      chain_id: chainId
    });

    // Check if the selected token is SOL and validate the address length
    if (selectedToken === 'SOL' && (tokenAddress.length < 43 || tokenAddress.length > 47)) {
      setEmpty(true);
      logEvent(analytics, 'validation_error', {
        token_type: 'SOL',
        error_type: 'invalid_address_length',
        address_length: tokenAddress.length
      });
      return;
    }
    

    // Check the token address length for other tokens
    if (selectedToken !== 'SOL' && tokenAddress.length !== 42) {
      setEmpty(true);
      logEvent(analytics, 'validation_error', {
        token_type: selectedToken,
        error_type: 'invalid_address_length',
        address_length: tokenAddress.length
      });
      return;
    }

    // Check if no token is selected
    if (selectedToken === '') {
      setButtonclick(true);
      logEvent(analytics, 'validation_error', {
        error_type: 'no_token_selected'
      });
      return;
    }

    // Successful validation
    logEvent(analytics, 'token_check_success', {
      token_type: selectedToken,
      chain_id: chainId,
      address_length: tokenAddress.length
    });

    setShowReport(true); // Show EvaluateReport or EvaluateSol when Check is clicked
  };


  const handleBackClick = () => {
    logEvent(analytics, 'navigation', {
      action: 'return_to_selection',
      from_token_type: selectedToken,
      chain_id: chainId
    });
    setShowReport(false); // Show SelectToken when Back is clicked
  };

   // Track token selection
   const handleTokenSelect = (token) => {
    setSelectedToken(token);
    logEvent(analytics, 'token_selected', {
      token_type: token,
      previous_token: selectedToken
    });
  };

  // Track address input
  const handleAddressInput = (address) => {
    setTokenAddress(address);
    if (address.length > 0) {
      logEvent(analytics, 'address_input', {
        token_type: selectedToken,
        address_length: address.length,
        is_valid_length: selectedToken === 'SOL' ? 
          (address.length >= 43 && address.length <= 47) : 
          address.length === 42
      });
    }
  };

  // Track chain selection
  const handleChainSelect = (chain) => {
    setChainId(chain);
    logEvent(analytics, 'chain_selected', {
      chain_id: chain,
      token_type: selectedToken
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center bricolage-font bg-custom-bg jost flex justify-center items-center">
      <div className="p-3 space-y-2 sm:space-y-5">
        <img
          className="w-[100px] sm:w-[200px] h-[20px] sm:h-[40px] mx-auto"
          src={Assets.QuillCheckLogo}
          alt="Quill Check Logo"
        />

        {/* AnimatePresence with mode="wait" */}
        <AnimatePresence mode="wait">
          {!showReport ? (
            <motion.div
              key="select-token"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.6 }}
            >
              {/* Pass setSelectedToken, setTokenAddress, and setChainId */}
              <SelectToken
                onCheckClick={handleCheckClick}
                // setSelectedToken={setSelectedToken}
                // setTokenAddress={setTokenAddress}
                // setChainId={setChainId} // Pass the setChainId handler
                setSelectedToken={handleTokenSelect}  // Updated to use new handler
                setTokenAddress={handleAddressInput}  // Updated to use new handler
                setChainId={handleChainSelect}       // Updated to use new handler
                empty={empty}
                setempty={setEmpty}
                buttonclick={buttonclick}
                setButtonclick={setButtonclick}
              />
            </motion.div>
          ) : selectedToken === 'SOL' ? (
            <motion.div
              key="evaluate-sol"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.6 }}
            >
              {/* Render EvaluateSol component if SOL is selected */}
              <EvaluateSol
                onBackClick={handleBackClick}
                selectedToken={selectedToken}
                tokenAddress={tokenAddress}
                chainId={chainId} // Pass chainId to the report
              />
            </motion.div>
          ) : (
            <motion.div
              key="evaluate-report"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.6 }}
            >
              {/* Render EvaluateReport component for other tokens */}
              <EvaluateReport
                onBackClick={handleBackClick}
                selectedToken={selectedToken}
                tokenAddress={tokenAddress}
                chainId={chainId} // Pass chainId to the report
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          <div className="flex justify-center text-white text-xs sm:text-lg font-light">
            <img className=" hidden sm:flex w-auto sm:h-5" src={Assets.QuillAI} alt="QuillAI" />
          </div>
          <div className="flex justify-center items-center text-white">
            Powered by Winks.fun
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
