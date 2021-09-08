// Copyright 2017-2021 @polkadot/apps-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';
import ConnectWallet from '@polkadot/apps-files/ConnectWallet';

import React from 'react';
import styled from 'styled-components';


function FilesApp ({ className = '' }: Props): React.ReactElement<Props> {
  return (
    <main className={`files--App ${className}`}>
      <ConnectWallet />
    </main>
  );
}

export default React.memo(styled(FilesApp)`
  &.files--App {
    background: white;

    margin-top: 30px;
    margin-left: 300px;
    margin-right: 300px;

    padding: 20px;
  }

  .files--title {
    font-size: 22px;
    font-weight: 500;
    color: #333333;
  }
`);
