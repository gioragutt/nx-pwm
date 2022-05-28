import { PackageJson } from 'nx/src/utils/package-json';

export interface PublishablePackageJson extends PackageJson {
  publishConfig: {
    access?: 'public' | 'restricted';
    registry?: string;
  };
}

export function isPublishablePackageJson(
  json: unknown
): json is PublishablePackageJson {
  const publishConfig = (json as PublishablePackageJson)?.publishConfig;
  return publishConfig && typeof publishConfig === 'object';
}
