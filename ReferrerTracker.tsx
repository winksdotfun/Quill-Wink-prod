"use client";
import { useEffect } from 'react';


export function ReferrerTracker() {
  useEffect(() => {
    const isFromTwitter = document.referrer.includes('x.com') || 
                         document.referrer.includes('twitter.com');
    
    console.log("Current URL:", window.location.href);
    console.log("Referrer:", document.referrer);
    console.log("Is opened in X.com:", isFromTwitter);

    // Redirect if not coming from Twitter/X
    if (!isFromTwitter) {
      window.location.href = 'https://winks.fun';
    }
  }, []);

  return null;
}