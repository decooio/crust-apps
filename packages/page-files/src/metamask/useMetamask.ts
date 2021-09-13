// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { Metamask } from './types';

export default function useMetamask (): Metamask {
  const [metamask, setMetamask] = useState<Metamask>({
    isInstalled: false,
    isLoad: true,
    isAllowed: false,
    accounts: []
  });

  useEffect(() => {
    const ethereum = window.ethereum as Metamask['ethereum'];

    if (ethereum && ethereum.isMetamask) {
      ethereum.request<string[]>({ method: 'eth_accounts' })
        .then((accounts) => {
          setMetamask({
            isInstalled: true,
            isLoad: false,
            ethereum,
            isAllowed: true,
            accounts
          });
        })
        .catch((e) => {
          setMetamask({
            isInstalled: true,
            isLoad: false,
            isAllowed: false,
            accounts: []
          });
        });
    } else {
      setMetamask({
        isInstalled: false,
        isLoad: false,
        isAllowed: false,
        accounts: []
      });
    }
  }, []);

  return metamask;
}
