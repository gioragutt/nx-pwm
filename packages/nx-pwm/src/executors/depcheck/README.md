# `depcheck` executor

This executor uses the `depcheck` module to scan a project's codebase and report any missing or invalid dependencies that should be in its `package.json`.

## Inputs

### `missing`

Check for missing dependencies

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `true`     |

### `discrepancies`

Check for version discrepancies between root and project dependencies

|   Type    | Required | Default Value |
| :-------: | :------: | :-----------: |
| `boolean` | `false`  |    `true`     |
