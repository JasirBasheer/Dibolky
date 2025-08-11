import SocialConnectCard from "./socialConnectCard";


type SocialIntegrationsContentProps = {
  handleConnectSocials: (url: string, platform: string) => void;
  connections:{is_valid:boolean,platform:string, connectedAt:Date}[],
  required: string[];
  isConnectionLoading: boolean
};

export const SocialIntegrationsContent = ({
  handleConnectSocials,
  connections,
  required,
  isConnectionLoading
}: SocialIntegrationsContentProps) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Platforms</h3>
      </div>

         <SocialConnectCard
        platform="instagram"
        displayName="Instagram"
        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png"
        connections={connections}
        required={required}
        isLoading={isConnectionLoading}
        onConnect={(platform) =>
          handleConnectSocials(`/api/entities/connect/${platform}`, platform)
        }
        onDisconnect={()=>{console.log("disconnected")}}
      />
        <SocialConnectCard
        platform="facebook"
        displayName="FaceBook"
        icon="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
        connections={connections}
        required={required}
        isLoading={isConnectionLoading}
        onConnect={(platform) =>
          handleConnectSocials(`/api/entities/connect/${platform}`, platform)
        }
        onDisconnect={()=>{console.log("disconnected")}}
      />

       <SocialConnectCard
        platform="linkedin"
        displayName="Linked In"
        icon="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
        connections={connections}
        required={required}
        isLoading={isConnectionLoading}
        onConnect={(platform) =>
          handleConnectSocials(`/api/entities/connect/${platform}`, platform)
        }
        onDisconnect={()=>{console.log("disconnected")}}
      />

        <SocialConnectCard
        platform="x"
        displayName="X"
        icon="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?t=st=1741153885~exp=1741157485~hmac=b159ae34d29580cfef086c305907d1ae7952b8b6ba01d3b7196d5f9bc1b12e89&w=900"
        connections={connections}
        required={required}
        isLoading={isConnectionLoading}
        onConnect={(platform) =>
          handleConnectSocials(`/api/entities/connect/${platform}`, platform)
        }
        onDisconnect={()=>{console.log("disconnected")}}
      />

    </div>
  );