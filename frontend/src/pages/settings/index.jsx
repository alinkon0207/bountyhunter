import React, { useState, useEffect, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Reveal } from 'react-awesome-reveal';
import { toast } from 'react-toastify';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useCustomWallet } from '../../contexts/WalletContext';
import Sidebar from '../../components/menu/SideBar';
import Subheader from '../../components/menu/SubHeader';
import MainHeader from '../../components/menu/MainHeader';
import HelpButton from '../../components/menu/HelpButton';
import WarningMsg from '../../components/WarningMsg';
import AvatarCrop from '../../components/AvatarCrop';
import useBackend from '../../hooks/useBackend';
import { IsSmMobile, fadeInUp } from '../../utils';

const SettingsBody = () => {
  const { walletAddress, isConnected } = useCustomWallet();
  const { getUser, setUser } = useBackend();
  const [name, setName] = useState('');
  const [github, setGitHub] = useState('');
  const [discord, setDiscord] = useState('');
  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleOk = () => {
    setOpen(false);
    setAvatar(preview);
    setPreview(null);
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
  };
  const handleName = useCallback((event) => {
    setName(event.target.value);
  }, []);
  const handleGitHub = useCallback((event) => {
    setGitHub(event.target.value);
  }, []);
  const handleDiscord = useCallback((event) => {
    setDiscord(event.target.value);
  }, []);

  const onAvatarCrop = useCallback((p) => {
    setPreview(p)
  })

  const onAvatarClose = useCallback((p) => {
    setPreview(null)
  })

  const handleSave = useCallback((event) => {
    if (!isConnected) {
      toast.warning(`Wallet not connected yet!`);
      return;
    }

    if (!setUser(walletAddress, name, github, discord, avatar)) {
      toast.error('Failed to save user information!');
      return;
    }

    toast('Saved user information!');
  }, [isConnected, walletAddress, name, github, discord, avatar]);


  useEffect(() => {
    async function fetchUser() {
      if (!isConnected) {
        setName('');
        setGitHub('');
        setDiscord('');
        setAvatar(null);
      } else {
        const user = await getUser(walletAddress);
        setName(user.name);
        setGitHub(user.github);
        setDiscord(user.discord);
        setAvatar(user.img);
      }
    }
    fetchUser();
  }, [isConnected, walletAddress]);

  return (
    <Reveal keyframes={fadeInUp} className='onStep' delay={400} duration={1000} triggerOnce>
      {
        isConnected ?
          (<div className='app-card h-auto'>
            <div className='w-3/3 md:w-full xl:h-fit'>
              <div className='row pl-[20px]'>
                <div className='flex'>
                  <div className='relative flex items-center justify-center'>
                    <img id='image' name='image' alt='' className='w-[128px] h-[128px] rounded-full' 
                      src={ avatar || '/images/banner/unknown.png' } />
                    <div className='absolute right-0 bottom-0 w-[30px] h-[30px] flex bg-[#011829] flex justify-center items-center rounded-full cursor-pointer'>
                      <i className='fa fa-pencil' />
                    </div>
                    <button
                      className='absolute right-0 bottom-0 w-[30px] h-[30px] opacity-0'
                      onClick={handleClickOpen}
                    />
                  </div>
                </div>
                <div className='w-full pb-3'>
                  <div className='input-form-control'>
                    <label className='input-label'>Name</label>
                    <div className='input-control'>
                      <input type='text' id='name' name='name' value={name} className='input-main' onChange={handleName}></input>
                    </div>
                  </div>
                </div>
                <div className='w-full pb-3'>
                  <div className='input-form-control'>
                    <label className='input-label'>GitHub Profile</label>
                    <div className='input-control'>
                      <input type='text' id='gitHub' name='gitHub' value={github} className='input-main' onChange={handleGitHub}></input>
                    </div>
                  </div>
                </div>
                <div className='w-full pb-3'>
                  <div className='input-form-control'>
                    <label className='input-label'>Discord#</label>
                    <div className='input-control'>
                      <input type='text' id='discord' name='discord' value={discord} className='input-main' onChange={handleDiscord}></input>
                    </div>
                  </div>
                </div>
                <div className='md:w-2/3 pb-3 w-1/3'>
                  <div className='input-form-control'>
                    <div className='input-control border-0 '>
                      <button type='submit' className='input-main btn-hover text-white text-[]' onClick={handleSave}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Dialog open={open} onClose={handleClose}
              PaperProps={{
                style: {
                  background: 'linear-gradient(to bottom right, rgb(0, 65, 104), rgb(0, 65, 104))',
                  boxShadow: 'none',
                },
              }}>
              <DialogTitle>Select your image</DialogTitle>
              <DialogContent>
                <div className='flex w-full pb-3 gap-2'>
                  <AvatarCrop
                    width={300}
                    height={250}
                    exportSize={200}
                    onCrop={onAvatarCrop}
                    onClose={onAvatarClose} />
                  <img
                    alt=''
                    style={{ width: '120px', height: '120px' }}
                    className='rounded-full'
                    src={preview || '/images/banner/unknown.png'}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleOk} className='text-white'>Ok</Button>
                <Button onClick={handleClose} className='text-white'>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)
          :
          (<WarningMsg msg='You need to connect your wallet in order to save settings.' />)
      }
    </Reveal>
  );
}

const Settings = () => {

  return (
    <div className='full-container'>
      <div className='container'>
        <MainHeader />
        <Sidebar path='Settings' />
        <div className='app-container '>
          <div className='app-header md:items-start sm:flex-col'>
            <Subheader path='Settings' />
            <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
              <div className='app-title'>
                <p className='text-[40px] sm:text-center text-white'>Settings</p>
              </div>
            </Reveal>
          </div>
          <div className='app-content'>
            {IsSmMobile() ? (
              <SettingsBody />
            ) : (
              <Scrollbars id='body-scroll-bar' style={{ height: '100%' }}
                renderThumbVertical={({ style, ...props }) =>
                  <div {...props} className={'thumb-horizontal'} />
                }>
                <SettingsBody />
              </Scrollbars>
            )}
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  );
}

export default Settings;
