// Copyright 2017-2021 @polkadot/apps-files
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, InputAddress } from '@polkadot/react-components';

interface Props {
  className?: string;
}

function ConnectWallet({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const _onChangeSubstrateAccount = useCallback(
    (accountId: string | null) => {},
    []
  );

  const _connectMetamask = useCallback(
    async() => {
      if (typeof window.ethereum === 'undefined') {
        // TODO: Show toast message and return
        console.log('MetaMask is not installed!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log(`Connected eth account ${account}`);
      // TODO: Save connected eth account in localStorage
    },
    []
  );

  return (
    <div className={`wallet-connect ${className}`}>
      <div className='files--title' style={{ marginTop: 15 }}>{t('Welcome to Crust Files')}</div>
      <div className='files--title' style={{ marginTop: 20 }}>{t('Select an account')}</div>
      <div className='ui--row' style={{ marginTop: 15 }}>
        <InputAddress
          className='full'
          help={t<string>('select the account you wish to sign data with')}
          isInput={false}
          label={t<string>('account')}
          onChange={_onChangeSubstrateAccount}
          type='account'
        />
      </div>
      <div className='ui--row' style={{ marginTop: 15 }}>
        <Button
          icon='sync'
          label={t<string>('Connect Metamask')}
          onClick={_connectMetamask}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(ConnectWallet)`
  &.wallet-connect {

  }
`);
