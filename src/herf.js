var cheerio = require("cheerio");
var server = require("./curl");

var url = "https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-unit-testing-with-mocha-and-chai"
// var url = "https://egghead.io/api/v1/lessons/javascript-how-to-write-a-javascript-library-unit-testing-with-mocha-and-chai/next_up"


server.download(url, function(data) {
  if (data) {

    var $ = cheerio.load(data);
    $(".up-next-list-item").each(function(i, e) {
        let href = $(e).attr("href");

        if(href && href.indexOf('egghead.io') > 0){
          console.log($(e).attr("href"));
        }

    });

    console.log("done");
  } else {
      console.log("error");
  }
});
