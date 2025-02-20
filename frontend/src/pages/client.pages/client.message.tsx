import React from 'react';
import { useSelector } from 'react-redux';
import Chat from '../common.pages/Chat';

interface ClientState {
  client: {
    id: string;
    orgId: string;
    name: string;
  };
}

const ClientMessages: React.FC = () => {
  const client = useSelector((state: ClientState) => state.client);
  console.log(client);
  
  if (!client?.id || !client?.orgId) {
    return <div>Loading...</div>;
  }

  return <Chat user={client} ownerId={client.id} isAdmin={false} />;
};

export default ClientMessages;