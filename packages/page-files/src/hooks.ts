// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import store from 'store';

import { web3FromSource } from '@polkadot/extension-dapp';
import { useAccounts } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { isFunction, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';

import { SaveFile } from './types';

export interface Files {
  files: SaveFile[],
  isLoad: boolean,
}

export interface WrapFiles extends Files {
  setFiles: (files: SaveFile[]) => void
}

export interface UseSign {
  isLocked: boolean
  sign?: (data: string, password?: string) => Promise<string>
}

export interface LoginUser {
  account: string
  wallet: '' | 'metamask'
}

export interface WrapLoginUser extends LoginUser {
  isLoad: boolean
  setLoginUser: (u: LoginUser) => void
  logout: () => void
  sign?: (data: string, password?: string) => Promise<string>
  isLocked: boolean
}

const defFilesObj: Files = { files: [], isLoad: true };

export function useFiles (): WrapFiles {
  const [filesObj, setFilesObj] = useState<Files>(defFilesObj);

  useEffect(() => {
    try {
      const f = store.get('files', defFilesObj) as Files;

      f.isLoad = false;

      if (f !== defFilesObj) {
        setFilesObj(f);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  const setFiles = useCallback((nFiles: SaveFile[]) => {
    const nFilesObj = { ...filesObj, files: nFiles };

    setFilesObj(nFilesObj);
    store.set('files', nFilesObj);
  }, [filesObj]);

  return useMemo(() => ({ ...filesObj, setFiles }), [filesObj, setFiles]);
}

export function useSign (account: LoginUser): UseSign {
  const [state, setState] = useState<UseSign>({ isLocked: true });

  useEffect(() => {
    if (!account.account) return;

    if (account.wallet === 'metamask') {
      // todo metamask
      setState((o) => ({ ...o, isLocked: false }));
    } else {
      const currentPair = keyring.getPair(account.account);

      if (!currentPair) return;
      const meta = currentPair.meta || {};
      const isInjected = (meta.isInjected as boolean) || false;
      const accountIsLocked = isInjected ? false : currentPair.isLocked || false;

      setState((o) => ({ ...o, isLocked: accountIsLocked }));

      // for injected, retrieve the signer
      if (meta.source && isInjected) {
        web3FromSource(meta.source as string)
          .catch(() => null)
          .then((injected) => {
            const signRaw = injected?.signer?.signRaw;

            if (signRaw && isFunction(signRaw)) {
              const sign = function (data: string): Promise<string> {
                return signRaw({
                  address: currentPair.address,
                  data: stringToHex(data),
                  type: 'bytes'
                }).then((res) => res.signature);
              };

              setState((o) => ({ ...o, sign }));
            }

            return null;
          })
          .catch(console.error);
      } else {
        const sign = function (data: string, password?: string): Promise<string> {
          return new Promise<string>((resolve, reject) => {
            try {
              if (accountIsLocked) {
                currentPair.unlock(password);
              }

              resolve(u8aToHex(currentPair.sign(stringToU8a(data))));
            } catch (e) {
              reject(e);
            }
          });
        };

        setState((o) => ({ ...o, sign }));
      }
    }
  }, [account]);

  return state;
}

const defLoginUser: LoginUser = { account: '', wallet: '' };

export function useLoginUser (): WrapLoginUser {
  const [account, setAccount] = useState<LoginUser>(defLoginUser);
  const [isLoad, setIsLoad] = useState(true);
  const accounts = useAccounts();
  const accountsIsLoad = accounts.isLoad;
  const isLoadUser = isLoad || accountsIsLoad;

  useEffect(() => {
    try {
      const f = store.get('files:login', defLoginUser) as LoginUser;

      if (accounts.isLoad) return;

      if (f !== defLoginUser) {
        if (f.account && accounts.isAccount(f.account)) {
          setAccount(f);
        }

        if (f.account && f.wallet && f.wallet === 'metamask') {
          setAccount(f);
        }
      }

      setIsLoad(false);
    } catch (e) {
      setIsLoad(false);
      console.error(e);
    }
  }, [accounts]);

  const setLoginUser = useCallback((loginUser: LoginUser) => {
    const nAccount = { ...loginUser };

    setAccount(nAccount);
    store.set('files:login', nAccount);
  }, []);

  const logout = useCallback(() => {
    setAccount({ ...defLoginUser });
  }, []);
  const uSign = useSign(account);

  return useMemo(() => ({
    ...account,
    isLoad: isLoadUser,
    setLoginUser,
    logout,
    ...uSign
  }), [account, isLoadUser, setLoginUser, logout, uSign]);
}
