// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Select } from '@mantine/core';
import type { ResourceType } from '@medplum/fhirtypes';
import type { JSX } from 'react';
import { useCallback, useMemo, useState } from 'react';

export interface ResourceTypeInputProps {
  readonly name: string;
  readonly placeholder?: string;
  readonly defaultValue?: ResourceType;
  readonly autoFocus?: boolean;
  readonly testId?: string;
  readonly maxValues?: number;
  readonly onChange?: (value: ResourceType | undefined) => void;
  readonly disabled?: boolean;
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
    case 'ServiceRequest':
      return 'Service Requests';
    default:
      return originalName;
  }
}

const allResourceTypes: string[] = [
  'Account', 'ActivityDefinition', 'AdverseEvent', 'AllergyIntolerance', 'Appointment', 'AppointmentResponse',
  'AuditEvent', 'Basic', 'Binary', 'BiologicallyDerivedProduct', 'BodyStructure', 'Bundle', 'CapabilityStatement',
  'CarePlan', 'CareTeam', 'CatalogEntry', 'ChargeItem', 'ChargeItemDefinition', 'Claim', 'ClaimResponse',
  'ClinicalImpression', 'CodeSystem', 'Communication', 'CommunicationRequest', 'CompartmentDefinition', 'Composition',
  'ConceptMap', 'Condition', 'Consent', 'Contract', 'Coverage', 'CoverageEligibilityRequest', 'CoverageEligibilityResponse',
  'DetectedIssue', 'Device', 'DeviceDefinition', 'DeviceMetric', 'DeviceRequest', 'DeviceUseStatement', 'DiagnosticReport',
  'DocumentManifest', 'DocumentReference', 'EffectEvidenceSynthesis', 'Encounter', 'Endpoint', 'EnrollmentRequest',
  'EnrollmentResponse', 'EpisodeOfCare', 'EventDefinition', 'Evidence', 'EvidenceVariable', 'ExampleScenario',
  'ExplanationOfBenefit', 'FamilyMemberHistory', 'Flag', 'Goal', 'GraphDefinition', 'Group', 'GuidanceResponse',
  'HealthcareService', 'ImagingStudy', 'Immunization', 'ImmunizationEvaluation', 'ImmunizationRecommendation',
  'ImplementationGuide', 'InsurancePlan', 'Invoice', 'Library', 'Linkage', 'List', 'Location', 'Measure', 'MeasureReport',
  'Media', 'Medication', 'MedicationAdministration', 'MedicationDispense', 'MedicationKnowledge', 'MedicationRequest',
  'MedicationStatement', 'MedicinalProduct', 'MedicinalProductAuthorization', 'MedicinalProductContraindication',
  'MedicinalProductIndication', 'MedicinalProductIngredient', 'MedicinalProductInteraction', 'MedicinalProductManufactured',
  'MedicinalProductPackaged', 'MedicinalProductPharmaceutical', 'MedicinalProductUndesirableEffect', 'MessageDefinition',
  'MessageHeader', 'MolecularSequence', 'NamingSystem', 'NutritionOrder', 'Observation', 'ObservationDefinition',
  'OperationDefinition', 'OperationOutcome', 'Organization', 'OrganizationAffiliation', 'Patient', 'PaymentNotice',
  'PaymentReconciliation', 'Person', 'PlanDefinition', 'Practitioner', 'PractitionerRole', 'Procedure', 'Provenance',
  'Questionnaire', 'QuestionnaireResponse', 'Queue', 'RelatedPerson', 'RequestGroup', 'ResearchDefinition',
  'ResearchElementDefinition', 'ResearchStudy', 'ResearchSubject', 'RiskAssessment', 'RiskEvidenceSynthesis',
  'Schedule', 'SearchParameter', 'ServiceRequest', 'Slot', 'Specimen', 'SpecimenDefinition', 'StructureDefinition',
  'StructureMap', 'Subscription', 'Substance', 'SubstanceNucleicAcid', 'SubstancePolymer', 'SubstanceProtein',
  'SubstanceReferenceInformation', 'SubstanceSourceMaterial', 'SubstanceSpecification', 'SupplyDelivery', 'SupplyRequest',
  'Task', 'TerminologyCapabilities', 'TestReport', 'TestScript', 'User', 'UserConfiguration', 'ValueSet', 'VerificationResult',
  'VisionPrescription'
];

export function ResourceTypeInput(props: ResourceTypeInputProps): JSX.Element {
  const [resourceType, setResourceType] = useState(props.defaultValue);
  const onChange = props.onChange;

  const data = useMemo(() => {
    return allResourceTypes
      .map((rt) => ({
        value: rt,
        label: renameLabel(rt),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const handleChange = useCallback(
    (newValue: string | null) => {
      const val = (newValue || undefined) as ResourceType | undefined;
      setResourceType(val);
      if (onChange) {
        onChange(val);
      }
    },
    [onChange]
  );

  const filter = useCallback(
    ({ options, search }: { options: any[]; search: string }) => {
      const query = search.trim().toLowerCase();
      return options.filter((option) => {
        const label = option.label?.toLowerCase() ?? '';
        const value = option.value?.toLowerCase() ?? '';
        return label.includes(query) || value.includes(query);
      });
    },
    []
  );

  return (
    <Select
      disabled={props.disabled}
      autoFocus={props.autoFocus}
      data-testid={props.testId}
      value={resourceType || null}
      onChange={handleChange}
      name={props.name}
      placeholder={props.placeholder}
      data={data}
      searchable
      filter={filter}
      nothingFoundMessage="No resource types found"
    />
  );
}
