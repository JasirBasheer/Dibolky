import React from 'react';
import { useSelector } from 'react-redux';
import Chat from '../common.pages/Chat';
import { useQuery } from '@tanstack/react-query';
import { getOwnerId } from '@/services/common/get.services';
import { RootState } from '@/types/common.types';


const AgencyMessages: React.FC = () => {
  const agency = useSelector((state: RootState) => state.agency);

  const { data, isLoading } = useQuery({
    queryKey: ["agency-owner-details"],
    queryFn: () => { 
      return getOwnerId() 
    },
    select: (data) => data?.data?.ownerDetails
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Chat user={agency} ownerId={data?.ownerId} isAdmin={true} />;
};

export default AgencyMessages;