// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Anchor, Box, Checkbox, Divider, Flex, Stack, Text, TextInput } from '@mantine/core';
import type { GoogleCredentialResponse, LoginAuthenticationResponse } from '@medplum/core';
import { normalizeOperationOutcome } from '@medplum/core';
import type { OperationOutcome } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react-hooks';
import type { JSX, ReactNode } from 'react';
import { useState } from 'react';
import { Form } from '../Form/Form';
import { SubmitButton } from '../Form/SubmitButton';
import { GoogleButton } from '../GoogleButton/GoogleButton';
import { getGoogleClientId } from '../GoogleButton/GoogleButton.utils';
import { OperationOutcomeAlert } from '../OperationOutcomeAlert/OperationOutcomeAlert';
import { PasswordInput } from '../PasswordInput/PasswordInput';
import { getErrorsForInput, getIssuesForExpression } from '../utils/outcomes';
export interface NewUserFormProps {
  readonly projectId: string;
  readonly clientId?: string;
  readonly googleClientId?: string;
  readonly children?: ReactNode;
  readonly onSignIn?: () => void;
  readonly handleAuthResponse: (response: LoginAuthenticationResponse) => void;
}

export function NewUserForm(props: NewUserFormProps): JSX.Element {
  const googleClientId = getGoogleClientId(props.googleClientId);
  const medplum = useMedplum();
  const [outcome, setOutcome] = useState<OperationOutcome>();
  const issues = getIssuesForExpression(outcome, undefined);

  return (
    <Form
      onSubmit={async (formData: Record<string, string>) => {
        setOutcome(undefined);
        try {
          props.handleAuthResponse(
            await medplum.startNewUser({
              projectId: props.projectId,
              clientId: props.clientId,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              remember: formData.remember === 'true',
            })
          );
        } catch (err) {
          setOutcome(normalizeOperationOutcome(err));
        }
      }}
    >
      <Flex direction="column" align="center" justify="center">
        {props.children}
      </Flex>
      <OperationOutcomeAlert issues={issues} mb="lg" />
      {googleClientId && (
        <>
          <Box style={{ minHeight: 40 }}>
            <GoogleButton
              googleClientId={googleClientId}
              handleGoogleCredential={async (response: GoogleCredentialResponse) => {
                try {
                  props.handleAuthResponse(
                    await medplum.startGoogleLogin({
                      googleClientId: response.clientId,
                      googleCredential: response.credential,
                      projectId: props.projectId,
                      createUser: true,
                    })
                  );
                } catch (err) {
                  setOutcome(normalizeOperationOutcome(err));
                }
              }}
            />
          </Box>
          <Divider label="or" labelPosition="center" my="lg" />
        </>
      )}
      <Stack gap="sm">
        <TextInput
          name="firstName"
          type="text"
          label="First name"
          placeholder="First name"
          required={true}
          autoFocus={true}
          error={getErrorsForInput(outcome, 'firstName')}
        />
        <TextInput
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Last name"
          required={true}
          error={getErrorsForInput(outcome, 'lastName')}
        />
        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="name@domain.com"
          required={true}
          error={getErrorsForInput(outcome, 'email')}
        />
        <PasswordInput
          name="password"
          label="Password"
          autoComplete="off"
          required={true}
          error={getErrorsForInput(outcome, 'password')}
        />
      </Stack>
      <Stack gap="xs">
        <Checkbox
          id="remember"
          name="remember"
          label="Remember me"
          size="xs"
          style={{ lineHeight: 1 }}
          pt="md"
          pb="xs"
        />
        <SubmitButton fullWidth>Register Account</SubmitButton>
        {props.onSignIn && (
          <Text
            size="sm"
            mt="lg"
            c="dimmed"
            ta="center"
            data-dashlane-ignore="true"
            data-lp-ignore="true"
            data-no-autofill="true"
            data-form-type="navigation"
          >
            Already have an account?{' '}
            <Anchor component="button" type="button" onClick={props.onSignIn}>
              Sign In
            </Anchor>
          </Text>
        )}
        <Text c="dimmed" size="xs" pt="lg" ta="center">
          By clicking "Register Account" you agree to the Medplum{' '}
          <Anchor href="https://www.medplum.com/privacy">Privacy&nbsp;Policy</Anchor>
          {' and '}
          <Anchor href="https://www.medplum.com/terms">Terms&nbsp;of&nbsp;Service</Anchor>.
        </Text>
      </Stack>
    </Form>
  );
}
