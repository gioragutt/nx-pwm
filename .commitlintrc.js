/**
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'subject-empty': [0],
    // NOTE: uncomment this if you want to alter the scopes
    // 'scope-enum': async (ctx) => {
    //   const projects =
    //     require('@commitlint/config-nx-scopes').utils.getProjects(ctx);
    //   return [2, 'always', projects];
    // },
  },
  prompt: {
    settings: {
      enableMultipleScopes: true,
    },
  },
};
