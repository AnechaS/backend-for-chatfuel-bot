module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest',
      port: 27001,
    },
    binary: {
      version: '4.0.14',
      skipMD5: true
    },
    autoStart: false
  }
};