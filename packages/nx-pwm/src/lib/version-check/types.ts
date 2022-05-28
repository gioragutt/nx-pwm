import { NxPwmConfig } from '../config';

export type NormalizedVersionCheckOptions = {
  [K in keyof NxPwmConfig['versionCheck']]: Required<
    NxPwmConfig['versionCheck'][K]
  >;
};

export type VersionsFilesCheckConfig =
  NormalizedVersionCheckOptions['versionsFiles'];
