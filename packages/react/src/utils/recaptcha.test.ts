// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { describe, test } from 'vitest';
import { initRecaptcha } from './recaptcha';

describe('recaptcha', () => {
  test('initRecaptcha', () => {
    // Create script tag with site key
    initRecaptcha('xyz');
  });
});
