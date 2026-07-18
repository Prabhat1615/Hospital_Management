// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { MEDPLUM_VERSION } from '@medplum/core';
import type { UserConfiguration } from '@medplum/fhirtypes';
import type { NavbarMenu } from '@medplum/react';
import { AppShell, Loading, Logo, ScrollToTop, useMedplum } from '@medplum/react';
import {
  IconBrandAsana,
  IconBuilding,
  IconDatabase,
  IconFolder,
  IconForms,
  IconId,
  IconLock,
  IconLockAccess,
  IconMicroscope,
  IconPackages,
  IconReceipt,
  IconReportMedical,
  IconStar,
  IconWebhook,
} from '@tabler/icons-react';
import type { FunctionComponent, JSX } from 'react';
import { Suspense } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { AppRoutes } from './AppRoutes';

import './App.css';

export function App(): JSX.Element {
  const medplum = useMedplum();
  const config = medplum.getUserConfiguration();
  // const project = medplum.getProject();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  if (medplum.isLoading()) {
    return <Loading />;
  }

  return (
    <AppShell
      logo={<Logo size={24} />}
      pathname={location.pathname}
      searchParams={searchParams}
      version={MEDPLUM_VERSION}
      menus={userConfigToMenu(config)}
      displayAddBookmark={!!config?.id}
    >
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </AppShell>
  );
}

function renameLabel(originalName: string): string {
  const normalized = originalName.trim().replace(/s$/, '');
  switch (normalized) {
    case 'Organization':
      return 'Enterprise Workspace';
    case 'Patient':
      return 'Clients / Patients';
    case 'Practitioner':
      return 'Staff Directory';
    case 'DiagnosticReport':
      return 'Diagnostic Records';
    case 'Questionnaire':
      return 'Forms & Surveys';
    case 'Project':
      return 'Workspace Configs';
    case 'AccessPolicy':
      return 'Access Policies';
    case 'Subscription':
      return 'Webhooks & Events';
    case 'Observation':
      return 'Clinical Metrics';
    case 'Batch':
      return 'Bulk Processing';
    default:
      return originalName;
  }
}

function userConfigToMenu(config: UserConfiguration | undefined): NavbarMenu[] {
  const result =
    config?.menu?.map((menu) => ({
      title: menu.title === 'Favorites' ? 'Key Workspaces' : menu.title,
      links:
        menu.link?.map((link) => ({
          label: renameLabel(link.name ?? ''),
          href: link.target,
          icon: getIcon(link.target),
        })) || [],
    })) || [];

  result.push({
    title: 'Management',
    links: [
      {
        label: 'Security Controls',
        href: '/security',
        icon: <IconLock />,
      },
    ],
  });

  return result;
}

const resourceTypeToIcon: Record<string, FunctionComponent> = {
  Patient: IconStar,
  Practitioner: IconId,
  Organization: IconBuilding,
  ServiceRequest: IconReceipt,
  DiagnosticReport: IconReportMedical,
  Questionnaire: IconForms,
  Project: IconFolder,
  admin: IconBrandAsana,
  AccessPolicy: IconLockAccess,
  Subscription: IconWebhook,
  batch: IconPackages,
  Observation: IconMicroscope,
};

function getIcon(to: string): JSX.Element | undefined {
  if (to.includes('admin/super/db')) {
    return <IconDatabase />;
  }
  try {
    const resourceType = new URL(to, 'https://app.medplum.com').pathname.split('/')[1];
    if (resourceType in resourceTypeToIcon) {
      const Icon = resourceTypeToIcon[resourceType];
      return <Icon />;
    }
  } catch (_err) {
    // Ignore
  }
  return undefined;
}
