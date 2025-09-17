export const environment = {
  production: true,
  apiUrl: 'https://recipe-manager-m2th.onrender.com',
  demoMode: !!(
    process.env['NG_APP_DEMO_MODE'] &&
    process.env['NG_APP_DEMO_MODE'] === 'true'
  ),
};
