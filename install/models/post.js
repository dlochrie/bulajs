var Base = require('./base');


/**
 * Expose `Post` Model
 */
module.exports = Post;



/**
 * Post model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} opt_resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function Post(app, opt_resource) {
  this.app = app;
  this.resource = opt_resource || null;
  this.db = app.db;
  Base.call(this);
}
require('util').inherits(Post, Base);


/**
 * Table name.
 * @const
 * @private {string}
 */
Post.TABLE_ = 'post';


/**
 * User's table name.
 * @const
 * @private {string}
 */
Post.USERS_TABLE_ = 'user';


/**
 * MySQL Query Strings.
 *
 * TODO: You might want some MORE specific queries here for articles, etc -
 * you don't need all the fields...
 *
 * @private
 * @enum {string}
 */
Post.QUERIES_ = {
  find: 'SELECT `post`.*, ' +
      '`' + Post.USERS_TABLE_ + '`.`displayName` as `author` ' +
      'FROM `' + Post.TABLE_ + '` ' +
      'LEFT JOIN `' + Post.USERS_TABLE_ + '` ' +
      'ON `' + Post.TABLE_ + '`.`user_id` = `' + Post.USERS_TABLE_ + '`.`id` ' +
      'WHERE ?',
  findOne: 'SELECT `post`.*, ' +
      '`' + Post.USERS_TABLE_ + '`.`displayName` as `author` ' +
      'FROM `' + Post.TABLE_ + '` ' +
      'LEFT JOIN `' + Post.USERS_TABLE_ + '` ' +
      'ON `' + Post.TABLE_ + '`.`user_id` = `' + Post.USERS_TABLE_ + '`.`id` ' +
      'WHERE ? ' +
      'LIMIT 1',
  insert: 'INSERT INTO `' + Post.TABLE_ + '` SET ?',
  update: 'UPDATE `' + Post.TABLE_ + '` SET ? WHERE ?',
  remove: 'DELETE FROM `' + Post.TABLE_ + '` WHERE ? LIMIT 1'
};


/**
 * Table strucure. Describes field types and validation properties.
 * @private
 * @enum {string}
 */
Post.STRUCTURE_ = {
  id: {type: Number, required: false},
  user_id: {type: Number, length: 10, required: true},
  title: {type: String, length: 255, required: true},
  slug: {type: String, length: 255, required: true},
  description: {type: 'Text', required: true},
  description_md: {type: 'Text', required: true},
  body: {type: 'Text', required: true},
  body_md: {type: 'Text', required: true},
  created: {type: Number, required: false, default: new Date().getTime()},
  updated: {type: Number, required: true, default: new Date().getTime()}
};


/**
 * Gets the named query, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
Post.prototype.getQuery = function(action) {
  if (action) {
    return Post.QUERIES_[action];
  } else {
    return Post.QUERIES_;
  }
};


/**
 * Gets the current model's structure.
 * @return {Object} structure object.
 */
Post.prototype.getStructure = function() {
  return Post.STRUCTURE_;
};


/**
 * Gets the table name for the current model.
 * @return {string} table name.
 */
Post.prototype.getTable = function() {
  return Post.TABLE_;
};
