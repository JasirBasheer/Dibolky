import { ExternalLink } from "lucide-react";
import Skeleton from "react-loading-skeleton";

type Props = {
  platform: "instagram" | "facebook" | string;
  displayName: string;
  icon: string;
  connections: { platform: string; is_valid: boolean }[];
  required: string[];
  onConnect: (platform: string) => void;
  onDisconnect: (platform: string) => void;
  isLoading: boolean
};

const SocialConnectCard = ({
  platform,
  displayName,
  icon,
  connections,
  required,
  onConnect,
  onDisconnect,
  isLoading
}: Props) => {
  const conn = connections?.find((c) => c.platform === platform);
  const isRequired = required.includes(platform);

  const handleClick = () => {
    if (conn?.is_valid) onDisconnect(platform);
    else onConnect(platform);
  };

  return (
    <div className="flex items-center justify-between p-4 border bg-grey-200 rounded">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
          <img src={icon} alt={platform} className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-medium">{displayName}</h4>
          {isLoading?(
          <Skeleton width={84} height={7}/> 
          ):(
            conn?.is_valid ? (
            <p className="text-sm text-green-600">Connected</p>
          ) : conn ? (
            <p className="text-sm text-red-600">Connection expired</p>
          ) : isRequired ? (
            <p className="text-sm text-gray-700">Connection required..</p>
          ) : (
            <p className="text-sm text-gray-500">Not connected</p>
          )
          )}
          
        </div>
      </div>
          {isLoading?(
             <Skeleton width={84} height={24}/> 
          ):(
                  <div
        onClick={handleClick}
        className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 ${
          conn?.is_valid
            ? "border border-red-300 text-red-600 hover:bg-red-50"
            : isRequired
              ? "bg-black hover:bg-gray-700 text-white"
              : "bg-blue-700 hover:bg-blue-800 text-white"
        } transition cursor-pointer`}
      >
        {conn?.is_valid ? (
          <span>Disconnect</span>
        ) : (
          <div className="w-full flex items-center justify-between gap-2">
            <span>{conn ? "Reconnect" : "Connect"}</span>
            <ExternalLink size={14} />
          </div>
        )}
      </div>
          )
          }

    </div>
  );
};

export default SocialConnectCard;
