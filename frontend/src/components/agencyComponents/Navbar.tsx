import { AlignLeft, Bell, X } from 'lucide-react'
import React from 'react'
type NavbarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};



const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className='grid grid-cols-12  min-h-[4.5rem]'>
        <div className="col-span-2 bg-white flex items-center justify-start pl-9 text-blue-600 text-2xl font-bold ">Dibolky</div>
        <div className="lg:col-span-7 col-span-7"></div>
        <div className="lg:col-span-3 flex items-center lg:pl-12 gap-7">
            <div className="lg:flex hidden">
                Permit room
            </div>
            <Bell className='ml-16'/>
            <div className="bg-black w-[2rem] h-8 rounded-full"></div>
        </div>
        <div className="lg:hidden col-span-2 flex items-center">
        {isOpen ? (<X onClick={() => setIsOpen(prev => !prev)} />) :(<AlignLeft onClick={() => setIsOpen(prev => !prev)}/>)}
        </div>

    </div>
  )
}

export default Navbar