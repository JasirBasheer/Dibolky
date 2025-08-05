import SocialConnectCard from "./socialConnectCard";


type LeadIntegrationsContentProps = {
  handleConnectSocailMedia: (url: string, platform: string) => void;
  connections: { is_valid: boolean; platform: string; connectedAt: Date }[];
  required: string[];
  isConnectionLoading: boolean;
};

const LeadIntegrationsContent = ({
  handleConnectSocailMedia,
  connections,
  required,
  isConnectionLoading,
}: LeadIntegrationsContentProps) => {
  return (
   <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Platforms</h3>
      </div>
      <SocialConnectCard
      platform="googleads"
      displayName="Google Ads"
      icon="https://www.google.com/images/branding/product/2x/ads_64dp.png"
      connections={connections}
      required={required}
      isLoading={isConnectionLoading}
      onConnect={(platform) =>
        handleConnectSocailMedia(`/api/entities/connect/${platform}`, platform)
      }
      onDisconnect={() => {
        console.log("disconnected");
      }}
    />

     <SocialConnectCard
      platform="facebookads"
      displayName="Facebook Ads"
      icon="https://www.citypng.com/public/uploads/preview/facebook-meta-logo-icon-hd-png-701751694777703xqxtpvbu9q.png"
      connections={connections}
      required={required}
      isLoading={isConnectionLoading}
      onConnect={(platform) =>
        handleConnectSocailMedia(`/api/entities/connect/${platform}`, platform)
      }
      onDisconnect={() => {
        console.log("disconnected");
      }}
    />


    </div>
  )
}

export default LeadIntegrationsContent

