import React from "react"
import { useParachain } from "../../../context/PapiContext"
import * as Select from "@radix-ui/react-select"
import { Wallet } from "@talismn/connect-wallets"

const WalletIcon: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  return (
    <div className="flex items-center gap-2">
      <img src={wallet.logo.src} alt={wallet.logo.alt} className="w-7 h-7 p-1" />
      {wallet.title}
    </div> 
  )
}

export const ConnectWalletComponent: React.FC = () => {
  const { 
    selectedExtension, 
    connectExtension, 
    extensions, 
    accounts, 
    account, 
    selectAccount 
  } = useParachain()

  if (extensions.length === 0) {
    return (
      <div className="z-40">
        <div className="bg-cb-gray-500 text-white px-4 py-2 rounded-lg">
          No wallets detected
        </div>
      </div>
    )
  }

  if (!selectedExtension) {
    return (
      <div className="z-40">
        <Select.Root
          value={selectedExtension?.title}
          onValueChange={(value) => {
            const wallet = extensions.find((ext) => ext.title === value)
            if (wallet) connectExtension(wallet)
          }}
        >
          <Select.Trigger className="bg-cb-gray-500 border border-cb-green flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:bg-cb-gray-400 min-w-[200px]">
            <Select.Value placeholder="Select Wallet">
              {selectedExtension ? selectedExtension.title : 'Select Wallet'}
            </Select.Value>
          </Select.Trigger>
          <Select.Content side="bottom" className="bg-cb-gray-600 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
            {extensions.map(ext => (
              <Select.Item
                key={ext.title}
                value={ext.title}
                className="px-4 py-2 text-white cursor-pointer hover:bg-cb-gray-400"
              >
                <WalletIcon wallet={ext} />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  return (
    <div className="z-40 flex flex-col gap-2 justify-center items-center">
      <div className="text-white text-lg">Connected Wallet</div>

      <Select.Root
        value={selectedExtension?.title}
        onValueChange={(value) => {
          console.log(extensions)
          const wallet = extensions.find((ext) => ext.title === value)
          if (wallet) connectExtension(wallet)
        }}
      >
        <Select.Trigger className="bg-cb-gray-500 border border-cb-green flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:bg-cb-gray-400 min-w-[200px]">
          <Select.Value placeholder="Select Wallet">
            {selectedExtension 
              ? <WalletIcon wallet={selectedExtension} />
              : 'Select Wallet'
            }
          </Select.Value>
        </Select.Trigger>
        <Select.Content side="bottom" sideOffset={5} align="start" position="popper" className="bg-cb-gray-600 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
          {extensions.map(ext => (
            <Select.Item
              key={ext.title}
              value={ext.title}
              className="px-4 py-2 text-white cursor-pointer hover:bg-cb-gray-400"
            >
              <WalletIcon wallet={ext} />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {accounts.length > 0 && (
        <Select.Root
          value={account?.address}
          onValueChange={(address) => selectAccount(address)}
        >
          <Select.Trigger className="bg-cb-gray-500 border border-cb-green flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:bg-cb-gray-400 min-w-[200px]">
            <Select.Value placeholder="Select Account">
              {account ? account.name || account.address : "Select Account"}
            </Select.Value>
          </Select.Trigger>
          <Select.Content side="bottom" sideOffset={5} position="popper" className="bg-cb-gray-600 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
            {accounts.map(acc => (
              <Select.Item
                key={acc.address}
                value={acc.address}
                className="px-4 py-2 text-white cursor-pointer hover:bg-cb-gray-400"
              >
                {acc.name || acc.address}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )}
    </div>
  )
}
