import React, { useState, useCallback, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from '@reach/router';

import { useCustomWallet } from '../../contexts/WalletContext';
import Subheader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import WarningMsg from '../../components/WarningMsg';
import { Information } from '../../components/Information';
import BackButton from '../../components/menu/BackButton';
import { useContract } from '../../contexts/ContractContext';
import useBackend from '../../hooks/useBackend';
import { SECS_PER_DAY, IsSmMobile, getBountyStatus, getDuration } from '../../utils';

const PreviewBody = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { walletAddress, isConnected } = useCustomWallet();
  const { CONTRACT_ID, DEF_PAY_TOKEN, approveToken, createBounty } = useContract();
  const { createBountyB } = useBackend();
  const {title, payAmount, duration, type, difficulty, topic, description, gitHub } = loc.state;

  function checkCondition() {
    if (!isConnected) {
      toast.warning('Wallet not connected yet!');
      return false;
    }
    if (!title) {
      toast.warning('Please input title!');
      return false;
    }
    if (payAmount === '' || Number(payAmount) === 0) {
      toast.warning('Please input amount!');
      return false;
    }
    if ( !duration ) {
      toast.warning('Please select duration!');
      return false;
    }
    if ( !type ) {
      toast.warning('Please select type!');
      return false;
    }
    if ( !difficulty ) {
      toast.warning('Please select difficulty!');
      return false;
    }
    if ( !topic ) {
      toast.warning('Please select topic!');
      return false;
    }
    if ( !description ) {
      toast.warning('Please input description!');
      return false;
    }
    return true;
  }

  const handleSubmit = useCallback(async (event) => {

    if ( !checkCondition() ) return;
    
    // approve first
    // const res1 = await approveToken(walletAddress, CONTRACT_ID, Number(payAmount) * 10000000);
    // if (res1) {
    //   toast.error('Failed to approve token!');
    //   return;
    // }

    const days = getDuration(duration);
    const [bountyId, ledger] = await createBounty(walletAddress, title, Number(payAmount) * 10000000, DEF_PAY_TOKEN, SECS_PER_DAY * days);
    if (bountyId < 0) {
      toast.error('Failed to create new bounty!');
      return;
    }

    const res2 = await createBountyB(walletAddress, bountyId,
      title, Number(payAmount), SECS_PER_DAY * days,
      type, difficulty, topic,
      description, gitHub,
      ledger);
    if (res2) {
      toast.error('Failed to add bounty!');
      return;
    }

    toast('Successfully added bounty!');

    nav('/NewBounty/');
  }, [walletAddress, title, payAmount, description, duration, type, topic, difficulty]);

  return (
    <div className='app-content'>
      <div className='row'>
        <div className='col-lg-7 pr-3 pt-7'>
          <div className='flex justify-between sm:items-center pt-2 pb-3'>
            <div className='flex flex-col'>
              <button className='text-[18px] border rounded-2xl px-4'>{getBountyStatus(loc.state.status)}</button>
            </div>
            <div className='flex'>
              <button className='text-[18px] mr-2'><i className='fa-regular fa-arrow-up-from-square mr-2'></i>Share</button>
            </div>
          </div>
          <span className='py-2' dangerouslySetInnerHTML={{__html: loc.state.description?.replace(new RegExp('\r?\n','g'), '<br />')}}></span>
          {!isConnected &&
            <WarningMsg msg='You need to connect your wallet in order to create a bounty.' />}
        </div>
        <div className='col-lg-5 py-2 md:pl-0'>
          <Information {...loc.state} />
          <div className='w-full my-2 py-3'>
            <button
              className='text-[18px] w-full border rounded-2xl px-2 py-2 btn-hover'
              onClick={() => {
                nav('/NewBounty', { state: { ...loc.state } })
              }}
            >Edit</button>
            <button className='text-[18px] w-full border rounded-2xl px-2 py-2 btn-hover mt-2' onClick={handleSubmit}>Create Bounty</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PreviewNewBounty = () => {
  const loc = useLocation();

  return (
    <div className='full-container overflow-auto'>
      <div className='container'>
        <MainHeader />
        <div className='bounty-listing-container'>
          <Subheader />
          <BackButton to='/NewBounty' state={{...loc.state}}/>
          <div className='app-header px-0 xl:items-center xsm:items-start sm:flex-col'>
            <div className='app-title'>
              <p className='text-[40px] sm:text-center text-white pt-3'>{loc.state.title}</p>
            </div>
          </div>
          {IsSmMobile() ? (
            <PreviewBody />
          ) : (
            <Scrollbars id='body-scroll-bar' autoHide style={{ height: '100%' }}
              renderThumbVertical={({ style, ...props }) =>
                <div {...props} className={'thumb-horizontal'} />
              }>
              <PreviewBody />
            </Scrollbars>
          )}
        </div>
      </div>
      <HelpButton />
    </div>
  );
}

export default PreviewNewBounty;
