export const jwtConstants = {
  secret: '12345678',
  secretFromEnv: process.env.JWT_SECRET, // not working
  ACCESS_TOKEN_LIFE_TIME : '10000s',
  REFRESH_TOKEN_LIFE_TIME : '20000s',
};
