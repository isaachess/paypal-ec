var https = require( 'https' );
var qs    = require( 'querystring' );

var SANDBOX_API = 'api-3t.sandbox.paypal.com';
var REGULAR_API = 'api-3t.paypal.com';

var NVPRequest = function ( cred, opts ){
  this.username  = cred.username;
  this.password  = cred.password;
  this.signature = cred.signature;

  this.sandbox = opts ? opts.sandbox : false;
  this.version = opts ? opts.version : '78.0';
};

// use paypal sandbox api
NVPRequest.prototype.use_sandbox = function ( bool ){
  this.sandbox = ( bool == true );
};

// set paypal api version
NVPRequest.prototype.set_version = function ( ver ){
  this.version = ver.toString();
};

// make a NVP request
NVPRequest.prototype.execute = function ( method, params, callback ){
  params.METHOD    = method;
  params.USER      = this.username;
  params.PWD       = this.password;
  params.SIGNATURE = this.signature;
  params.VERSION   = this.version;

  var body    = qs.stringify( params );
  var options = {
    host    : ( this.sandbox ) ? SANDBOX_API : REGULAR_API,
    path    : '/nvp',
    method  : 'POST',
    headers : {
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Content-Length' : body.length
    }
  };

  var req = https.request( options, function ( res ){
    var data = '';
    res.on( 'data', function ( buf ){
      data += buf.toString();
    });

    res.on( "end", function () {
      data = qs.parse( data );

      if( data.ACK.toString() != 'Success' ){
        return callback( new Error( data.L_LONGMESSAGE0 ));
      }

      callback( null, data );
    });
  });

  req.write( body );

  req.on( 'error', function ( err ){
    callback( err );
  });
};

module.exports = NVPRequest;


