// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';

export interface LogoProps {
  readonly size: number;
  readonly fill?: string;
}

export function Logo(props: LogoProps): JSX.Element {
  const overrideUrl = import.meta.env.MEDPLUM_LOGO_URL || '/img/grovyn_logo.png';
  return <img src={overrideUrl} alt="Logo" style={{ maxHeight: props.size, width: 'auto' }} />;
}
