var PayPalEC = require( '../lib/paypal-ec' );
var express  = require( 'express' );
var util     = require( 'util' );

var app = express.createServer();

app.configure( function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.methodOverride());
  app.use( express.bodyParser());
  app.use( app.router );
  app.use( express.errorHandler({
    dumpExceptions : true,
    showStack      : true
  }));
});

app.helpers({
  inspect : util.inspect
});

var cred = {
  username  : 'seller_1340340556_biz_api1.dreamerslab.com',
  password  : '1340340580',
  signature : 'AFcWxV21C7fd0v3bYYYRCpSSRl31AvaaLJ2YPkTImMsYibPi60jMly6j'
};

var opts = {
  sandbox : true,
  version : '88.0'
};

var item = {
  returnUrl : 'http://localhost:3000/confirm',
  cancelUrl : 'http://localhost:3000/cancel',
  SOLUTIONTYPE                   : 'sole',
  PAYMENTREQUEST_0_AMT           : '10.0',
  PAYMENTREQUEST_0_DESC          : 'Something',
  PAYMENTREQUEST_0_CURRENCYCODE  : 'USD',
  PAYMENTREQUEST_0_PAYMENTACTION : 'Sale'
};

var ec = new PayPalEC( cred, opts );

app.get( '/checkout', function ( req, res, next ){
  var params = item;

  ec.set( params, function ( err, data ){
    if( err ) return next( err );

    res.render( 'checkout', {
      title : 'Payment Checkout',
      data  : data
    });
  });
});

app.get( '/confirm', function ( req, res, next ){
  var params = {
    TOKEN : req.query.token
  };

  ec.get_details( params, function ( err, data ){
    if( err ) return next( err );

    res.render( 'confirm', {
      title : 'Payment Confirmation',
      data  : data
    });
  });
});

app.get( '/complete', function ( req, res, next ){
  var params = item;

  params.TOKEN   = req.query.token;
  params.PAYERID = req.query.PayerID;

  ec.do_payment( params, function ( err, data ){
    if( err ) return next( err );

    res.render( 'complete', {
      title : 'Payment Completed'
    });
  });
});

app.get( '/cancel', function ( req, res, next ){
  res.render( 'cancel', {
    title : 'Payment Cancelled'
  });
});

console.log( 'Server started on http://localhost:3000' );
app.listen( 3000 );


