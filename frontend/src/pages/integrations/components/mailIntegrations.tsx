import SocialConnectCard from "./socialConnectCard";

type MailIntegrationsContentProps = {
  handleConnectSocailMedia: (url: string, platform: string) => void;
  connections: { is_valid: boolean; platform: string; connectedAt: Date }[];
  required: string[];
  isConnectionLoading: boolean;
};

export const MailIntegrationsContent = ({
  handleConnectSocailMedia,
  connections,
  required,
  isConnectionLoading,
}: MailIntegrationsContentProps) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Platforms</h3>
    </div>
    <SocialConnectCard
      platform="gmail"
      displayName="Google Mail"
      icon="https://images.icon-icons.com/2631/PNG/512/gmail_new_logo_icon_159149.png"
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
      platform="outlook"
      displayName="Outlook"
      icon="https://toppng.com/uploads/preview/outlook-logo-png-1764x1490-117357613016jetuonqfr.webp"
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
);
