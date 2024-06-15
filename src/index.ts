import { start } from 'smoldot'
import { ksmcc3 } from '@substrate/connect-known-chains'
import { createClient } from '@polkadot-api/substrate-client'
import { getObservableClient } from '@polkadot-api/observable-client'
import { getSmProvider } from '@polkadot-api/sm-provider'

const smoldot = start()

const chain = await smoldot.addChain({ chainSpec: ksmcc3 })
const jsonRpcProvider = getSmProvider(chain)
const client = getObservableClient(createClient(jsonRpcProvider))

const chainhead = client.chainHead$()

chainhead.bestBlocks$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.log("complete")
})
