var http = require('http');
var cheerio = require('cheerio');
var mongojs = require('mongojs');
var db = mongojs('mapReduceDB', ['lyricsData']);

function download(url, callback) {
    http.get(url, function(res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(data);
        });
    }).on('error', function() {
        callback(null);
    });
}

for (var i = 1; i <= 567; i++) {
    var url = 'http://spivanyk.org/uk/all-songs.' + i + '.html';
    download(url, function(data) {
        if (data) {
            var $ = cheerio.load(data);
            $('div.link_list > a').each(function(i, e) {
                var lyric = {};
                lyric['sond'] = $(e).text();
                lyric['artist'] = $(e).next().find('a').text();
                lyric['url'] = 'http://spivanyk.org' + $(e).attr('href');
                download(lyric.url, function(data) {
                    if (data) {
                        var $ = cheerio.load(data);
                        lyric['text'] = $('p.lyricsText').text();
                        db.lyricsData.save(lyric, function (err, doc) {
                            console.log(doc);
                            console.log("DB Insert Completed");
                        });
                    }
                    else console.log('error');  
                });
            });
        }
        else console.log('error');  
    });
};

// db.lyricsData.find(function(err, docs) {
//     docs.map(function(item) {
//         download(item.url, function(data) {
//             if (data) {
//                 var $ = cheerio.load(data);
//                 var text = $('p.lyricsText').text();
//                 db.lyricsData.findAndModify({
//                     query: { _id: item._id },
//                     update: { $set: { text:item.text } },
//                     new: true
//                 }, function(err, doc, lastErrorObject) {
//                     console.log(doc);
//                     console.log("DB Update Completed");
//                 });
//             }
//             else console.log('error');  
//         });
//     });
// }).sort({ "_id": 1}).skip(0).limit(99999);
