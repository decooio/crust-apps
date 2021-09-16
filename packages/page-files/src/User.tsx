// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { WrapLoginUser, NearLoginUserWrapper } from '@polkadot/app-files/hooks';
import { Icon } from '@polkadot/react-components';

import { useTranslation } from './translate';

export interface Props {
  nearUser: NearLoginUserWrapper,
  user: WrapLoginUser,
  className?: string,
}

function shortAccount (account: string) {
  if (account.length <= 8) return account;

  return `${account.substr(0, 4)}...${account.substr(account.length - 4, 4)}`;
}

function User ({ className, user, nearUser }: Props) {
  const { i18n, t } = useTranslation();
  const devLink = i18n.language === 'zh-CN'
    ? 'https://wiki.crust.network/docs/zh-CN/buildGettingStarted'
    : 'https://wiki.crust.network/docs/en/buildGettingStarted';
  const onClickDev = useCallback(() => {
    window.open(devLink, '_blank');
  }, [devLink]);

  console.log('User', user, nearUser);

  return (
    <div className={className}>
      <div
        className='item'
        onClick={onClickDev}>
        <Icon icon={['far', 'user']}/>{t('Developer Guide')}
      </div>
      {
        user.account &&
        <div className='item'>
          {shortAccount(user.account)} <Icon icon='caret-down'/>
          <div className='options'>
            <div
              className='option'
              onClick={user.logout}>
              <Icon icon='sign-out-alt'/> {t('Logout')}
            </div>
          </div>
        </div>
      }
      {
        (!user.account && nearUser.signedIn) &&
        <div className='item'>
          {shortAccount(nearUser.pubKey || '')} <Icon icon='caret-down'/>
          <div className='options'>
            <div
              className='option'
              onClick={nearUser.signOut}>
              <Icon icon='sign-out-alt'/> {t('Logout')}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default React.memo<Props>(styled(User)`
  height: 46px;
  width: unset !important;
  line-height: 46px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  display: flex;
  padding-right: 1rem;

  .ui--Icon {
    margin: 0 8px;
  }

  .item {
    cursor: pointer;
    margin-left: 15px;
    position: relative;

    &:hover {
      .options {
        display: block;
      }
    }
  }

  .options {
    color: black;
    display: none;
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    top: 46px;
    right: 8px;
    z-index: 200;
    background-color: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);

    .option {
      padding: 0 2rem;
      display: flex;
      align-items: center;
      white-space: nowrap;
      &:hover {
        background-color: var(--bg-page);
      }
    }
  }
`);
