import { useEffect } from 'react';
import { Router, Location, Redirect } from '@reach/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import ScrollToTopBtn from './components/menu/ScrollToTop';
import HomePage from './pages/home';
import NewBounty from './pages/new_bounty/';
import PreviewNewBounty from './pages/new_bounty/PreviewNewBounty';
import ExploreBounty from './pages/explore_bounties/';
import ExBountyListing from './pages/explore_bounties/ExBountyListing';
import InProgress from './pages/in_progress/';
import InBountyListing from './pages/in_progress/InBountyListing';
import MyBounties from './pages/my_bounties/';
import MyBountiesListing from './pages/my_bounties/MyBountiesListing';
import Settings from './pages/settings/';

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'> 
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

export const ScrollTop = ({ children, location }) => {
  useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
}

export default function App() {
  return (
    <div className='app'>
      <PosedRouter>
        <ScrollTop path='/'>
          <HomePage exact path='/'>
            <Redirect to='/' />
          </HomePage>
          <NewBounty path='NewBounty' />
          <PreviewNewBounty path='NewBounty/Preview' />
          <ExploreBounty path='ExploreBounties' />
          <ExBountyListing path='ExploreBounties/:id' />
          <InProgress path='InProgress' />
          <InBountyListing path='InProgress/:id' />
          <MyBounties path='MyBounties' />
          <MyBountiesListing path='MyBounties/:id' />
          <Settings path='Settings' />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
