export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  kinde: {
    issuerUrl: process.env.KINDE_ISSUER_URL,
  },
});
