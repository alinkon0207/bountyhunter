import React from 'react';
import { Link } from '@reach/router';

const BackButton = ({ to, state }) => {
  return (
    <Link to={to} state={state} className='text-xl'><i className='fa fa-angle-left' />Back</Link>
  );
}

export default BackButton;
