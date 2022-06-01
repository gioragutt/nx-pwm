export interface VersionCheckExecutorSchema {
  checkPackageJson: boolean;
  checkVersionsFiles: boolean;
  failIfChecksFail: boolean;
  updateMigrations: boolean;
  updateVersionsFiles: boolean;
}
