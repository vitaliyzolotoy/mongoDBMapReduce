var mongojs = require('mongojs');
var db = mongojs('mapReduceDB', ['lyricsData', 'example4_results']);

var mapper = function () {
    var words = this.sond.split(' ');
    for (i in words) {
        emit(words[i], 1);
    };
};

var reducer = function (key, values) {
    var count = 0;
    for (index in values) {
        count += values[index];
    };
    return count;
};

db.lyricsData.mapReduce(
    mapper,
    reducer,
    {
        out : "example4_results"
    }
)

db.example4_results.find(function (err, docs) {
    if(err) console.log(err);
    console.log(docs);
});
