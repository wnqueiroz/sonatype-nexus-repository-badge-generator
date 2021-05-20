/**
 * @see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
 **/

module.exports = {
  types: [
    {
      type: 'feat',
      section: 'Features',
    },
    {
      type: 'fix',
      section: 'Bug Fixes',
    },
    {
      type: 'perf',
      hidden: true,
    },
    {
      type: 'chore',
      hidden: true,
    },
    {
      type: 'docs',
      hidden: true,
    },
    {
      type: 'style',
      hidden: true,
    },
    {
      type: 'refactor',
      hidden: true,
    },
    {
      type: 'test',
      hidden: true,
    },
  ],
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} [ci skip]',
};
