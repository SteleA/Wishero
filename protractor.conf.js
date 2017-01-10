exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'mocha',
  specs: [
    'test/e2e/**/*.spec.js'
  ],
  mochaOpts: {
    enableTimeouts: false
  },
  capabilities: {
    'browserName': 'chrome',
  },
  onPrepare: function () {
    process.env.test = 9000
    require('./server/app')
  }
}
