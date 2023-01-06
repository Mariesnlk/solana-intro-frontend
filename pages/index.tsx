import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'
import * as web3 from '@solana/web3.js'

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [executable, setIsExecutable] = useState(false)

  const addressSubmittedHandler = (address: string) => {
    try {
      setAddress(address)
      const key = new web3.PublicKey(address)
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
      /// converting the balance from Lamports to SOL - the balance is returned in Lamports, not SOL.
      connection.getBalance(key).then(balance => {
        setBalance(balance / web3.LAMPORTS_PER_SOL)
      })

      connection.getAccountInfo(key).then(info => {
        setIsExecutable(info?.executable ?? false)
      })
    } catch (error) {
      setAddress('')
      setBalance(0)
      alert(error)
    }

    /// This is the encoding of Solana addresses as strings.
    // setAddress(key.toBase58())

  }

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is it executable?: ${executable ? 'Yep' : 'Nope'} `}</p>
      </header>
    </div>
  )
}

export default Home
