import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'

const Clients = () => {
    const [clients,setClients] = useState({})

    useEffect(()=>{
        axios.get('/agency/clients')
    },[])
  return (
    <div>
        
    </div>
  )
}

export default Clients