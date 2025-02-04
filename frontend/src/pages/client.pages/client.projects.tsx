import { ArrowUpRight } from 'lucide-react'
import React from 'react'

const ClientProjects = () => {
    return (
        <div className='p-5'>
            <div className="">
                <h1>Project</h1>
            </div>
            <div className=" flex flex-wrap items-center sm:justify-start justify-center gap-4 ">
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="md:w-[17.9rem] min-h-[7rem] rounded-xl outline-1 outline-double outline-[#45444424] bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
                        <div className="flex justify-between">
                            <p className='font-cantarell text-gray-400'>Account Reach</p>
                            <ArrowUpRight className='w-4 text-green-600' />
                        </div>
                        <p className='text-2xl my-2 font-cantarell font-semibold'>24</p>
                        <p className='font-cantarell text-gray-400'>+2 this week</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClientProjects