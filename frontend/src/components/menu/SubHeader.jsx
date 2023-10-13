import React, { useState } from 'react';
import { Link } from '@reach/router';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import Popover from '@mui/material/Popover';
import Avatar from '../Avatar';
import ConnectWallet from './ConnectWallet';

const SubHeader = ({ path }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='sub-header hidden lg:block'>
      <button className='app-nav-icon' onClick={handleClick}>
        <div className='menu-line white'></div>
        <div className='menu-line1 white'></div>
        <div className='menu-line2 white'></div>
      </button>
      <BreakpointProvider>
        <Breakpoint l down>
          <Popover
            id={id}
            className='subheader-popover z-10'
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
            <div className='flex flex-col items-center gap-3' onClick={handleClose}>
              <Avatar hide={path === 'Settings'} />
              <ConnectWallet />
            </div>

            {/* </Link> */}
            <div className={path === 'NewBounty' ? 'navbar-item menu-active-item' : 'navbar-item'}>
              <Link to='/NewBounty'>
                <div className='flex gap-2 items-center'>
                  <span>New Bounty</span>
                </div>
              </Link>
            </div>
            <div className={path === 'ExploreBounties' ? 'navbar-item menu-active-item' : 'navbar-item'}>
              <Link to='/ExploreBounties'>
                <div className='flex gap-2 items-center'>
                  <span>Explore Bounties</span>
                </div>
              </Link>
            </div>

            <div className={path === 'InProgress' ? 'navbar-item menu-active-item' : 'navbar-item'}>
              <Link to='/InProgress'>
                <div className='flex gap-2 items-center'>
                  <span>In Progress</span>
                </div>
              </Link>
            </div>

            <div className={path === 'MyBounties' ? 'navbar-item menu-active-item' : 'navbar-item'}>
              <Link to='/MyBounties'>
                <div className='flex gap-2 items-center'>
                  <span>My Bounties</span>
                </div>
              </Link>
            </div>

            <div className={path === 'Settings' ? 'navbar-item menu-active-item' : 'navbar-item'}>
              <Link to='/Settings'>
                <div className='flex gap-2 items-center'>
                  <span>Settings</span>
                </div>
              </Link>
            </div>
          </Popover>
        </Breakpoint>
      </BreakpointProvider>
    </div>
  );
}

export default SubHeader;
