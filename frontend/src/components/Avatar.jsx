import React, { useState, useEffect } from 'react';
import { useCustomWallet } from '../contexts/WalletContext';
import useBackend from '../hooks/useBackend';

const Avatar = ({ hide }) => {
  const { isConnected, walletAddress } = useCustomWallet();
  const { getUser } = useBackend();
  const [userImg, setUserImg] = useState(null);
  
  useEffect(() => {
    setUserImg(null);
    if (!isConnected)
      return;

    async function fetchUserImg(walletAddress) {
      const userProfile = await getUser(walletAddress);
      setUserImg(userProfile.img);
    }

    fetchUserImg(walletAddress);
  }, [isConnected, walletAddress]);

  return (
    <div className='relative flex items-center justify-center'>
      <img alt='' className='w-[120px] h-[120px] rounded-full' 
		    src={(!hide && userImg) ? userImg : '/images/banner/unknown.png'} />
    </div>
  );
}

export default Avatar;
