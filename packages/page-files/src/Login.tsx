// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

import { WrapLoginUser } from '@polkadot/app-files/hooks';
import { externalLogos } from '@polkadot/apps-config';
import { InputAddress, StatusContext } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { Button } from './btns';
import { useTranslation } from './translate';

export interface Props {
  className?: string
  user: WrapLoginUser,
}

function Login ({ className, user }: Props) {
  const { t } = useTranslation();
  const [showCrust, setShowCrust] = useState(false);
  const _onToggleWalletCrust = useCallback(() => setShowCrust(!showCrust), [showCrust]);
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState('');
  const onAccountChange = useCallback((nAccount: string | null) => {
    if (nAccount) {
      setAccount(nAccount);
    }
  }, []);
  const onClickNext = useCallback(() => {
    if (!account) return;
    user.setLoginUser({ account, wallet: '' });
  }, [account, user]);

  const { queueAction } = useContext(StatusContext);
  const _onClickMetamask = useCallback(() => {
    const ethReq = user.metamask.ethereum?.request;

    if (user.metamask.isInstalled && ethReq) {
      ethReq<string[]>({
        method: 'eth_requestAccounts'
      })
        .then((res) => {
          console.info('accounts:', res);
          const selectedAddress = user.metamask.ethereum?.selectedAddress;

          if (selectedAddress && res.includes(selectedAddress)) {
            user.setLoginUser({
              account: selectedAddress,
              wallet: 'metamask'
            });
          } else if (res.length) {
            user.setLoginUser({
              account: res[0],
              wallet: 'metamask'
            });
          }
        })
        .catch((error) => {
          console.error('accountsError:', error);
        });
    } else {
      queueAction({
        status: 'error',
        message: t('Need installed metamask'),
        action: 'connectMetamask'
      });
    }
  }, [user, queueAction, t]);

  return (
    <div className={className}>
      <div className='loginPanel'>
        <div className='space'/>
        <div className='loginSpec'>
          <div>
            <div className='specTitle'>{t('Crust Files')}</div>
            <div className='specSubTitle'>
              {t('Enjoy storing your files in a ')}
              {<span>{t('Web3')}</span>}
              {t(' style.')}
            </div>
            <div className='specItem'>{`- ${t('Multi-wallet access')}`}</div>
            <div className='specItem'>{`- ${t('End-to-end file encryption')}`}</div>
            <div className='specItem'>{`- ${t('Easily share links to friends')}`}</div>
            <div className='specItem'>{`- ${t('Long-term storage with abundant IPFS replicas')}`}</div>
            <div className='specItem'>{`- ${t('Retrieve your files anywhere, anytime')}`}</div>
            <div className='specItem'>{`- ${t('Open-source and welcome to contribute!')}`}</div>
          </div>
          <img
            className='specIcon'
            src={externalLogos.crustFilesBox as string}
          />
        </div>
        <div className='signWithWallet'>
          {
            !showCrust &&
            <>
              <div className='signTitle'>{t('Sign-in with a Web3 wallet')}</div>
              <div className='wallets'>
                <img
                  className='walletIcon'
                  onClick={_onToggleWalletCrust}
                  src={externalLogos.walletCrust as string}
                />
                <img
                  className='walletIcon'
                  onClick={_onClickMetamask}
                  src={externalLogos.walletMetamask as string}
                />
              </div>
            </>
          }
          {
            showCrust &&
            <>
              <InputAddress
                className={'inputAddress'}
                defaultValue={account}
                isDisabled={!hasAccounts}
                label={t<string>(hasAccounts ? 'Please choose account' : 'Need to connect a plug-in wallet or import an account first')}
                onChange={onAccountChange}
                type='account'
              />
              <div className='btns'>
                <Button
                  flex={1}
                  label={t('Continue with my account')}
                  onClick={onClickNext}/>
                <div className='btn-space'/>
                <Button
                  flex={1}
                  is2={true}
                  label={t('Cancel')}
                  onClick={_onToggleWalletCrust}
                />
              </div>
            </>
          }
        </div>
        <div className='space'/>
      </div>
    </div>
  );
}

export default React.memo<Props>(styled(Login)`
  padding: 2rem;

  .loginPanel {
    height: 90vh;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .space {
      flex: 1;
    }
  }

  .loginSpec {
    display: flex;

    .specTitle {
      font-size: 32px;
      font-weight: 600;
      color: #2E333B;
      line-height: 45px;
    }

    .specSubTitle {
      font-size: 24px;
      font-weight: 400;
      color: #666666;
      line-height: 33px;
      margin-bottom: 2rem;

      span {
        color: #FF8D00;
      }
    }

    .specItem {
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }

    .specIcon {
      object-fit: contain;
      width: 290px;
      height: 232px;
      margin-left: 36px;
    }
  }

  .signWithWallet {
    margin-top: 2rem;
    min-width: 740px;
    background: #F4F4F4;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .signTitle {
      font-size: 20px;
      font-weight: 600;
      color: #2E333B;
      line-height: 28px;
    }

    .wallets {
      display: flex;
    }

    .walletIcon {
      cursor: pointer;
      width: 138px;
      height: 138px;
      object-fit: contain;
    }

    .inputAddress {
      width: 100%;
    }

    .btns {
      margin-top: 1rem;
      display: flex;
      width: 100%;

      .btn-space {
        width: 15px;
        flex-shrink: 0;
      }
    }

  }
`);
