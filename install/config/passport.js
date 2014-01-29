/**
 * Base Authentication Module
 */
module.exports = function(app) {
  var passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy,
    rootPath = app.get('ROOT PATH'),
    rootUrl = app.get('ROOT URL'),
    User = require(rootPath + 'app/models/user');


  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Google profile is serialized
  //   and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });


  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  /**
   * Use the Google OpenId Strategy within Passport.
   */
  passport.use(new GoogleStrategy({
    returnURL: rootUrl + 'auth/google/return',
    realm: rootUrl
  },
  function(identifier, profile, done) {
    var resource = {
      displayName: profile.displayName,
      google_id: identifier,
      email: profile.emails[0].value
    };
    // TODO: DON'T DO THIS: THIS LOGIC SHOULD BE IN A USER MODEL
    app.db.collection('user').
        findOne({email: resource.email}, function(err, user) {
          if (err) throw err;
          if (user) return done(null, user);
          app.db.collection('user').insert(resource, function(err, result) {
            if (err) throw err;
            console.log('User not found, adding user');
            result = (result) ? result[0] : null;
            if (!result || err) {
              return done('There was an error creating the User: ' +
                  err || 'N/A', null);
            }
            return done(null, result);
          });
        });
  }));


  /**
   * Authenticate the User against the Google OpenId API.
   */
   app.get('/auth/google', passport.authenticate('google'));


  /**
   * Handle the Response from the Google OpenId API.
   */
   app.get('/auth/google/return', passport.authenticate('google', {
        failureFlash: true,
        failureRedirect: '/login'
      }), function(req, res) {
        var session = req.session;
        if (session.passport.user) {
          session.logged_in = true;
        }
        res.redirect('/');
      });


  /**
   * Log the user completely out.
   * Regenerate a new session and set `logged_in` to false.
   */
   app.get('/logout', function(req, res) {
    var session = req.session;
    session.logged_in = false;
    req.logOut();
    if (!session || !session.regenerate) return res.redirect('/');
    session.regenerate(function(err) {
      res.redirect('/');
    });
  });
 };
