/**
 * Created by tanghaomo on 15/5/9.
 */
var mongojs = require('mongojs');
var db = mongojs('pacman');
var users = db.collection('users');

module.exports = users;