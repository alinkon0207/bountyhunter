import React, { Component } from 'react';

export default class ScrollToTop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_visible: false
    };
  }

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener('scroll', function (e) {
      scrollComponent.toggleVisibility();
    });
  }

  toggleVisibility() {
    if (window.scrollY > 250) {
      this.setState({
        is_visible: true
      });
    } else {
      this.setState({
        is_visible: false
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  render() {
    const { is_visible } = this.state;
    return (
      <div id='scroll-to-top' className='init'>
        {is_visible && (
          <div onClick={() => this.scrollToTop()}>
            {/* <ScrollAnim /> */}
            <i className='fa-solid fa-arrow-up text-white'></i>
          </div>
        )}
      </div>
    );
  }
}
