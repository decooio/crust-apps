// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import './index.css';
import React from 'react';
import styled from 'styled-components';
import type { AppProps as Props } from '@polkadot/react-components/types';


function FilesManager ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  return (
    <main className={`${className}`}>
      <div>Welcome using File Manager</div>
    </main>
  );
}

export default React.memo(styled(FilesManager)`

`);
