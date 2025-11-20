import React, { useEffect, useState } from 'react'
import { Table, Grid, Button, Label, Dropdown } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrateState } from './substrate-lib'

// Asset configuration matching the frontend
const ASSETS = [
  { id: 0, name: 'ENTT', symbol: 'ENTT', isNative: true },
  { id: 1, name: 'USDT', symbol: 'USDT', isNative: false },
  { id: 2, name: 'USDC', symbol: 'USDC', isNative: false },
  { id: 3, name: 'BORG', symbol: 'BORG', isNative: false },
]

export default function Main(props) {
  const { api, keyring } = useSubstrateState()
  const accounts = keyring.getPairs()
  const [balances, setBalances] = useState({})
  const [assetBalances, setAssetBalances] = useState({})
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address)
    let unsubscribeAll = null

    // Subscribe to native token balances
    api.query.system.account
      .multi(addresses, balances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
            [address]: balances[index].data.free.toHuman(),
          }),
          {}
        )
        setBalances(balancesMap)
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api, keyring, setBalances])

  //  fetch asset balances
  const fetchAssetBalances = async (assetId) => {
    if (assetId === 0) return // Native token is already handled

    try {
      const addresses = keyring.getPairs().map(account => account.address)
      const assetBalancesMap = {}

      for (const address of addresses) {
        // asset storage structure
        const balanceEntry = await api.query.assets.account(assetId, address);
        const balance = balanceEntry?.unwrapOrDefault()?.balance;
        assetBalancesMap[address] = balance?.balance?.toHuman() || '0'
      }

      setAssetBalances(assetBalancesMap)
    } catch (error) {
      console.error('Error fetching asset balances:', error)
    }
  }

  useEffect(() => {
    fetchAssetBalances(selectedAsset.id)
  }, [selectedAsset.id, api, keyring])

  const getBalanceForAccount = (address) => {
    if (selectedAsset.id === 0) {
      return balances[address] || '0'
    } else {
      return assetBalances[address] || '0'
    }
  }

  const assetOptions = ASSETS.map(asset => ({
    key: asset.id,
    value: asset.id,
    text: `${asset.symbol} (${asset.name})`,
    content: (
      <div className="flex items-center gap-2">
        <span>{asset.symbol}</span>
        {asset.isNative && <Label size="mini" color="blue">Native</Label>}
      </div>
    )
  }))

  return (
    <Grid.Column>
      <div className="flex justify-between items-center mb-4">
        <h1>Balances</h1>
        <Dropdown
          selection
          options={assetOptions}
          value={selectedAsset.id}
          onChange={(_, data) => setSelectedAsset(ASSETS.find(a => a.id === data.value))}
          placeholder="Select Asset"
        />
      </div>
      {accounts.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Name</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Balance ({selectedAsset.symbol})</strong>
              </Table.Cell>
            </Table.Row>
            {accounts.map(account => (
              <Table.Row key={account.address}>
                <Table.Cell width={3} textAlign="right">
                  {account.meta.name}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {account.address}
                  </span>
                  <CopyToClipboard text={account.address}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                </Table.Cell>
                <Table.Cell width={3}>
                  {getBalanceForAccount(account.address)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  )
}
