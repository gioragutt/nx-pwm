# Nx PWM

`nw-pwm` (short for NX Packages Workspace Manager) is a plugin/cli that aims to provide tools to manage publishable packages in an NX Workspace.

It works for workspaces with independently versioned libraries, and libraries that follow the same version.

# Why `nx-pwm` exists?

`nx-pwm` is highly inspired by tooling that exist in the [NX-repo](https://github.com/nrwl/nx) itself. As I've wanted to create NX Workspaces for publishable packages, I've looked into how NX itself handles this issue, and replicated it to several workspaces.

This worked, however it was not a scalable solution, as it required copy-pasta from one repo to another (with possible adjustments), and handling it required some more in-depth knowledge of NX, and the reasoning behind the tooling. This is not something I expect a colleague to easily fathom, as most do not have in-depth knowledge of NX.

I wanted to make the tooling accessible to anyone, and make it as easily usable and adjustable.
This is what `nx-pwm` is - it's an NX Plugin (Executors and Generators) and a CLI to make the aforementioned tooling easy to pick up and use, with as little knowledge of NX as possible.

# What is the workflow `nx-pwm` enables?

As mentioned before, `nx-pwm` comes to replicate (mostly) the workflow in the NX repo.
The NX repo is a workspace consisting of many plugin packages, the `nx` package itself, and `@nrwl/devkit`, alongside whatever testing machinery needed to test all that code.

## Library Versions Management

A primary concern for managing packages, especially in NX itself, is handling package.json dependencies versions, as well as library versions that plugins install and maintain in other NX workspaces.

For that, it employs 2 tools:

### 1. `depcheck` (the `nx-pwm:depcheck` executor)

Using the `depcheck` library, we ensure that libraries that a plugin uses are declared in `package.json`. This is especially needed in an NX workspace where dependencies exist in the workspace root, and will be available to projects without declaring them in their `package.json`.

This also ensures that the versions specified in a project's package.json matches the version specified in the root package.json (if specified) semver-wise.

### 2. `version-check` (the `nx-pwm:version-check` executor)

This utility helps ensure that library versions are both up-to-date, in both `package.json`, and `versions.ts` files.

It collects library versions from these files, and uses `npm view` to find newer available versions.

It also allows you to update the version files with the newer versions found, as well as create/update a migration in a plugin's `migration.json`.

#### What are `version.ts` files?

`versions.ts` files are a convention in NX plugins to maintain the versions strings to be used when generating or migrating projects. Such files export constants with a clear naming convention: `<libName>Version`, where `<libName>` is the library npm name camel-cased, for example:

```ts
// packages/my-plugin/src/utils/versions.ts
export const chalkVersion = '0.0.0';
export const nrwlNodeVersion = 'x.y.z'; // @nrwl/node -> nrwlNode
```

The `version-check` script scans such `version.ts` files, and collects the library names and their respective versions.

Given that convention, special casing needs to be done to properly convert a variable name to the correct npm package name, specifically for packages with scopes (`"nrwlNode" === "nrwl-node" or "@nrwl/node"?`).

## Local Registry (the `nx-pwm local-registry <cmd>` cli)

In some cases, to properly test our packages, we'd need to publish them to a package registry and use them in a test project, for example.

This can be done using a local registry, which you can run on your machine and point your package manager to work with.

The package registry used by the NX repo (and `nx-pwm`) is `verdaccio`.

`nx-pwm` provides CLI commands for the following actions:

```
nx-pwm local-registry <command>

local registry utilities

Commands:
  nx-pwm local-registry start    start local registry
  nx-pwm local-registry clear    clear local registry cache
  nx-pwm local-registry status   status of package managers registry configuration
  nx-pwm local-registry enable   enable local registry
  nx-pwm local-registry disable  disable local registry
```

### Lock File Check (the `nx-pwm check-lock-file <cmd>` cli)

As you use a local registry, references to it might end up in your workspace's package manager lock file (`package-lock.json/yarn.lock/pnpm-lock.yaml`).

To help prevent from local registry references ending up being pushed to your git remote, `nx-pwm` provides a command that validates that your lock file does not contain such references,
