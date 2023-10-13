import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Reveal } from 'react-awesome-reveal';

import { useCustomWallet } from '../../contexts/WalletContext';
import SideBar from '../../components/menu/SideBar';
import SubHeader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import SearchBox from '../../components/menu/SearchBox';
import WarningMsg from '../../components/WarningMsg';
import useBackend from '../../hooks/useBackend';
import ExBounty from './ExBounty';
import { IsSmMobile, fadeInUp } from '../../utils';

const ExploreBounty = () => {
  const { isConnected } = useCustomWallet();

  const { getRecentBounties } = useBackend();

  const [bounties, setBounties] = useState([]);

  const [isSearchShow, setShow] = useState(false);

  const [searchChanged, setSearchChanged] = useState(false);

  const searchbox = useRef(null);

  useEffect(() => {
    async function fetchRecentBounties() {
      var recentBounties = await getRecentBounties();
      console.log('recentBounties:', recentBounties);
      recentBounties = recentBounties.filter( item => searchbox?.current?.filter(item) );
      setBounties(recentBounties);
      setSearchChanged(false);
    }
    fetchRecentBounties();
  }, [searchChanged]);

  return (
    <div className='full-container' >
      <div className='container'>
        <MainHeader />
        <SideBar path='ExploreBounties' />
        <div className='app-container'>
          <SubHeader path='ExploreBounties' />
          <div className='app-header items-center md:items-start sm:flex-col lg:pl-0 pl-[40px] pr-0 relative z-[99]'>
            <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
              <div className='app-title'>
                <p className='text-[40px] lg:text-[32px] md:text-[24px] text-white'>Explore Bounties</p>
                <p className='text-[16px] app-gray'><span className='app-color'>{bounties?.length}</span> Results </p>
              </div>
            </Reveal>
            <SearchBox ref={searchbox} onSearchChange={ () => setSearchChanged(true)} callback={() => { setShow(isSearchShow => !isSearchShow) }} />
          </div>

          {!isConnected &&
            <div className='pl-[30px] lg:pl-0'>
              <WarningMsg msg='You need to connect your wallet in order to apply to a work.' />
            </div>
          }

          <div className={`app-content ${isSearchShow ? 'blur-sm' : ''} ${ isConnected? '':'pb-[200px]'}`}>
            {IsSmMobile() ? (
              <div>
                {bounties?.map((item, idx) => {
                  return (
                    <ExBounty key={idx} bounty={item} />
                  );
                })}
              </div>
            ) : (
              <Scrollbars id='body-scroll-bar' autoHide style={{ height: '100%' }}
                renderThumbVertical={({ style, ...props }) =>
                  <div {...props} className={'thumb-horizontal'} />
                }>
                <div>
                  {bounties?.map((item, idx) =>
                    <ExBounty key={idx} bounty={item} />
                  )}
                </div>
              </Scrollbars>
            )}
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  );
}

export default ExploreBounty;
