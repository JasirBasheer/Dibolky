import ClientContentComponent from '@/components/client.components/contents.components/contents'
import React from 'react'

const ClientContent = () => {
  return (
    <div className='w-full p-9'>
        <div className="w-auto min-h-[11rem]">
            <ClientContentComponent/>
        </div>
    </div>
  )
}

export default ClientContent