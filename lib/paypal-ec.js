var NVPRequest = require( './nvprequest' );
var url        = require( 'url' );

var SANDBOX_URL = 'www.sandbox.paypal.com';
var REGULAR_URL = 'www.paypal.com';


var PayPalEC = function ( cred, opts ){
  this.nvpreq  = new NVPRequest( cred, opts );
  this.sandbox = false;
};

// use paypal sandbox
PayPalEC.prototype.use_sandbox = function( bool ){
  this.nvpreq.use_sandbox( bool );
  this.sandbox = ( bool == true );
};

PayPalEC.prototype.set = function ( params, callback ){
  var self = this;

  this.nvpreq.execute( 'setExpressCheckout', params, function ( err, data ){
    if( data ){
      data[ 'PAYMENTURL' ] = url.format({
        protocol : 'https:',
        host     : ( self.sandbox ) ? SANDBOX_URL : REGULAR_URL,
        pathname : '/cgi-bin/webscr',
        query    : {
          cmd   : '_express-checkout',
          token : data[ 'TOKEN' ]
        }
      });
    }

    callback( err, data );
  });
};

PayPalEC.prototype.get_details = function ( params, callback ){
  this.nvpreq.execute( 'getExpressCheckoutDetails', params, callback );
};

PayPalEC.prototype.do_payment = function ( params, callback ){
  this.nvpreq.execute( 'doExpressCheckoutPayment', params, callback );
};

module.exports = PayPalEC;


