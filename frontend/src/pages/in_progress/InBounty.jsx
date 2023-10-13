import { useState, useEffect } from 'react';
import { Reveal } from 'react-awesome-reveal';
import { useNavigate } from '@reach/router';

import useBackend from '../../hooks/useBackend';
import { numberWithCommas, fadeInUp, 
  shortenAddress, getBountyStatus, getType, getLevel, getTopic, getTimeDifference } from '../../utils';

const InBounty = ({bountyId}) => {
  const { getSingleBounty } = useBackend();
  const [bounty, setBounty] = useState({});

  useEffect(() => {
    async function fetchBounty() {
      if (!bountyId) return;

      const singleBounty = await getSingleBounty(bountyId);
      setBounty(singleBounty);
    }

    fetchBounty();
  }, [bountyId]);

  const nav = useNavigate();

  return (
    <div className='app-body'>
      <Reveal keyframes={fadeInUp} className='onStep' delay={400} duration={1000} triggerOnce>
        <div className='row'>
          <div className='w-full lg:pl-0 mt-[20px] pr-0'>
            <div className='app-card cursor-pointer' onClick={() => nav('/InProgress/' + bounty?.bountyId)}>
              <div className='app-card-header text-left'>
                <div className='flex justify-between xsm:text-[10px] sm:text-center items-center'>
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center'>
                      <img className='h-[30px] logo' src='/images/banner/user.png' alt='' />
                      <span className='app-gray text-[20px] xsm:text-[10px]'>{shortenAddress(bounty?.creator?.wallet)}</span>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <div className='flex flex-row space-x-2  items-center'>
                      <div className='flex-col app-gray justify-around xsm:flex-col xsm:text-center border rounded-2xl px-2'> {`${numberWithCommas(1000, 3)} XLM`}</div>
                      <div className='flex-col app-gray justify-around xsm:flex-col xsm:text-center border rounded-2xl px-2'>{getBountyStatus(bounty?.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='app-card-body'>
                <div className='row text-left'>
                  <div className='text-[32px]' to='/ExploreBounties/0'>{bounty?.title}</div>
                  <p className='text-[17px] sm:text-[15px] description'>{bounty?.description}</p>
                </div>
              </div>
              <div className='app-card-footer'>
                <div className='flex justify-between sm:text-[10px] sm:text-center'>
                  <div className='flex flex-col'>
                    <span className='app-gray text-[14px]'>{getTimeDifference(bounty?.startDate)} ago</span>
                  </div>
                  <div className='flex flex-col'>
                    <div className='flex flex-row space-x-2  items-center'>
                      <div className='flex-col app-gray justify-around space-x-2 sm:flex-col sm:text-center border rounded-2xl px-2'>{getType(bounty?.type)}</div>
                      <div className='flex-col app-gray justify-around space-x-2 sm:flex-col sm:text-center border rounded-2xl px-2'>{getLevel(bounty?.difficulty)}</div>
                      <div className='flex-col app-gray justify-around space-x-2 sm:flex-col sm:text-center border rounded-2xl px-2'>{getTopic(bounty?.topic)}</div>
                    </div>
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

export default InBounty;
