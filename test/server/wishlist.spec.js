process.env.test = 1111;
var expect  = require('chai').expect;
var request = require('supertest')
var app     = require('../../server/app.js');
var helper  = require('../../server/helpers.js');
var ctrl    = require('../../server/api/user/user.controller.js');
var User    = require('../../server/api/user/user.model.js');
var Wishlist    = require('../../server/api/wishlist/wishlist.model.js');
var auth        = require('../../server/api/auth/auth.service');




describe('Wishlist endpoint', function () {


  var adminToken, user, wishlist, wishlistItem;

  before(function(done) {
   User.remove({username:'test-admin'},done);
  })

  before(function(done) {
    user = new User({
     username:'test-admin',
     password:'123',
     email:'test-admin@email.com',
     role:'admin'
   })
    user.save(done)
  })

  after(function(done) {
   User.remove({username:{$in:['test-admin']}},done);
  })
  after(function(done) {
   Wishlist.remove({userId:{$in:[user._id]}},done);
  })


  describe('Login', function () {

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

  describe('Create wishlist', function () {

    it('should respond 201', function (done) {
      request(app)
      .post('/api/wishlist?access_token=' + adminToken)
      .send({name: 'test-wishlist', public: true, userId: 'test-admin'})
      .expect(201)
      .end(done)
    })

  })

  describe('Get wishlists', function () {

    it('should respond 200', function (done) {
      request(app)
      .get('/api/wishlist?access_token=' + adminToken)
      .expect(200)
      .end(function(err, res){
        wishlist = res.body[0];
        done()
      })
    })

  })

  describe('Get wishlist', function () {

    it('should respond 200', function (done) {
      request(app)
      .get('/api/wishlist/' + wishlist._id + '?access_token=' + adminToken)
      .expect(200)
      .end(done)
    })

  })

  describe('Update wishlist', function () {

    it('should respond 200', function (done) {
      request(app)
      .put('/api/wishlist/' + wishlist._id + '?access_token=' + adminToken)
      .send({name: 'test'})
      .expect(200)
      .end(function(err, res){
        expect(res.body.name).to.equal('test');
        done();
      })
    })

  })

  describe('Create wishlist item', function () {

    it('should respond 201', function (done) {
      request(app)
      .post('/api/wishlist/' + wishlist._id + '?access_token=' + adminToken)
      .send({name: 'test-wishlist item', url: 'www.test.com', desc: 'test desc'})
      .expect(201)
      .end(function(err, res){
        wishlistItem = res.body;
        done();
      })
    })

  })

  describe('Get wishlist item', function () {

    it('should respond 200', function (done) {
      request(app)
      .get('/api/wishlist/item/' + wishlistItem.id + '?access_token=' + adminToken)
      .expect(200)
      .end(done)
    })

  })

  describe('Update wishlist item', function () {

    it('should respond 200', function (done) {
      request(app)
      .put('/api/wishlist/item/' + wishlistItem.id + '?access_token=' + adminToken)
      .send({name: 'test-wishlist item change', url: 'www.testchange.com', desc: 'test desc change'})
      .expect(200)
      .end(done)
    })

  })

  describe('Delete wishlist item', function () {

    it('should respond 204', function (done) {
      request(app)
      .delete('/api/wishlist/item/' + wishlistItem.id + '?access_token=' + adminToken)
      .send({name: 'test-wishlist item change', url: 'www.testchange.com', desc: 'test desc change'})
      .expect(204)
      .end(done)
    })

  })

  describe('Delete wishlist', function () {

    it('should respond 204', function (done) {
      request(app)
      .delete('/api/wishlist/' + wishlist._id + '?access_token=' + adminToken)
      .expect(204)
      .end(done)
    })

  })




})
