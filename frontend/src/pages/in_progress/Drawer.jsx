import React from 'react';
import PropTypes from 'prop-types';
import classes from './Drawer.module.scss';

const changeAnchor = (anchor, classes) => {
  switch (anchor) {
    case 'left':
      return classes.drawerLeft;
    case 'right':
      return classes.drawerRight;
    default:
      return classes.drawerRight;
  }
}

export const Drawer = (props) => {

  const { open, anchor, onClose, children } = props;
  const {
    drawer,
    drawAnimate,
    drawerHidden,
    drawerOverlay,
    drawerOverlayOpen,
    drawerOverlayHidden,
  } = classes;

  return (
    <>
      <div
        tabIndex='-1'
        className={`${drawer} ${open && drawAnimate} ${!open && drawerHidden
          } ${changeAnchor(anchor, classes)}`}
      >
        <div className='drawer-container relative'>
          {children}
        </div>
      </div>
      <div
        className={`${drawerOverlay} ${!open && drawerOverlayHidden} ${open && drawerOverlayOpen
          }`}
        onClick={onClose}
        aria-hidden='true'
      />
    </>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  anchor: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}
