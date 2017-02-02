const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://192.168.99.100:32768/mern-starter',
  port: process.env.PORT || 8080,
};

export default config;
