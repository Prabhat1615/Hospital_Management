// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import { MemoryRouter } from 'react-router';
import { ResetPasswordPage } from './ResetPasswordPage';
import type { UserEvent } from './test-utils/render';
import { render, screen, userEvent } from './test-utils/render';

const medplum = new MockClient();

function setup(): UserEvent {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <MedplumProvider medplum={medplum}>
        <ResetPasswordPage />
      </MedplumProvider>
    </MemoryRouter>
  );

  return user;
}

describe('ResetPasswordPage', () => {
  test('Renders', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  test('Submit success', async () => {
    const user = setup();

    await user.type(screen.getByLabelText('Email *'), 'admin@example.com');
    await user.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByText('password reset email will be sent', { exact: false })).toBeInTheDocument();
  });
});
