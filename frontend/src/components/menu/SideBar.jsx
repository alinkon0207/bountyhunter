import { useEffect } from 'react';
import { Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import Avatar from '../Avatar';
import ConnectWallet from './ConnectWallet';

const GlobalStyles = createGlobalStyle`
  .social-icons span {
    text-shadow: none;
    color: #fff !important;
    padding: 5px 10px 8px;
    text-align: center;
    font-size: 22px;
    border-radius: 5px;
    margin: 16px;
  }

  .menu-text {
    font-family: 'Poppins';
    font-weight: 400;
    font-size: 16px;
    @media only screen and (max-width: 768px) {
      margin-left: 8px !important;
    }
  }
`;

const Sidebar = ({ path }) => {

  useEffect(() => {
  }, [path]);

  return (
    <>
      <GlobalStyles />
      <div className='my-navbar'>
        <div className='navbar-content z-50'>
          <div className='logo-img flex flex-col space-y-2 items-center pt-3 pb-4'>
            {/* <Link className='cursor-pointer' to='/'> */}
            <Avatar hide={path === 'Settings'} />
            {/* </Link> */}
            <ConnectWallet />
          </div>

          <nav className='pb-4'>
            <>
              <Link
                to='/NewBounty'
                className={`menu-item ${path === 'NewBounty'
                  ? 'menu-active-item block transition duration-200  text-white'
                  : 'block transition duration-200  app-gray hover:text-white'
                  }`}
              >
                <div className='flex space-x-6 align-items-center'>
                  <div className='menu-text text-lg'>New Bounty</div>
                </div>
              </Link>
              <Link
                to='/ExploreBounties'
                className={`menu-item ${path === 'ExploreBounties'
                  ? 'menu-active-item block transition duration-200  text-white'
                  : 'block transition duration-200  app-gray hover:text-white'
                  }`}
              >
                <div className='flex space-x-6 align-items-center'>
                  <div className='menu-text text-lg'>Explore Bounties</div>
                </div>
              </Link>
              <Link
                to='/InProgress'
                className={`menu-item ${path === 'InProgress'
                  ? 'menu-active-item block transition duration-200  text-white'
                  : 'block transition duration-200  app-gray hover:text-white'
                  }`}
              >
                <div className='flex space-x-6 align-items-center'>
                  <div className='menu-text text-lg'>In Progress</div>
                </div>
              </Link>
              <Link
                to='/MyBounties'
                className={`menu-item ${path === 'MyBounties'
                  ? 'menu-active-item block transition duration-200  text-white'
                  : 'block transition duration-200  app-gray hover:text-white'
                  }`}
              >
                <div className='flex space-x-6 align-items-center'>
                  <div className='menu-text text-lg'>My Bounties</div>
                </div>
              </Link>
              <Link
                to='/Settings'
                className={`menu-item ${path === 'Settings'
                  ? 'menu-active-item block transition duration-200  text-white'
                  : 'block transition duration-200  app-gray hover:text-white'
                  }`}
              >
                <div className='flex space-x-6 align-items-center'>
                  <div className='menu-text text-lg'>Settings</div>
                </div>
              </Link>
            </>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
