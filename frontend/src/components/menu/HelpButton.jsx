import React from 'react';

const HelpButton = () => {
  return (
    <div className='my-help-btn cursor-pointer z-30'>
      <i className='fa fa-question-circle' aria-hidden='true'></i>
      <div className='text-[16px]'>Help</div>
    </div>
  );
}

export default HelpButton;
