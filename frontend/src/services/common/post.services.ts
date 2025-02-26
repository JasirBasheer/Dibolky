import api from "@/utils/axios";

export const savePlatformTokenApi = async( 
    platform:string,
    provider:string,
    user_id:string,
    token:string
) => {
    console.log('platform', platform , 'provider', provider, 'user_id', user_id, 'token', token)
    return await api.post(
        `/api/entities/save-platform-token/${platform}/${provider}/${user_id}`,
        { token }
      );
}