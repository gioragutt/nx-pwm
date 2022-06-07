# `version-check` executor

This executor checks for newer versions of libraries used in a project's package.json and in plugins versions.ts files

## Inputs

### `checkPackageJson`

Check for versions to bump in package.json

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `true`     |

### `checkVersionsFiles`

Check for versions to bump in versions.ts files

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `true`     |

### `failIfChecksFail`

Fail if any of the checks fail

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `false`    |

### `updateMigrations`

Create or update the migrations.json

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `false`    |

### `updateVersionsFiles`

Update checked versions files with newer versions

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `false`    |
