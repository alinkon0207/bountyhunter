import { useState, useEffect } from 'react';
import { Reveal } from 'react-awesome-reveal';
import { WorkStatus } from '../contexts/ContractContext';
import useBackend from '../hooks/useBackend';
import { fadeInUp, shortenAddress, getWorkStatus, getTimeDifference } from '../utils';

export const Participant = ({ bountyId, submit }) => {
  const { getWorks } = useBackend();
  const [works, setWorks] = useState([]);

  useEffect(() => {
    if (!bountyId)
      return;

    async function fetchWorks(bountyId) {
      const bountyWorks = await getWorks(bountyId);
      setWorks(bountyWorks);
    }

    fetchWorks(bountyId);
  }, [bountyId]);

  return (
    <div>
      <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
        <div className='info-box mt-[40px]'>
          <div className='info-header pl-0'>
            <div className='flex items-center sm:text-center justify-evenly'>
              <div className='flex my-2 text-[24px] font-bold'><span>Participants</span></div>
              <div className='flex my-2 text-[24px] font-bold'><span>Status</span></div>
              <div className='flex my-2 text-[24px] font-bold'><span>Time</span></div>
            </div>
          </div>
          <div className='info-body'>
            <table className='w-full '>
              <tbody>
              {
                works.length ? works.map((work, idx) => (
                  <tr className='text-[16px]' key={idx}>
                    <td width='45%' className='text-center p-2'>{shortenAddress(work?.participant.wallet)} ({work?.participant.name})</td>
                    <td width='25%' className='text-center'>{getWorkStatus(work?.status)}</td>
                    <td width='' className='text-center'>{(work?.status == WorkStatus.SUBMITTED) ? getTimeDifference(work?.submitDate) : getTimeDifference(work?.applyDate)} ago</td>
                  </tr>
                )) : <tr><td className='text-center'>No Participants</td></tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
