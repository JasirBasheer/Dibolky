import React from 'react';
import { useSelector } from 'react-redux';
import Chat from '../common.pages/Chat';
import { RootState } from '@/types/common.types';


const ClientMessages: React.FC = () => {
  const client = useSelector((state: RootState) => state.user);
  console.log(client);
  
  if (!client?.user_id || !client?.orgId) {
    return <div>Loading...</div>;
  }

  return <Chat user={client} ownerId={client.ownerId} isAdmin={false} />;
};

export default ClientMessages;