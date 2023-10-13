import React from 'react';
import Reveal from 'react-awesome-reveal';
import { Link } from '@reach/router';
import SubHeader from '../menu/SubHeader';
import ColorGroup from './ColorGroup';
import { fadeInUp, fadeIn } from '../../utils';

const BannerBody = () => (
    <div className='relative z-1'>
        <div className='row items-center py-[64px]'>
            <div className='col-md-6 bg-[#0000005c] p-5 rounded-3xl'>
                <ColorGroup />
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                    <h3 className='text-[64px] md:text-[50px] md:text-center font-semibold text-white'><span className='text-white'>Find Bounties, Reap Rewards
                    </span></h3>
                </Reveal>
                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                    <h1 className='text-[20px] md:text-[16px] md:text-center gray mt-3'>Maximize your potential with Stellar Soroban in the world of bounties.</h1>
                </Reveal>
                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
          <div className='mainside mt-4 flex sm:justify-center'>
                        <Link to='/ExploreBounties'>Explore</Link>
                    </div>
                </Reveal>
                <div className='mb-sm-30'></div>
            </div>
        </div>
        <div className='container relative z-1 border-solid border-2 rounded-3xl bg-[#0000005c] p-5'>
            <div className='row'>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-3'>
                    <div className='feature-box f-boxed style-3 flex flex-col md:items-center'>
                        <img className='i-boxed w-[24px] h-[24px]' src='/images/icons/add.png' alt=''></img>
                        <h4 className='font-bold text-2xl mt-2 md:justify-center'>Create Bounties</h4>
                        <p className='mt-2'>Kickstart your project by offering bounties.</p>
                        <i className='wm icon_wallet'></i>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-3'>
                    <div className='feature-box f-boxed style-3 flex flex-col md:items-center'>
                        <img className='i-boxed w-[24px] h-[24px]' src='/images/icons/participate.png' alt=''></img>
                        <h4 className='font-bold text-2xl mt-2 md:justify-center'>Participate</h4>
                        <p className='mt-2'>Join the community and cooperate.</p>
                        <i className='wm icon_wallet'></i>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-3'>
                    <div className='feature-box f-boxed style-3 flex flex-col md:items-center'>
                        <img className='i-boxed w-[24px] h-[24px]' src='/images/icons/build.png' alt=''></img>
                        <h4 className='font-bold text-2xl mt-2 md:justify-center'>Build</h4>
                        <p className='mt-2'>Complete tasks and contribute to web3 projects.</p>
                        <i className='wm icon_wallet'></i>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-3'>
                    <div className='feature-box f-boxed style-3 flex flex-col md:items-center'>
                        <img className='i-boxed w-[24px] h-[24px]' src='/images/icons/add.png' alt=''></img>
                        <h4 className='font-bold text-2xl mt-2 md:justify-center'>Earn</h4>
                        <p className='mt-2'>Get rewarded in crypto for your valuable contributions.</p>
                        <i className='wm icon_wallet'></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Banner = () => {
    return (
        <div className='relative h-full'>
            <div className='relative container h-full mt-[12px]'>
                <SubHeader/>
                <div className='fixed bottom-0 right-[20px]'>
                    {/* <Reveal className='onStep' keyframes={fadeIn} delay={900} duration={1500} triggerOnce> */}
                    <img className='md:h-[300px] h-[600px] logo' src='/images/banner/bot.png' alt='' />
                    {/* </Reveal> */}
                </div>
                <div className='banner py-20 h-full'>
                    <BannerBody />
                </div>
                <div className='fixed bottom-0 right-0'>
                    <ColorGroup className='fixed bottom-0 right-0' />
                </div>
            </div>
        </div>
    );
}

export default Banner;
