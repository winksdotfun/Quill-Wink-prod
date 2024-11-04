import React, { useState } from 'react';
import Assets from './components/Assets';
import SelectToken from './components/SelectToken';
import EvaluateReport from './components/EvaluateReport';
import EvaluateSol from './components/EvaluateSol'; // Import EvaluateSol component
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [showReport, setShowReport] = useState(false); // Toggle between SelectToken and EvaluateReport/EvaluateSol
  const [selectedToken, setSelectedToken] = useState(''); // State to store selected token
  const [tokenAddress, setTokenAddress] = useState(''); // State to store entered token address
  const [chainId, setChainId] = useState(null); // State to store chainId
  const [empty, setEmpty] = useState(false);
  const [buttonclick, setButtonclick] = useState(false);

  const handleCheckClick = () => {
    // Check if the selected token is SOL and validate the address length
    if (selectedToken === 'SOL' && (tokenAddress.length < 43 || tokenAddress.length > 47)) {
      setEmpty(true);
      return;
    }
    

    // Check the token address length for other tokens
    if (selectedToken !== 'SOL' && tokenAddress.length !== 42) {
      setEmpty(true);
      return;
    }

    // Check if no token is selected
    if (selectedToken === '') {
      setButtonclick(true);
      return;
    }

    setShowReport(true); // Show EvaluateReport or EvaluateSol when Check is clicked
  };


  const handleBackClick = () => {
    setShowReport(false); // Show SelectToken when Back is clicked
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
                setSelectedToken={setSelectedToken}
                setTokenAddress={setTokenAddress}
                setChainId={setChainId} // Pass the setChainId handler
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
