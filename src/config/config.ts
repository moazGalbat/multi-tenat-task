const config = {
  security: {
    expiresIn: '10m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default () => config;
