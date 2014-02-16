var Util = require('../util');
var User = require('../../models/user');


/**
 * Expose `AdminUsers` Controller.
 */
module.exports = new AdminUsers;



/**
 * AdminUsers Controller.
 * @constructor
 */
function AdminUsers() {}


/**
 * Path to users index page.
 * @private {string}
 * @const
 */
AdminUsers.INDEX_VIEW_ = 'admin/users/';


/**
 * Path to users create view.
 * @private {string}
 * @const
 */
AdminUsers.CREATE_VIEW_ = 'admin/users/new';


/**
 * Path to users edit view.
 * @private {string}
 * @const
 */
AdminUsers.UPDATE_VIEW_ = 'admin/users/edit';


/**
 * Path to users delete view.
 * @private {string}
 * @const
 */
AdminUsers.DELETE_VIEW_ = 'admin/users/delete';


/**
 * Renders users' admin index page - lists all users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.index = function(req, res) {
  var user = new User(req.app);
  var params = req.body;
  user.find(params, function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the users: ' + err);
      res.redirect('/admin');
    } else {
      res.render(AdminUsers.INDEX_VIEW_, {
        title: 'Users Administration',
        results: results
      });
    }
  });
};


/**
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.edit = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;

  user.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render('admin/users/edit', {
        title: 'Edit User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Updates the user.
 * Note: The Slug SHOULD NOT be modified here so that bookmarks are persisted.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.update = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user,
      params = req.body;

  params.body_md = Util.sanitize(params.body);
  params.description_md = Util.sanitize(params.description);
  params.updated = Util.getDate();

  user.update({slug: slug}, params, function(err) {
    if (err) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect('/admin/users/' + slug + '/edit');
    } else {
      req.flash('success', 'User Successfully Updated');
      res.redirect(AdminUsers.INDEX_VIEW_);
    }
  });
};


/**
 * Renders the delete form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.delete = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;
  user.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error deleting the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render('admin/users/delete', {
        title: 'Delete User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Attempts to delete the resource and displays success or failure.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.destroy = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;
  user.remove({slug: slug}, function(err) {
    if (err) {
      req.flash('error', 'There was an error deleting the user: ' + err);
    } else {
      req.flash('info', 'User Successfully Deleted.');
    }
    res.redirect(AdminUsers.INDEX_VIEW_);
  });
};