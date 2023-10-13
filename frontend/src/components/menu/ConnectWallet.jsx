import { useCustomWallet } from '../../contexts/WalletContext'
import { shortenAddress } from '../../utils';

const ConnectWallet = () => {
  const { connectWallet, disconnectWallet, isConnected, walletAddress } = useCustomWallet();

  return (
    <div className='connect-wallet'>
      {!isConnected 
        ? (<button className='btn-main2' onClick={connectWallet}>Connect Wallet</button>) 
        : (
            <div className='flex items-center btn-main !px-[20px] !py-[10px]'>
              <img alt='' className='w-5 h-5 text-white mr-2' src={'/images/icons/wallet.png'} />
              <span className='text-[14px]' onClick={disconnectWallet}>
                {shortenAddress(walletAddress)}
              </span>
            </div>
          )
      }
    </div>
  );
}

export default ConnectWallet;
