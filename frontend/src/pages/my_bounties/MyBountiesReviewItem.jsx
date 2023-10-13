import { useCallback, useState, useEffect } from 'react';
import { Reveal } from 'react-awesome-reveal';
import { toast } from 'react-toastify';
import { useNavigate } from '@reach/router';
import { useCustomWallet } from '../../contexts/WalletContext';
import { useContract } from '../../contexts/ContractContext';
import useBackend from '../../hooks/useBackend';
import { fadeInUp, shortenAddress } from '../../utils';

const MyBountiesReviewItem = ({work}) => {
  const { isConnected, walletAddress } = useCustomWallet();
  const { approveWork, rejectWork } = useContract();
  const { approveWorkB, rejectWorkB } = useBackend();
  const nav = useNavigate();
  const [isExpanded, setExpanded] = useState(false);
  
  const handleExpanded = useCallback(() => {
    setExpanded(isExpanded => !isExpanded);
  }, []);

  const onClickApprove = useCallback(async (event) => {
    if (!isConnected) {
      toast.warning('Wallet not connected yet!');
      return;
    }

    const res1 = await approveWork(walletAddress, work?.workId);
    if (res1) {
      toast.error('Failed to approve work!');
      return;
    }

    const res2 = await approveWorkB(walletAddress, work?.workId);
    if (res2) {
      toast.error('Failed to approve work!');
      return;
    }

    toast('Successfully approved work!');

    nav('/MyBounties/');
  }, [isConnected, walletAddress, work]);

  const onClickReject = useCallback(async (event) => {
    if (!isConnected) {
      toast.warning('Wallet not connected yet!');
      return;
    }

    const res1 = await rejectWork(walletAddress, work?.workId);
    if (res1) {
      toast.error('Failed to reject work!');
      return;
    }

    const res2 = await rejectWorkB(walletAddress, work?.workId);
    if (res2) {
      toast.error('Failed to reject work!');
      return;
    }

    toast('Successfully rejected work!');

    nav('/MyBounties/');
  }, [isConnected, walletAddress, work]);

  return (
    <div className='app-body review-item'>
      {/* <Reveal keyframes={fadeInUp} className='onStep' delay={400} duration={1000} triggerOnce> */}
      <div className='flex justify-between items-center xsm:flex-col sm:text-center'>
        <div className='flex flex-col'>
          <div className='text-[16px] font-bold'>{shortenAddress(work?.participant.wallet)} ({work?.participant.name})</div>
        </div>
        <div className='space-x-2'>
          <button className='flex-col justify-around space-x-2  sm:flex-col sm:text-center btn-hover border rounded-2xl px-4' onClick={handleExpanded}>
            Review
          </button>
        </div>
      </div>
      {isExpanded &&
        <div className='flex-col'>
          <div className='py-2 app-gray'>{work?.title}</div>
          <div className='py-2 app-gray '>{work?.description}</div>
          <a className='py-2 app-gray ' href='#'>{work?.gitHub}</a>
          <div className='flex justify-end gap-2'>
            <button className='rounded-2xl border px-2 py-1' onClick={onClickApprove}>Approve</button>
            <button className='rounded-2xl border px-2 py-1' onClick={onClickReject}>Reject</button>
          </div>
        </div>
      }
      {/* </Reveal> */}
    </div>
  );
}

export default MyBountiesReviewItem;
