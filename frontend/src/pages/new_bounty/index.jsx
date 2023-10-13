import React, { useState, useEffect, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Reveal } from 'react-awesome-reveal';
import { useLocation, useNavigate } from '@reach/router';
import { toast } from 'react-toastify';

import Sidebar from '../../components/menu/SideBar';
import Subheader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import WarningMsg from '../../components/WarningMsg';
import { useCustomWallet } from '../../contexts/WalletContext';
import { useContract, BountyStatus } from '../../contexts/ContractContext';
import useBackend from '../../hooks/useBackend';
import { SECS_PER_DAY, IsSmMobile, fadeInUp, fadeIn, getDuration } from '../../utils';

const NewBountyBody = () => {
  const { walletAddress, isConnected } = useCustomWallet();
  const { CONTRACT_ID, DEF_PAY_TOKEN, approveToken, createBounty } = useContract();
  const { createBountyB } = useBackend();

  const loc = useLocation();
  const nav = useNavigate();

  const [title, setTitle] = useState('B1');
  const [payAmount, setPayAmount] = useState('100');
  const [duration, setDuration] = useState(1);
  const [type, setType] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [topic, setTopic] = useState(1);
  const [description, setDescription] = useState('D1');
  const [gitHub, setGitHub] = useState('https://github.com/creator1/bounty1');

  useEffect(() => {
    const { title, payAmount, duration, type, difficulty, topic, description, gitHub } = loc.state;
    if (title) setTitle(title);
    if (payAmount) setPayAmount(payAmount);
    if (duration) setDuration(duration);
    if (type) setType(type);
    if (difficulty) setDifficulty(difficulty);
    if (topic) setTopic(topic);
    if (description) setDescription(description);
    if (gitHub) setGitHub(gitHub);
  }, []);

  const onChangeTitle = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const onChangePayAmount = useCallback((event) => {
    setPayAmount(event.target.value);
  }, []);

  const onChangeDuration = useCallback((event) => {
    setDuration(Number(event.target.value));
  }, []);

  const onChangeType = useCallback((event) => {
    setType(Number(event.target.value));
  }, []);

  const onChangeDifficulty = useCallback((event) => {
    setDifficulty(Number(event.target.value));
  }, []);

  const onChangeTopic = useCallback((event) => {
    setTopic(Number(event.target.value));
  }, []);

  const onChangeDesc = useCallback((event) => {
    setDescription(event.target.value);
  }, []);

  const onChangeGitHub = useCallback((event) => {
    setGitHub(event.target.value);
  }, []);

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

  const handlePreview = useCallback(async (event) => {
    if (!checkCondition()) return;

    nav('/NewBounty/Preview', {
      state: {
        title, payAmount, duration, type, difficulty, topic, description, gitHub,
        wallet: walletAddress,
        status: BountyStatus.INIT,
        startDate: Date.now(),
        endDate: Date.now() + getDuration(duration) * SECS_PER_DAY * 1000,
      }
    });

  }, [isConnected, walletAddress, title, payAmount, duration, type, difficulty, topic, description, gitHub]);

  const handleSubmit = useCallback(async (event) => {
    if (!checkCondition()) return;

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
  }, [isConnected, walletAddress, title, payAmount, duration, type, difficulty, topic, description, gitHub]);

  return (
    <div className='app-body lg:pl-0 pl-[20px] pr-0 mt-3'>
      <Reveal keyframes={fadeInUp} className='onStep' delay={400} duration={1000} triggerOnce>

        <div className='w-full xl:w-full xl:h-fit lg:w-full md:w-full'>
          <div className='col-md-12'>
            <div className='row m-0'>
              <div className='col-md-12 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Title</label>
                  <div className='input-control'>
                    <input type='text' name='title' value={title} className='input-main' onChange={onChangeTitle}></input>
                  </div>
                </div>
              </div>
              <div className='col-md-6 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Payment Amount</label>
                  <div className='input-control'>
                    <input type='number' name='payAmount' value={payAmount} className='input-main' onChange={onChangePayAmount}></input>
                  </div>
                </div>
              </div>
              <div className='col-md-6 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Dead Line</label>
                  <div className='input-control'>
                    <select name='deadline' value={duration} className='input-main' onChange={onChangeDuration}>
                      <option value={0} disabled hidden>Select a duration</option>
                      <option value={1}>More than 6 months</option>
                      <option value={2}>3 to 6 months</option>
                      <option value={3}>1 to 3 months</option>
                      <option value={4}>Less than 1 month</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-md-4 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Bounty Type</label>
                  <div className='input-control'>
                    <select name='type' value={type} className='input-main' onChange={onChangeType}>
                      <option value={0} disabled hidden>Select a type</option>
                      <option value={1}>Competitive</option>
                      <option value={2}>Cooperative</option>
                      <option value={3}>Hackathon</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-md-4 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Bounty Difficulty</label>
                  <div className='input-control'>
                    <select name='difficulty' value={difficulty} className='input-main' onChange={onChangeDifficulty}>
                      <option value={0} disabled hidden>Select a difficulty</option>
                      <option value={1}>Beginner</option>
                      <option value={2}>Intermediate</option>
                      <option value={3}>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-md-4 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Bounty Topic</label>
                  <div className='input-control'>
                    <select name='topic' value={topic} className='input-main' onChange={onChangeTopic}>
                      <option value={0} disabled hidden>Select a topic</option>
                      <option value={1}>Design</option>
                      <option value={2}>Development</option>
                      <option value={3}>Smart Contracts</option>
                      <option value={4}>Data</option>
                      <option value={5}>AI</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-md-12 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Description</label>
                  <div className='input-control h-auto'>
                    <textarea type='text' name='description' value={description} rows={5} className='input-main' onChange={onChangeDesc}></textarea>
                  </div>
                </div>
              </div>

              <div className='col-md-12 pb-3'>
                <div className='input-form-control'>
                  <label className='input-label'>Github Link</label>
                  <div className='input-control'>
                    <input type='text' name='gitHub' value={gitHub} className='input-main' onChange={onChangeGitHub}></input>
                  </div>
                </div>
              </div>
              <div className='col-md-4 pb-3'>
                <div className='input-form-control'>
                  <div className='input-control border-0'>
                    <button className='input-main btn-hover text-white' onClick={handlePreview}>Preview</button>
                  </div>
                </div>
              </div>
              <div className='col-md-4 pb-3'>
                <div className='input-form-control'>
                  <div className='input-control border-0'>
                    <button className='input-main btn-hover text-white' onClick={handleSubmit}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Reveal>
    </div>
  );
}

const NewBounty = () => {
  const { isConnected } = useCustomWallet();
  return (
    <div className='full-container'>
      <div className='container'>
        <MainHeader />
        <Sidebar path='NewBounty' />
        <div className='app-container'>
          <Subheader path='NewBounty' />

          {!isConnected &&
            <div className='pl-[40px] lg:pl-0'>
              <WarningMsg msg='You need to connect your wallet in order to create a bounty.' />
            </div>}

          <div className='app-content'>
            {IsSmMobile() ? (
              <NewBountyBody />
            ) : (
              <Scrollbars id='body-scroll-bar' className='' style={{ height: '100%' }}
                renderThumbVertical={({ style, ...props }) =>
                  <div {...props} className={'thumb-horizontal'} />
                }>
                <NewBountyBody />
              </Scrollbars>
            )}
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  )
};

export default NewBounty;
