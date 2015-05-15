/**
 * Created by tanghaomo on 15/5/14.
 */

var mapInfo = [];

//Load MAP Information
var fs = require('fs');
for (var mid = 1; mid <= 5; mid++){
    mapInfo[mid] = JSON.parse(fs.readFileSync('../map/map_' + mid + '_item.json'));
}

module.exports = mapInfo;