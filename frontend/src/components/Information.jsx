import { Reveal } from 'react-awesome-reveal';
import { fadeInUp, shortenAddress, getType, getLevel, getTopic, getBountyStatus, getFormatedDate } from '../utils';

export const Information = ({
    wallet, payAmount, startDate, endDate, type, difficulty, topic, gitHub, block, status
}) => {
    return (
        <div className=''>
            <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
                <div className='info-box pb-3'>
                    <div className='info-header'>
                        <div className='flex my-2 text-[24px] font-bold'><span>Information</span></div>
                    </div>
                    <div className='info-body'>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Published by:</span>
                            <div className='flex items-center justify-center'>
                                <img src={'/images/banner/user.png'} className='h-[20px]' alt='' />
                                <span className='text-[16px] '>{wallet ? shortenAddress(wallet) : ''}</span>
                            </div>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Payment:</span>
                            <span className='text-[16px]'>{payAmount} XLM</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Status</span>
                            <span className='text-[16px]'>{getBountyStatus(status)}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Start Date:</span>
                            <span className='text-[16px] text-right	'>{getFormatedDate(startDate)}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>End Date:</span>
                            <span className='text-[16px] text-right	'>{getFormatedDate(endDate)}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Block</span>
                            <span className='text-[16px]'>{block}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Level:</span>
                            <span className='text-[16px]'>{getLevel(difficulty)}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Topic:</span>
                            <span className='text-[16px] '>{getTopic(topic)}</span>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <span className='text-[16px] font-bold'>Type:</span>
                            <span className='text-[16px]'>{getType(type)}</span>
                        </div>
                        <div className='flex justify-between sm:text-center items-center gap-3'>
                            <span className='text-[18px]'>Repository:</span>
                            <a className='text-[18px]' href={gitHub}><i className='fa-regular fa-arrow-up-right-from-square' /></a>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}
