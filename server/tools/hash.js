/**
 * Created by tanghaomo on 15/5/8.
 */
var crypto = require('crypto');

var hash = function(password){
    var shasum = crypto.createHash('sha256');
    shasum.update(password);
    return shasum.digest('hex');
};

module.exports = hash;