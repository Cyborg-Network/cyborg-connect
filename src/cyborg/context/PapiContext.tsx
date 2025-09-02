import React, { useContext } from 'react'

import { CyborgParachain, cyborgParachain } from '@polkadot-api/descriptors'
import { createClient, TypedApi } from "polkadot-api"
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'

interface ParachainContextType {
    parachainApi: TypedApi<CyborgParachain>;
}

const createParachainApi = () => {
    const socket =  process.env.REACT_APP_PARACHAIN_URL;
    const client = createClient(
        withPolkadotSdkCompat(
            getWsProvider(socket)
        )
    );

    const parachainApi = client.getTypedApi(cyborgParachain);

    return parachainApi
}

const ParachainContext = React.createContext<ParachainContextType | undefined>(undefined)

const ParachainContextProvider = props => {

    const parachainApi = createParachainApi()

    return (
        <ParachainContext.Provider
            value={{
                parachainApi
            }}
        >
            {props.children}
        </ParachainContext.Provider>
    )
}

const useParachain = () => useContext(ParachainContext)

export { ParachainContextProvider, useParachain }