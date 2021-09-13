// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface MetamaskReqOptions {
  method: string,
}

export interface Metamask {
  isInstalled: boolean,
  ethereum?: {
    isMetamask: boolean,
    request: <T>(option: MetamaskReqOptions) => Promise<T>
  },
  isLoad: boolean,
  isAllowed: boolean,
  accounts: string[],
}
