module.exports = {
  '*.ts': [
    'eslint --fix',
    'prettier --write',
    'npm run test -- --findRelatedTests',
  ],
};
