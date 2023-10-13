import { getBountyStatus } from '../utils'

export const ListingDescription = ({bounty}) => {
  return (
    <>
      <div className='flex justify-between xsm:text-[10px] sm:items-center sm:gap-3 py-2'>
        <div className='flex flex-col'>
          <button className='text-[18px] border rounded-2xl px-4'>{getBountyStatus(bounty?.status)}</button>
        </div>
        <div className='flex gap-1'>
          <button className='text-[18px]'><i className='fa-regular fa-arrow-up-from-square mr-2'></i>Share</button>
        </div>
      </div>
      <span className='pt-2 mb-6 description' dangerouslySetInnerHTML={{
        __html:bounty&&bounty.description?bounty.description.replace(new RegExp('\r?\n','g'), '<br />'):''}}
        ></span></>
  )
}
