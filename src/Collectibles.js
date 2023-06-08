import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { useSubstrate } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

import CollectibleCards from './CollectibleCards'

// Construct a Collectible ID from storage key
const convertToCollectibleHash = entry => `0x${entry[0].toJSON().slice(-64)}`

// Construct a Collectible object
const constructCollectible = (hash, { price, color, owner }) => ({
  unique_id: hash,
  price: price.toJSON(),
  color: color.toJSON(),
  owner: owner.toJSON(),
})

// Use React hooks
export default function Collectibles(props) {
  const { api, keyring } = useSubstrate()
  const { accountPair } = props

  const [collectibleHashes, setCollectibleHashes] = useState([])
  const [Collectibles, setCollectibles] = useState([])
  const [status, setStatus] = useState('')

  // Subscription function for setting Collectible IDs
  const subscribeCollectiblesCount = () => {
    let unsub = null

    const asyncFetch = async () => {
      // Query CollectiblesCount from runtime
      unsub = await api.query.collectibles.collectiblesCount(async cnt => {
        // Fetch all Collectible objects using entries()
        const entries = await api.query.collectibles.CollectibleMap.entries()
        // Retrieve only the Collectible ID and set to state
        const hashes = entries.map(convertToCollectibleHash)
        setCollectibleHashes(hashes)
      })
    }

    asyncFetch()

    // return the unsubscription cleanup function
    return () => {
      unsub && unsub()
    }
  }

  // Subscription function to construct a Collectible object
  const subscribeCollectibles = () => {
    let unsub = null

    const asyncFetch = async () => {
      // Get Collectible objects from storage
      unsub = await api.query.collectibles.multi(
        collectibleHashes,
        collectibles => {
          // Create an array of Collectible objects from `constructCollectible`
          const collectibleArr = collectibles.map((collectible, ind) =>
            constructCollectible(collectibleHashes[ind], collectible.value)
          )
          // Set the array of Collectible objects to state
          setCollectibles(collectibleArr)
        }
      )
    }

    asyncFetch()

    // return the unsubscription cleanup function
    return () => {
      unsub && unsub()
    }
  }

  useEffect(subscribeCollectiblesCount, [api, keyring])
  useEffect(subscribeCollectibles, [api, collectibleHashes])
}
