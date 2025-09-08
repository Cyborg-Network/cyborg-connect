# Cyborg-Connect

This front-end application is developed on a fork of [substrate-front-end-template](https://github.com/substrate-developer-hub/substrate-front-end-template).

Access the hosted version of the application here: https://cyborg-network.github.io/cyborg-connect/

## ⚠️ Note
For testing the whole network, please refer to [Local Testing](https://github.com/Cyborg-Network/cyborg-parachain/blob/master/Local%20Testing.md#local-setup)

### Installation

```bash
    # Clone the repository
    git clone https://github.com/Cyborg-Network/cyborg-connect.git

    cd cyborg-connect

    npm install
```

### Usage

To start cyborg connect in development first you need to create the metadata needed for type safety provided by papi.
For this you need to point papi to a ws endpoint exposed by a running parachain (eg. wss://alphachain.cyborgnetwork.io or ws://127.0.0.1:9988 if you have a node running locally)

```bash
    npx papi add cyborgParachain -w <WS-Endpoint>
    npx papi
```

You can start in development mode to connect to a locally running node or a hosted node, depending on the endpoints defined `.env.development`

```bash
    npm run start
```

You can also build the app in production mode,

```bash
    npm run build
```

and open `build/index.html` in your favorite browser.
