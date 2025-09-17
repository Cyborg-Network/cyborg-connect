import React, { ReactNode, useContext, useEffect, useState, useCallback } from "react"
import { CyborgParachain, cyborgParachain } from "@polkadot-api/descriptors"
import { createClient, TypedApi } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWallets, Wallet, WalletAccount } from "@talismn/connect-wallets"
import { connectInjectedExtension, InjectedPolkadotAccount } from "polkadot-api/pjs-signer"

interface ParachainContextType {
  parachainApi: TypedApi<CyborgParachain>
  extensions: Wallet[]
  selectedExtension: Wallet | undefined
  accounts: InjectedPolkadotAccount[]
  account: InjectedPolkadotAccount | undefined
  connectExtension: (wallet: Wallet) => Promise<void>
  selectAccount: (address: string) => void
}

const createParachainApi = () => {
  const socket = process.env.REACT_APP_PARACHAIN_URL
  if (!socket) throw new Error("Missing REACT_APP_PARACHAIN_URL")

  const client = createClient(withPolkadotSdkCompat(getWsProvider(socket)))
  return client.getTypedApi(cyborgParachain)
}

const ParachainContext = React.createContext<ParachainContextType | undefined>(undefined)

export const ParachainContextProvider = ({ children }: { children: ReactNode }) => {
  const [extensions, setExtensions] = useState<Wallet[]>([])
  const [selectedExtension, setSelectedExtension] = useState<Wallet | undefined>(undefined)
  const [accounts, setAccounts] = useState<InjectedPolkadotAccount[]>([])
  const [account, setAccount] = useState<InjectedPolkadotAccount | undefined>(undefined)

  const parachainApi = createParachainApi()

  const connectExtension = useCallback(async (wallet: Wallet) => {
    try {
      await wallet.enable("Cyborg Connect")
      const ext = await connectInjectedExtension(wallet.extensionName)

      setSelectedExtension({...wallet})
      localStorage.setItem("selectedExtension", wallet.title)


      wallet.subscribeAccounts((_tsmAccounts: WalletAccount[]) => {
        const pjsAccounts: InjectedPolkadotAccount[] = ext.getAccounts()
        setAccounts(pjsAccounts)
        if (pjsAccounts.length > 0) {
          const lastAddr = localStorage.getItem("selectedAccount")
          const found = pjsAccounts.find((a) => a.address === lastAddr) || pjsAccounts[0]
          setAccount(found)
          localStorage.setItem("selectedAccount", found.address)
        } else {
          setAccount(undefined)
          localStorage.removeItem("selectedAccount")
        }
      })
    } catch (err) {
      console.error("Failed to connect extension:", err)
    }
  }, [])

  const selectAccount = useCallback(
    (address: string) => {
      const found = accounts.find((a) => a.address === address)
      if (found) {
        setAccount(found)
        localStorage.setItem("selectedAccount", found.address)
      }
    },
    [accounts]
  )

  useEffect(() => {
    const updateExtensions = async () => {
      setExtensions(getWallets())
    }

    const timer = setTimeout(updateExtensions, 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadExtensions = async () => {
      const lastExt = localStorage.getItem("selectedExtension")
      const wallet = getWallets().find((wallet) => wallet.title === lastExt);
      if (wallet) connectExtension(wallet)
    }

    const timer = setTimeout(loadExtensions, 200)
    return () => clearTimeout(timer)
  }, [connectExtension])

  return (
    <ParachainContext.Provider
      value={{
        parachainApi,
        extensions,
        selectedExtension,
        accounts,
        account,
        connectExtension,
        selectAccount,
      }}
    >
      {children}
    </ParachainContext.Provider>
  )
}

export const useParachain = () => {
  const ctx = useContext(ParachainContext)
  if (!ctx) throw new Error("useParachain must be used within ParachainContextProvider")
  return ctx
}
