const request = require( 'request' );
const fs = require( 'fs' );
const path = require( 'path' );
const http = require( "http" );

let dir = process.cwd();
let txtDir = path.join( dir, '/egghead' );
let txtFiles = fs.readdirSync( txtDir );

let mediaurlList = [];

txtFiles.filter( file => file === 'RxjsMistake.txt' ).map( file => {
  fs.readFile( `${dir}/egghead/${file}`, {
    encoding: 'utf-8'
  }, function ( err, data ) {
    if ( err ) throw new Error( err.message );

    let urlList = data.split( '\r\n' );
    mediaurlList = urlList.filter( Boolean ).reduce( ( p, n, index ) => {
      let temp = {};
      temp.mediaurl = n;
      temp.name = `egghead-${index + 1}-${n.slice( n.lastIndexOf( '/' ) + 1 )}`;
      p.push( temp );
      return p;
    }, [] );

    mediaurlList.map( list => {
      request.post( {
        url: 'http://www.clipconverter.cc/check.php',
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        form: {
          mediaurl: list.mediaurl
        }
      }, ( err, httpResponse, body ) => {
        const data = JSON.parse( body );
        if ( data && data.url ) {
          let item = data.url[ 0 ];
          startDownloadTask( item.url, './', list.name );
        }
      } );
    } )
  } )
} )

function getHttpReqCallback ( dirName, fileName ) {
  var fileName = `${fileName}.mp4`;
  var callback = function ( res ) {
    var fileBuff = [];
    res.on( 'data', function ( chunk ) {
      var buffer = new Buffer( chunk );
      fileBuff.push( buffer );
    } );
    res.on( 'end', function () {
      var totalBuff = Buffer.concat( fileBuff );
      fs.appendFile( dirName + "/" + fileName, totalBuff, function ( err ) {} );
    } );
  };
  return callback;
}

function startDownloadTask ( src, dirName, fileName ) {
  var req = http.request( src, getHttpReqCallback( dirName, fileName ) );
  req.on( 'error', function ( e ) {} );
  req.end();
}