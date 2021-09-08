// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/apps-files';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'files',
    icon: 'cogs',
    name: 'files',
    text: t('nav.files', 'Files', { ns: 'apps-routing' })
  };
}
