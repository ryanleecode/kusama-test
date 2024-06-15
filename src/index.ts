import { start } from 'smoldot';
import { ksmcc3 } from '@substrate/connect-known-chains';
import { createClient } from '@polkadot-api/substrate-client';
import { getObservableClient } from '@polkadot-api/observable-client';
import { getSmProvider } from '@polkadot-api/sm-provider';

interface Provider {
  send: (message: string) => void;
  disconnect: () => void;
}
type ConnectProvider = (onMessage: (message: string) => void) => Provider;

const withLogsProvider = (input: ConnectProvider): ConnectProvider => {
  return (onMsg) => {
    const result = input((msg) => {
      console.log('in', msg);
      onMsg(msg);
    });

    return {
      ...result,
      send: (msg) => {
        console.log('out', msg);
        result.send(msg);
      },
    };
  };
};

const smoldot = start({ maxLogLevel: 4 });

const chain = await smoldot.addChain({ chainSpec: ksmcc3 });
const jsonRpcProvider = getSmProvider(chain);
const client = getObservableClient(createClient(jsonRpcProvider));

const chainhead = client.chainHead$();

chainhead.bestBlocks$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.log('complete'),
});
