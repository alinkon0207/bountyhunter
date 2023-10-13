/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useRef } from 'react';
import { Reveal } from 'react-awesome-reveal';
import { Scrollbars } from 'react-custom-scrollbars';
import { useCustomWallet } from '../../contexts/WalletContext';
import Sidebar from '../../components/menu/SideBar';
import Subheader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import SearchBox from '../../components/menu/SearchBox';
import WarningMsg from '../../components/WarningMsg';
import useBackend from '../../hooks/useBackend';
import { fadeInUp, IsSmMobile } from '../../utils';
import { MyBountyBodyListItem } from './MyBountiesBody';

const MyBounties = () => {
  const { isConnected, walletAddress } = useCustomWallet();
  const { getCreatedBounties } = useBackend();

  const [bounties, setBounties] = useState([]);

  const [isSearchShow, setShow] = useState(false);

  const [searchChanged, setSearchChanged] = useState(false);

  const searchbox = useRef(null);

  useEffect(() => {
    async function fetchBounties() {
      setBounties([]);
      if (!isConnected)
        return;

      var createdBounties = await getCreatedBounties(walletAddress);
      console.log('createdBounties:', createdBounties);
      createdBounties = createdBounties.filter( item => searchbox?.current?.filter(item) );
      setBounties(createdBounties);
    }

    fetchBounties();
  }, [isConnected, walletAddress, searchChanged]);

  return (
    <div className='full-container'>
      <div className='container'>
        <MainHeader />
        <Sidebar path='MyBounties' />
        <div className='app-container'>
          <Subheader path='MyBounties' />
          <div className='app-header md:items-start sm:flex-col lg:pl-0 pl-[40px] pr-0 relative z-[99]'>
            <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
              <div className='app-title'>
                <p className='text-[40px] lg:text-[32px] md:text-[24px] text-white'>My Bounties</p>
              </div>
            </Reveal>
            <SearchBox ref={searchbox} onSearchChange={ () => setSearchChanged(true)}  callback={() => { setShow(isSearchShow => !isSearchShow) }} />
          </div>
          {!isConnected &&
            <div className='pl-[30px] lg:pl-0'>
              <WarningMsg msg='You need to connect your wallet in order to review a work.' />
            </div>
          }
          <div className={`app-content ${isSearchShow ? 'blur-sm' : ''}`}>
            {IsSmMobile() ? (
              bounties?.map((bounty, idx) => (
                <MyBountyBodyListItem key={idx} bountyId={bounty.bountyId} />
              ))
            ) : (
              <Scrollbars id='body-scroll-bar' autoHide style={{ height: '100%' }}
                renderThumbVertical={({ style, ...props }) =>
                  <div {...props} className={'thumb-horizontal'} />
                }>
                {bounties?.map((bounty, idx) => (
                  <MyBountyBodyListItem key={idx} bountyId={bounty.bountyId} />
                ))
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

export default MyBounties;
