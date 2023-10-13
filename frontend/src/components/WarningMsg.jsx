import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const WarningMsg = ({ msg }) => {
  return (
    <Reveal keyframes={fadeInUp} className='onStep' delay={200} duration={400} triggerOnce>
      <div className='app-header py-2 px-0'>
        <div className='app-card w-full bg-[#0092DC] py-4'>
          <div className='flex gap-3'>
            <span className='text-xl'><i className='fa fa-exclamation-circle'></i></span>
            <div className='flex flex-col'>
              <div><p className='text-[17px] sm:text-[15px]'>{msg}</p></div>
              <div><a className='font-bold' href='#'>Learn More</a></div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default WarningMsg;
