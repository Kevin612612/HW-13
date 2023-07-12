export const jwtConstants = {
  secret: '12345678',
  secretFromEnv: process.env.JWT_SECRET, // not working
  ACCESS_TOKEN_LIFE_TIME : '30000s',
  REFRESH_TOKEN_LIFE_TIME : '60000s',
};
