// Copyright 2017-2021 @polkadot/apps-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'apps-files'> {
  return useTranslationBase('apps-files');
}
