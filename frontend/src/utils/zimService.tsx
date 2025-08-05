// CORE-SDK
import AgoraUIKit from 'agora-react-uikit';

const Agora = () => { 
  const rtcProps = {
    appId: 'e7f6e9aeecf14b2ba10e3f40be9f56e7', 
    channel: 'test', 
    token: null, // enter your channel token as a string 
  }; 
  return (
    <AgoraUIKit rtcProps={rtcProps} /> 
  ) 
};

export default Agora; 

// 477e713fbd1d4e43ace7a34ea6c758b7
// appkey = 611379949#1585054
// orgname = 611379949
// appname = 1585054

// websoketaddress = msync-api-61.chat.agora.io
// a61.chat.agora.io

// certificate 3e389197971c427e83b86ad3f7894036