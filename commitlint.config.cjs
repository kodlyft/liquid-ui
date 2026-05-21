/* eslint-env node */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // Build system changes
        'chore', // Maintenance, no production code change
        'ci', // CI configuration
        'docs', // Documentation only
        'feat', // New feature
        'fix', // Bug fix
        'perf', // Performance improvement
        'refactor', // Refactor without behavior change
        'revert', // Revert a previous commit
        'style', // Formatting, missing semicolons, etc.
        'test', // Adding or fixing tests
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 100],
  },
}
