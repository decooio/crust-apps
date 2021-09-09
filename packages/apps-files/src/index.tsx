// Copyright 2017-2021 @polkadot/apps-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import type { AppProps as Props } from '@polkadot/react-components/types';
import ConnectWallet from '@polkadot/apps-files/ConnectWallet';
import FilesManager from '@polkadot/apps-files/FilesManager';

import { useTranslation } from './translate';

function FilesApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'connect',
      text: t<string>('Connect Wallet')
    },
    {
      name: 'filesmanager',
      text: t<string>('Files Manager')
    }
  ], [t]);

  return (
    <main className={`files--App ${className}`}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/filesmanager`}>
          <FilesManager />
        </Route>
        <Route>
          <ConnectWallet />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(styled(FilesApp)`
  .files--title {
    font-size: 22px;
    font-weight: 500;
    color: #333333;
  }
`);
