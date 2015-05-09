/**
 * Created by tanghaomo on 15/5/8.
 */

var resErr = function(err, res){
    if (err){
        return {Error: err};
    }
    else if (res){
        if (!res.Error){
            res.Error = null;
        }
        return res;
    }
    else{
        return {Error: null};
    }
};

module.exports = resErr;