import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { CyborgParachain, cyborgParachain } from '@polkadot-api/descriptors'
import { createClient, TypedApi } from "polkadot-api"
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { 
    getInjectedExtensions, 
    connectInjectedExtension, 
    InjectedPolkadotAccount, 
    InjectedExtension 
} from 'polkadot-api/pjs-signer'

interface ParachainContextType {
    parachainApi: TypedApi<CyborgParachain>;
    account: InjectedPolkadotAccount | undefined;
}

interface ContextProviderProps {
    children: ReactNode;
}

const createParachainApi = () => {
    const socket =  process.env.REACT_APP_PARACHAIN_URL;
    console.log(`Connected to node: ${socket}`)
    const client = createClient(
        withPolkadotSdkCompat(
            getWsProvider(socket)
        )
    );

    const parachainApi = client.getTypedApi(cyborgParachain);

    return parachainApi
}

const ParachainContext = React.createContext<ParachainContextType | undefined>(undefined)

const ParachainContextProvider = ({ children }: ContextProviderProps) => {
    const [account, setAccount] = useState<InjectedPolkadotAccount | undefined>(undefined)

    useEffect(() => {
        const getAccount = async () => {
            const extensions: string[] = getInjectedExtensions()
            const selectedExtension: InjectedExtension = await connectInjectedExtension(
                extensions[0],
            )
            const connectedAccounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts()

            setAccount(connectedAccounts[0])
        }
        getAccount()
    }, [])

    const parachainApi = createParachainApi()

    return (
        <ParachainContext.Provider
            value={{
                parachainApi, 
                account,
            }}
        >
            {children}
        </ParachainContext.Provider>
    )
}

const useParachain = () => useContext(ParachainContext)

export { ParachainContextProvider, useParachain }