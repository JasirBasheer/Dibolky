import { IMetaAccount } from '@/types/common.types';
import { useState } from 'react';

interface InstagramAccountModalProps {
  accounts: IMetaAccount[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (accountId: string) => void;
}
const InstagramAccountModal = ({ accounts, isOpen, onClose, onSelect }: InstagramAccountModalProps) => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.pageId || null);

  if (!isOpen) return null;

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    if (onSelect) onSelect(accountId)
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden text-white">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg text-black font-medium">Select your Meta Account</h2>
          <button
            onClick={onClose}
            className="text-2xl font-light text-black"
          >
            ×
          </button>
        </div>
        <div className="py-2">
          {accounts.map((account: IMetaAccount) => (
            <div
              key={account.pageId}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleAccountSelect(account.pageId)}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full overflow-hidden ${!account.pageImage ? 'bg-gray-600' : ''}`}>
                  {account.pageImage ? (
                    <img src={account.pageImage} alt={account.pageName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">👤</span>
                    </div>
                  )}
                </div>
                <span className="ml-4 font-medium text-black">{account.pageName}</span>
              </div>

              {selectedAccount === account.pageId && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default InstagramAccountModal;