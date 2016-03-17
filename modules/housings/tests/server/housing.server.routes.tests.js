'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Housing = mongoose.model('Housing'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, housing;

/**
 * Housing routes tests
 */
describe('Housing CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Housing
    user.save(function () {
      housing = {
        name: 'Housing name'
      };

      done();
    });
  });

  it('should be able to save a Housing if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Housing
        agent.post('/api/housings')
          .send(housing)
          .expect(200)
          .end(function (housingSaveErr, housingSaveRes) {
            // Handle Housing save error
            if (housingSaveErr) {
              return done(housingSaveErr);
            }

            // Get a list of Housings
            agent.get('/api/housings')
              .end(function (housingsGetErr, housingsGetRes) {
                // Handle Housing save error
                if (housingsGetErr) {
                  return done(housingsGetErr);
                }

                // Get Housings list
                var housings = housingsGetRes.body;

                // Set assertions
                (housings[0].user._id).should.equal(userId);
                (housings[0].name).should.match('Housing name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Housing if not logged in', function (done) {
    agent.post('/api/housings')
      .send(housing)
      .expect(403)
      .end(function (housingSaveErr, housingSaveRes) {
        // Call the assertion callback
        done(housingSaveErr);
      });
  });

  it('should not be able to save an Housing if no name is provided', function (done) {
    // Invalidate name field
    housing.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Housing
        agent.post('/api/housings')
          .send(housing)
          .expect(400)
          .end(function (housingSaveErr, housingSaveRes) {
            // Set message assertion
            (housingSaveRes.body.message).should.match('Please fill Housing name');

            // Handle Housing save error
            done(housingSaveErr);
          });
      });
  });

  it('should be able to update an Housing if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Housing
        agent.post('/api/housings')
          .send(housing)
          .expect(200)
          .end(function (housingSaveErr, housingSaveRes) {
            // Handle Housing save error
            if (housingSaveErr) {
              return done(housingSaveErr);
            }

            // Update Housing name
            housing.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Housing
            agent.put('/api/housings/' + housingSaveRes.body._id)
              .send(housing)
              .expect(200)
              .end(function (housingUpdateErr, housingUpdateRes) {
                // Handle Housing update error
                if (housingUpdateErr) {
                  return done(housingUpdateErr);
                }

                // Set assertions
                (housingUpdateRes.body._id).should.equal(housingSaveRes.body._id);
                (housingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Housings if not signed in', function (done) {
    // Create new Housing model instance
    var housingObj = new Housing(housing);

    // Save the housing
    housingObj.save(function () {
      // Request Housings
      request(app).get('/api/housings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Housing if not signed in', function (done) {
    // Create new Housing model instance
    var housingObj = new Housing(housing);

    // Save the Housing
    housingObj.save(function () {
      request(app).get('/api/housings/' + housingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', housing.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Housing with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/housings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Housing is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Housing which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Housing
    request(app).get('/api/housings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Housing with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Housing if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Housing
        agent.post('/api/housings')
          .send(housing)
          .expect(200)
          .end(function (housingSaveErr, housingSaveRes) {
            // Handle Housing save error
            if (housingSaveErr) {
              return done(housingSaveErr);
            }

            // Delete an existing Housing
            agent.delete('/api/housings/' + housingSaveRes.body._id)
              .send(housing)
              .expect(200)
              .end(function (housingDeleteErr, housingDeleteRes) {
                // Handle housing error error
                if (housingDeleteErr) {
                  return done(housingDeleteErr);
                }

                // Set assertions
                (housingDeleteRes.body._id).should.equal(housingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Housing if not signed in', function (done) {
    // Set Housing user
    housing.user = user;

    // Create new Housing model instance
    var housingObj = new Housing(housing);

    // Save the Housing
    housingObj.save(function () {
      // Try deleting Housing
      request(app).delete('/api/housings/' + housingObj._id)
        .expect(403)
        .end(function (housingDeleteErr, housingDeleteRes) {
          // Set message assertion
          (housingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Housing error error
          done(housingDeleteErr);
        });

    });
  });

  it('should be able to get a single Housing that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Housing
          agent.post('/api/housings')
            .send(housing)
            .expect(200)
            .end(function (housingSaveErr, housingSaveRes) {
              // Handle Housing save error
              if (housingSaveErr) {
                return done(housingSaveErr);
              }

              // Set assertions on new Housing
              (housingSaveRes.body.name).should.equal(housing.name);
              should.exist(housingSaveRes.body.user);
              should.equal(housingSaveRes.body.user._id, orphanId);

              // force the Housing to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Housing
                    agent.get('/api/housings/' + housingSaveRes.body._id)
                      .expect(200)
                      .end(function (housingInfoErr, housingInfoRes) {
                        // Handle Housing error
                        if (housingInfoErr) {
                          return done(housingInfoErr);
                        }

                        // Set assertions
                        (housingInfoRes.body._id).should.equal(housingSaveRes.body._id);
                        (housingInfoRes.body.name).should.equal(housing.name);
                        should.equal(housingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Housing.remove().exec(done);
    });
  });
});
