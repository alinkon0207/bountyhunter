import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from '@reach/router';
import Scrollbars from 'react-custom-scrollbars';
import { toast } from 'react-toastify';

import { useCustomWallet } from '../../contexts/WalletContext';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import Subheader from '../../components/menu/SubHeader';
import { Information } from '../../components/Information';
import { ListingDescription } from '../../components/ListingDescription';
import { Participant } from '../../components/Participant';
import WarningMsg from '../../components/WarningMsg';
import BackButton from '../../components/menu/BackButton'
import { useContract } from '../../contexts/ContractContext';
import useBackend from '../../hooks/useBackend';
import { Drawer } from './Drawer';
import { IsSmMobile } from '../../utils';

const InBountyListingBody = ({ bounty, callback }) => {
  return (
    <div className='app-content pb-0 pr-4'>
      {!IsSmMobile() ?
        <div className='flex gap-3'>
          <div className='col-lg-7 pt-7'>
            <ListingDescription bounty={bounty} />
            <Participant bountyId={bounty.bountyId} submit={true} />
          </div>
          <div className='col-lg-5'>
            <Information 
              wallet = {bounty?.creator?.wallet} 
              payAmount = {bounty?.payAmount} 
              type = {bounty?.type} 
              difficulty = {bounty?.difficulty} 
              topic = {bounty?.topic} 
              gitHub = {bounty?.gitHub} 
              startDate = {Date.parse(bounty?.startDate)} 
              endDate = {Date.parse(bounty?.endDate)} 
              block = {bounty?.block} 
              status = {bounty?.status}
            />
            <div className='w-full my-2 py-3'>
          <div className='w-full my-2 py-3'>
            <button className='text-[18px] w-full border rounded-2xl px-2 py-2 btn-hover' onClick={() => { callback() }}>Submit Work</button>
          </div>
            </div>
          </div>
        </div> :
        <div className='flex flex-col'>
          <ListingDescription bounty={bounty} />
          <Information 
              wallet = {bounty?.creator?.wallet} 
              payAmount = {bounty?.payAmount} 
              type = {bounty?.type} 
              difficulty = {bounty?.difficulty} 
              topic = {bounty?.topic} 
              gitHub = {bounty?.gitHub} 
              startDate = {Date.parse(bounty?.startDate)} 
              endDate = {Date.parse(bounty?.endDate)} 
              block = {bounty?.block} 
              status = {bounty?.status}
          />
          <Participant bountyId={bounty.bountyId} />
          <div className='w-full my-2 py-3'>
            <button className='text-[18px] w-full border rounded-2xl px-2 py-2 btn-hover' onClick={() => { callback() }}>Submit Work</button>
          </div>
        </div>}
      <HelpButton />
    </div>
  );
}

const InBountyListing = () => {
  const { isConnected, walletAddress } = useCustomWallet();
  const { submitWork } = useContract();
  const { getSingleBounty, getWork, submitWorkB } = useBackend();
  const { id: bountyId } = useParams();
  const nav = useNavigate();
  const [bounty, setBounty] = useState({});
  const [work, setWork] = useState({});
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gitHub, setGitHub] = useState('');
  
  useEffect(() => {
    async function fetchBountyAndWork(bountyId) {
	  if (!bountyId) return;
      const singleBounty = await getSingleBounty(bountyId);
      setBounty(singleBounty);
      if (!walletAddress) return;
      const work = await getWork(walletAddress, bountyId);
      setWork(work);
    }

    fetchBountyAndWork(bountyId);
  }, [walletAddress, bountyId]);

  const onChangeTitle = useCallback((event) => {
    setTitle(event.target.value);
  }, []);
  const onChangeDescription = useCallback((event) => {
    setDescription(event.target.value);
  }, []);
  const onChangeGitHub = useCallback((event) => {
    setGitHub(event.target.value);
  }, []);

  const onSubmitClicked = useCallback(async (event) => {
    if (!isConnected) {
      toast.warning('Wallet not connected yet!');
      return;
    }

    const res1 = await submitWork(walletAddress, work?.workId, gitHub);
    if (res1) {
      toast.error('Failed to submit to bounty!');
      return;
    }

    const res2 = await submitWorkB(walletAddress, work?.workId, title, description, gitHub);
    if (res2) {
      toast.error('Failed to submit work!');
      return;
    }

    toast('Successfully submitted work!');

    nav('/InProgress/');
  }, [isConnected, walletAddress, work, gitHub]);

  return (
    <div className='full-container'>
      <div className='container'>
        <MainHeader />
        <div className='bounty-listing-container'>
          <Subheader />
          <BackButton to='/InProgress' />
          <div className='app-header px-0 xsm:items-start xl:items-center xsm:flex-col'>
            <div className='app-title'>
              <p className='text-[40px] sm:text-center text-white pt-3'>{bounty?.title}</p>
            </div>
          </div>
          {IsSmMobile() ? (
            <InBountyListingBody bounty={bounty} callback={handleDrawerOpen} />
          ) : (
            <Scrollbars id='body-scroll-bar' autoHide style={{ height: '100%' }}
              renderThumbVertical={({ style, ...props }) =>
                <div {...props} className={'thumb-horizontal'} />
              }>
              <InBountyListingBody bounty={bounty} callback={handleDrawerOpen} />
            </Scrollbars>
          )}
        </div>
      </div>
      <HelpButton />
      <Drawer anchor='right' className='w-full' open={drawerOpen} onClose={handleDrawerClose}>
        <button onClick={handleDrawerClose}>
          <div className='flex gap-2'>
            <span className='text-xl'><i className='fa fa-angle-left' /></span>
            <span className='text-xl'>Back</span>
          </div>
        </button>
        {!isConnected && (<WarningMsg msg='You need to connect your wallet in order to submit a work.'/>)}
        <div className='mt-3 text-[20px] font-bold'>
          <span>Bounty Listing / Submit Work</span>
        </div>
        <div className='input-form-control mt-3'>
          <label className='input-label'>Title</label>
          <div className='input-control'>
            <input type='text' name='title' value={title} className='input-main' onChange={onChangeTitle} />
          </div>
        </div>
        <div className='input-form-control mt-3'>
          <label className='input-label'>Description</label>
          <div className='input-control h-auto'>
            <textarea type='text' name='description' value={description} className='input-main' onChange={onChangeDescription} />
          </div>
        </div>
        <div className='input-form-control mt-3'>
          <label className='input-label'>Github Link</label>
          <div className='input-control'>
            <input type='text' name='gitHub' value={gitHub} className='input-main' onChange={onChangeGitHub} />
          </div>
        </div>
        <div className='input-form-control mt-3'>
          <div className='input-control w-1/2 border-0'>
            <button className='input-main btn-hover' onClick={onSubmitClicked}>Submit Work</button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default InBountyListing;
