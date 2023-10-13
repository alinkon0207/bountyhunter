import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Reveal } from 'react-awesome-reveal';
import { fadeIn } from '../../utils';

const SearchBox = forwardRef(function SearchBox(props, ref) {

  const [keyword, setKeyword] = useState('');

  const [isSearchShow, setSearchShow] = useState(false);

  const [isClosed, setClosed] = useState(true);
  const [isActive, setActive] = useState(true);

  const [isCompe, setComp] = useState(true);
  const [isCoop, setCoop] = useState(true);
  const [isHack, setHack] = useState(true);

  const [isBegin, setBegin] = useState(true);
  const [isInter, setInter] = useState(true);
  const [isAdvan, setAdvan] = useState(true);

  const [isDesig, setDesig] = useState(true);
  const [isDevel, setDevel] = useState(true);
  const [isSmtCt, setSmtCt] = useState(true);
  const [isData, setData] = useState(true);
  const [isAI, setAI] = useState(true);

  const handleSearchShow = useCallback(() => {
    setSearchShow(isSearchShow => !isSearchShow);
    props.callback && props.callback();
    props.onSearchChange && props.onSearchChange();
  }, []);

  const handleKeyword = useCallback((event) => {
    setKeyword(event.target.value);
    props.onSearchChange && props.onSearchChange();
  }, []);

  const handleClosed = useCallback(() => {
    setClosed(isClosed => !isClosed);
  }, []);
  const handleActive = useCallback(() => {
    setActive(isActive => !isActive);
  }, []);

  const handleComp = useCallback(() => {
    setComp(isCompe => !isCompe);
  }, []);
  const handleCoop = useCallback(() => {
    setCoop(isCoop => !isCoop);
  }, []);
  const handleHack = useCallback(() => {
    setHack(isHack => !isHack);
  }, []);

  const handleBegin = useCallback(() => {
    setBegin(isBegin => !isBegin);
  }, []);
  const handleInter = useCallback(() => {
    setInter(isInter => !isInter);
  }, []);
  const handleAdvan = useCallback(() => {
    setAdvan(isAdvan => !isAdvan);
  }, []);

  const handleDesig = useCallback(() => {
    setDesig(isDesig => !isDesig);
  }, []);
  const handleDevel = useCallback(() => {
    setDevel(isDevel => !isDevel);
  }, []);
  const handleSmtCt = useCallback(() => {
    setSmtCt(isSmtCt => !isSmtCt);
  }, []);
  const handleData = useCallback(() => {
    setData(isData => !isData);
  }, []);
  const handleAI = useCallback(() => {
    setAI(isAI => !isAI);
  }, []);

  function statusFilter(status) {
    switch (status) {
      case 1:
        return isActive
    }
    return true;
  }

  function typeFilter(type) {
    switch (type) {
      case 1:
        return isCompe;
      case 2:
        return isCoop;
      case 3:
        return isHack;
    }
    return true;
  }

  function diffFilter(diff) {
    switch (diff) {
      case 1:
        return isBegin;
      case 2:
        return isInter;
      case 3:
        return isAdvan;
    }
    return true;
  }

  function topicFilter(topic) {
    switch (topic) {
      case 1:
        return isDesig;
      case 2:
        return isDevel;
      case 3:
        return isSmtCt;
      case 4:
        return isData;
      case 5:
        return isAI;
    }
    return true;
  }

  useImperativeHandle(ref, () => {
    return {
      getKeyword() {
        return keyword;
      },
      filter(bounty) {
        // console.log('-------SearchBox-------', bounty);
        if (!bounty.title.toLowerCase().includes(keyword))
          return false;
        if (!bounty.description.toLowerCase().includes(keyword))
          return false;
        if (!statusFilter(bounty.status) ||
          !typeFilter(bounty.type) ||
          !diffFilter(bounty.difficulty) ||
          !topicFilter(bounty.topic)) return false;
        return true;
      }
    }
  });

  return (
    <Reveal keyframes={fadeIn} className='onStep' delay={0} duration={1000} triggerOnce>
      <div className='flex gap-4 items-center'>
        <div className='input-form-control relative z-50'>
          <div className={`input-control rounded-3xl h-[60px] ${isSearchShow ? 'invisible' : ''}`}>
            <i className='fa input-prefix fa-search'></i>
            <input type='text' value={keyword} onChange={handleKeyword} className='input-main mx-3' placeholder='Search'></input>
            <button className='input-suffix flex items-center gap-2 border-l-1' onClick={handleSearchShow}>
              Filter<i className='fa fa-angle-down' />
            </button>
          </div>
          {
            isSearchShow &&
            <div className='left-0 right-0 top-0 bottom-0 fixed z-0' onClick={handleSearchShow}></div>
          }
          {isSearchShow &&
            <section className='absolute right-0 top-0 left-0 rounded-3xl border-0 bg-[#00263e]'>
              <div className='input-control h-[60px]  border-0'>
                <i className='fa fa-search input-prefix'></i>
                <input type='text' value={keyword} onChange={handleKeyword} className='input-main border-r-1 mx-3' placeholder='Search'></input>
                <button className='input-suffix flex items-center gap-2 border-l-1' onClick={handleSearchShow}>
                  <i className='fa fa-angle-up' />
                </button>
              </div>
              <div className='flex flex-col gap-2 p-4'>
                <div className='font-bold'>Status</div>
                <div className='flex gap-4 '>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleClosed} checked={isClosed} className=''></input><label>Closed</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleActive} checked={isActive} className=''></input><label>Active</label></div>
                </div>
                <div className='font-bold'>Type</div>
                <div className='flex gap-4'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleComp} checked={isCompe} className=''></input><label>Competitive</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleCoop} checked={isCoop} className=''></input><label>Cooperative</label></div>
                </div>
                <div className='font gap-2'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleHack} checked={isHack} className=''></input><label>Hackathon</label></div>
                </div>
                <div className='font-bold'>Difficulty</div>
                <div className='flex gap-4'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleBegin} checked={isBegin} className=''></input><label>Beginner</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleInter} checked={isInter} className=''></input><label>Intermediate</label></div>
                </div>
                <div className='flex gap-4'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleAdvan} checked={isAdvan} className=''></input><label>Advanced</label></div>
                </div>
                <div className='font-bold'>Topic</div>
                <div className='flex gap-4'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleDesig} checked={isDesig} className=''></input><label>Design</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleDevel} checked={isDevel} className=''></input><label>Development</label></div>
                </div>
                <div className='flex gap-4'>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleSmtCt} checked={isSmtCt} className=''></input><label>Smart Contracts</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleData} checked={isData} className=''></input><label>Data</label></div>
                  <div className='flex gap-1 items-center'><input type='checkbox' onChange={handleAI} checked={isAI} className=''></input><label>AI</label></div>
                </div>
              </div>
            </section>}
        </div>
      </div>
    </Reveal>
  );
});

export default SearchBox;
