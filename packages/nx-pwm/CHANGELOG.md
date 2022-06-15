# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

### [0.3.1](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.3.0...nx-pwm-0.3.1) (2022-06-15)

## [0.3.0](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.5...nx-pwm-0.3.0) (2022-06-13)

### Features

- **nx-pwm:** add check-lock-file command ([e7bf581](https://github.com/gioragutt/nx-pwm/commit/e7bf5817bfb21a65ccc6b5b15f90bdaef4ea87fb))
- **nx-pwm:** add the local-registry cli command ([dc8dba3](https://github.com/gioragutt/nx-pwm/commit/dc8dba332420b5d3390c645bbf79a836ba5f6478))
- **nx-pwm:** create a custom hasher for depcheck to take the config file into consideration ([98048db](https://github.com/gioragutt/nx-pwm/commit/98048dbffca26fb0f54c109ac9ba71897d82716f))

### Bug Fixes

- **nx-pwm:** remove local-registry migration should remove localRegistry as well ([43364c3](https://github.com/gioragutt/nx-pwm/commit/43364c368ea6ee5caefc652462e580e30b59888c))

### [0.2.5](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.4...nx-pwm-0.2.5) (2022-06-01)

### Bug Fixes

- **nx-pwm:** create a migration that removes the local-registry field from .nx-pwm.json ([20dbe26](https://github.com/gioragutt/nx-pwm/commit/20dbe26fd59ec132264258286bf09a9d20f626ec))
- **nx-pwm:** removed unexisting field from config file template ([b6c93d9](https://github.com/gioragutt/nx-pwm/commit/b6c93d955f4bdf085f6ddc9bbb8128cf82b179c9))

### [0.2.4](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.3...nx-pwm-0.2.4) (2022-06-01)

### Bug Fixes

- **nx-pwm:** config-schema.json was not included in the build ([8bc1316](https://github.com/gioragutt/nx-pwm/commit/8bc1316a45ffe3abd6675d34c2351ba6fca6f7d0))

### [0.2.3](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.2...nx-pwm-0.2.3) (2022-06-01)

### Bug Fixes

- **nx-pwm:** make vesion-check not fail by default if something is found ([b641660](https://github.com/gioragutt/nx-pwm/commit/b6416602a22e07acd700db9d2964481bf5aa19c1))

### [0.2.2](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.1...nx-pwm-0.2.2) (2022-06-01)

### Bug Fixes

- **nx-pwm:** improve error message when running commands without having a config file ([e5332ea](https://github.com/gioragutt/nx-pwm/commit/e5332ea7b5a126f9fda9e681cca2bb1eaababc18))

### [0.2.1](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.2.0...nx-pwm-0.2.1) (2022-06-01)

## [0.2.0](https://github.com/gioragutt/nx-pwm/compare/nx-pwm-0.1.0...nx-pwm-0.2.0) (2022-06-01)

### Features

- filter publishable projects in the depcheck plugin ([43dbd5a](https://github.com/gioragutt/nx-pwm/commit/43dbd5a81a3834c117976cc09aa2ec6ce3a6d4b7))
- **nx-pwm:** install generator ([#10](https://github.com/gioragutt/nx-pwm/issues/10)) ([64981e2](https://github.com/gioragutt/nx-pwm/commit/64981e2c0821dd7433be86a3abfc32dd95ec1001))
- **nx-pwm:** version-check executor ([#11](https://github.com/gioragutt/nx-pwm/issues/11)) ([62b3f60](https://github.com/gioragutt/nx-pwm/commit/62b3f60b360497b2011a5f6f71a2c5638ce02a3c))

### Bug Fixes

- **nx-pwm:** when updating migrations, ensure migrations are declared in package.json ([c4234b8](https://github.com/gioragutt/nx-pwm/commit/c4234b8957c7bfe5954d4e8c188edf48e9647a55))

## 0.1.0 (2022-05-25)

### Features

- **nx-pwm:** set up the nx-pwm project, with a depcheck executor ([#7](https://github.com/gioragutt/nx-pwm/issues/7)) ([83183c9](https://github.com/gioragutt/nx-pwm/commit/83183c9644d0c8b1ebae5f0192fa376dc2b7622c)), closes [#2](https://github.com/gioragutt/nx-pwm/issues/2)
