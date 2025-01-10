module.exports = {
  apps: [
    {
      name: 'nucleus-api-3000',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
