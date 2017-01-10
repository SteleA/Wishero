process.env.test = 1111;
var expect  = require('chai').expect;
var request = require('supertest')
var app     = require('../../server/app.js');
var helper  = require('../../server/helpers.js');
var ctrl    = require('../../server/api/user/user.controller.js');
var User    = require('../../server/api/user/user.model.js');
var auth    = require('../../server/api/auth/auth.service');




describe('User endpoint', function () {


  var adminToken, userToken, userToken2, user;

  before(function(done) {
   User.remove({username:{$in:['test-admin','test-user','test-user2']}},done);
  })

  before(function(done) {
    User.create({
     username:'test-admin',
     password:'123',
     email:'test-admin@email.com',
     role:'admin'
   }, done);
  })

  after(function(done) {
   User.remove({username:{$in:['test-admin', 'test-user2']}},done);
  })


  describe('Login', function () {


    it('wrong user credentials,  should respond 401', function (done) {
      request(app)
      .post('/api/auth/local')
      .send({username: 'test-user', password: '113'})
      .expect('Content-Type', /json/)
      .expect(401)
      .end(done);
    })

    it('should respond 200', function (done) {
      request(app)
      .post('/api/auth/local')
      .send({username: 'test-admin', password: '123'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          adminToken = res.body.token;
          expect(res.body.token).to.exist;
          done();
        });
    })

  })

  describe('get all users', function () {

    it('unauthorized, should respond 401', function (done) {
      request(app)
      .get('/api/user')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('authorized, should respond an array of users', function (done) {
      request(app)
      .get('/api/user?access_token=' + adminToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          done();
        });
    })
  })

  describe('create a user', function () {

    it('should not create a user without email', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test1', password: '1', email:''})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should not create a user without username', function (done) {
      request(app)
      .post('/api/user')
      .send({username: '', password: '1', email:'test1@email.com'})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should not create a user without password', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test1', password: '', email:'test1@email.com'})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should not create a user with invalid email', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test1', password: '1', email:'312asdsa'})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should not create a user with existing email', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test1', password: '1', email:'test-admin@email.com'})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should not create a user with existing username', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test-admin', password: '1', email:'test1@email.com'})
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res){
          if (err) return done(err);
          done();
        });
    })

    it('should create a user', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test-user', password: '123', email:'test-user@email.com'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          expect(res.body.token).to.exist;
          userToken = res.body.token;
          done();
        });
    })

    it('should create a second user', function (done) {
      request(app)
      .post('/api/user')
      .send({username: 'test-user2', password: '123', email:'test-user2@email.com'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          expect(res.body.token).to.exist;
          userToken2 = res.body.token;
          done();
        });
    })

  })



  describe('forgot password', function () {
    it('should respond 200', function (done) {
      request(app)
      .get('/api/user/forgotpassword/test-user@email.com')
      .expect(200)
      .end(done)
    })
  })



  describe('get user json', function () {
    it('should respond 401', function (done) {
      request(app)
      .get('/api/user/profile/me')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(done)
    })
    it('should respond with user json', function (done) {
      request(app)
      .get('/api/user/profile/me?access_token=' + userToken)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res){
        expect(res.body).to.be.instanceof(Object);
        user = res.body;
        done()
      })
    })
  })

  describe('reset password', function () {
    it('should respond 400', function (done) {
      request(app)
      .post('/api/user/resetpassword')
      .send({resetToken: 'invalidToken', password: 1})
      .expect(400)
      .end(done)
    })
    it('should respond 200', function (done) {
      request(app)
      .post('/api/user/resetpassword')
      .send({resetToken: user.forgotPasswordToken, password: 1})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(done)
    })
  })

  describe('get user as another user', function () {
    it('should respond 200', function (done) {
      request(app)
      .get('/api/user/' + user._id + '?access_token=' + userToken2)
      .expect(200)
      .end(done)
    })
  })

  describe('change user settings', function () {
    it('should respond 500, email taken', function (done) {
      request(app)
      .put('/api/user/?access_token=' + userToken2)
      .send({username:'test-user2', password:'123', email:'test-user@email.com'})
      .expect(500)
      .end(done)
    })

    it('should respond 500, username taken', function (done) {
      request(app)
      .put('/api/user/?access_token=' + userToken2)
      .send({username:'test-user', password:'123', email:'test-user2@email.com'})
      .expect(500)
      .end(done)
    })

    it('should respond 500, too long username', function (done) {
      request(app)
      .put('/api/user/?access_token=' + userToken2)
      .send({username:'21mkldsamklkmdsakmsd', password:'11', email:'test-user2@email.com'})
      .expect(500)
      .end(done)
    })
    it('should respond 200', function (done) {
      request(app)
      .put('/api/user/?access_token=' + userToken2)
      .send({username:'test-user2', password:'1', email:'test-user2@email.com'})
      .expect(200)
      .end(done)
    })
  })


  describe('delete user', function () {
    it('should delete a user', function (done) {
      request(app)
      .delete('/api/user/' + user._id + '?access_token=' + adminToken)
      .expect(204)
      .end(done)
    })
  })

})
