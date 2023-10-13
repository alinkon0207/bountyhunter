import React, { useState, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Reveal } from 'react-awesome-reveal';

import { useCustomWallet } from '../../contexts/WalletContext';
import Sidebar from '../../components/menu/SideBar';
import Subheader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import SearchBox from '../../components/menu/SearchBox';
import WarningMsg from '../../components/WarningMsg';
import useBackend from '../../hooks/useBackend';
import { IsSmMobile, fadeInUp } from '../../utils';
import InBounty from './InBounty';

const InProgress = () => {
  const { isConnected, walletAddress } = useCustomWallet();
  const { getAppliedBounties } = useBackend();

  const [bounties, setBounties] = useState([]);

  const [isSearchShow, setShow] = useState(false);

  const [searchChanged, setSearchChanged] = useState(false);

  const searchbox = useRef(null);

  useEffect(() => {
    async function fetchBounties() {
      setBounties([]);
      if (!isConnected)
        return;

      var appliedBounties = await getAppliedBounties(walletAddress);
      console.log('appliedBounties:', appliedBounties);
      appliedBounties = appliedBounties.filter( item => searchbox?.current?.filter(item) );
      setBounties(appliedBounties);
    }

    fetchBounties();
  }, [isConnected, walletAddress, searchChanged]);


  return (
    <div className='full-container'>
      <div className='container'>
        <MainHeader />
        <Sidebar path='InProgress' />
        <div className='app-container'>
          <Subheader path='InProgress' />
          <div className='app-header items-center md:items-start sm:flex-col lg:pl-0 pl-[40px] pr-0 relative z-[99]'>
            <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
              <div className='app-title'>
                <p className='text-[40px] lg:text-[32px] md:text-[24px] sm:text-center text-white'>In Progress</p>
              </div>
            </Reveal>
            <SearchBox ref={searchbox} onSearchChange={ () => setSearchChanged(true)}  callback={() => { setShow(isSearchShow => !isSearchShow) }} />
          </div>

          {!isConnected &&
            <div className='pl-[30px] lg:pl-0'>
              <WarningMsg msg='You need to connect your wallet in order to submit a work.' />
            </div>
          }

          <div className={`app-content ${isSearchShow ? 'blur-sm' : ''}`}>
            {IsSmMobile() ? (
              bounties?.map((bounty, idx) => {
                return (
                  <InBounty key={idx} bountyId={bounty.bountyId} />
                );
              })
            ) : (
              <Scrollbars id='body-scroll-bar' autoHide style={{ height: '100%' }}
                renderThumbVertical={({ style, ...props }) =>
                  <div {...props} className={'thumb-horizontal'} />
                }>
                {
                  bounties?.map((bounty, idx) =>
                    <InBounty key={idx} bountyId={bounty.bountyId} />
                  )
                }
              </Scrollbars>
            )}
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  );
}

export default InProgress;
