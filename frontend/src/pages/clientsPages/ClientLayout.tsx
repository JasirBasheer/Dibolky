import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useSearchParams } from 'react-router-dom';

interface SocialMediaConfig {
  name: string;
  buttonText: string;
  connectEndpoint: string;
}

const ClientLayout = () => {
  const [searchParams] = useSearchParams();

  const socialMediaConfigs: Record<string, SocialMediaConfig> = {
    instagram: {
      name: 'instagram',
      buttonText: 'Connect Instagram',
      connectEndpoint: '/api/agency/connect/instagram'
    },
    facebook: {
      name: 'facebook',
      buttonText: 'Connect Facebook',
      connectEndpoint: '/api/agency/connect/facebook'
    },
    x: {
      name: 'x',
      buttonText: 'Connect X',
      connectEndpoint: '/api/agency/connect/x'
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const provider = searchParams.get('provider');

    if (hash && provider) {

      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        console.log('access token ethitt undh')
        handleCallback(token, provider).then(() => {
          console.log('token stored');
          // storing to the redux store
        });
      }
    }
  }, []);

  const handleCallback = async (token: string, provider: string): Promise<any> => {
    try {
      console.log(`Handling callback for ${provider} with token:`, token);
      const response = await axios.post(
        `/api/agency/savePlatFormToken/${provider}/${null}`,
        { token }
      );
      return response;
    } catch (error: any) {
      console.log('Error in handleCallback:', error);
      throw error;
    }
  };

  const handleConnect = async (provider: string): Promise<void> => {
    try {
      const response = await axios.get(socialMediaConfigs[provider].connectEndpoint);
      // Add state parameter with provider information
      const url = new URL(response?.data.url);
      url.searchParams.append('state', `${provider}:${Date.now()}`);
      window.location.href = url.toString();
    } catch (error: any) {
      console.log("Error:", error.response?.data || error.message);
    }
  };



  return (
    <div className="flex gap-4 p-4">
      {Object.entries(socialMediaConfigs).map(([key, config]) => (
        <div
          key={key}
          className="w-[11rem] cursor-pointer h-[3rem] flex items-center justify-center bg-slate-500 text-white rounded hover:bg-slate-600"
          onClick={() => handleConnect(config.name)}
        >
          {config.buttonText}
        </div>
      ))}
    </div>
  );
};

export default ClientLayout;