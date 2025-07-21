import React from 'react';
import { useSelector } from 'react-redux';
import Chat from '../common/Chat';
import { RootState } from '@/types/common';


const AgencyMessages: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return <Chat user={user} isAdmin={true} />;
};

export default AgencyMessages;