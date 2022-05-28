export interface VersionCheckExecutorSchema {
  checkPackageJson: boolean;
  checkVersionsFiles: boolean;
  updateMigrations: boolean;
}
