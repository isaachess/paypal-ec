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
  version : '92.0'
};

var plans = {
  normal : {
    returnUrl : 'http://localhost:3000/confirm?plan=normal',
    cancelUrl : 'http://localhost:3000/cancel',
    SOLUTIONTYPE                   : 'sole',
    PAYMENTREQUEST_0_AMT           : '10.00',
    PAYMENTREQUEST_0_DESC          : 'One-time Purchase',
    PAYMENTREQUEST_0_CURRENCYCODE  : 'USD',
    PAYMENTREQUEST_0_PAYMENTACTION : 'Sale'
  },

  recurring : {
    returnUrl : 'http://localhost:3000/confirm?plan=recurring',
    cancelUrl : 'http://localhost:3000/cancel',
    DESC                           : 'Recurring Payment',
    AMT                            : '0.99',
    CURRENCYCODE                   : 'USD',
    PROFILESTARTDATE               : '2012-08-01T03:00:00',
    L_BILLINGTYPE0                 : 'RecurringPayments',
    L_BILLINGAGREEMENTDESCRIPTION0 : 'Recurring Payment',
    BILLINGPERIOD                  : 'Month',
    BILLINGFREQUENCY               : '1'
  }
};

var ec = new PayPalEC( cred, opts );

app.get( '/plans', function ( req, res, next ){
  res.render( 'plans' );
});

app.post( '/checkout', function ( req, res, next ){
  var params = plans[ req.body.plan ];

  ec.set( params, function ( err, data ){
    if( err ) return next( err );

    res.redirect( data.PAYMENTURL );
  });
});

app.get( '/confirm', function ( req, res, next ){
  var plan   = req.query.plan;
  var params = plans[ plan ];

  params.TOKEN   = req.query.token;
  params.PAYERID = req.query.PayerID;

  if( plan == 'normal' ){
    ec.do_payment( params, function ( err, data ){
      if( err ) return next( err );

      res.redirect( '/status?token=' + params.TOKEN );
    });
  }else{
    ec.create_rpp( params, function ( err, data ){
      if( err ) return next( err );

      res.redirect( '/status?token=' + params.TOKEN );
    });
  }
});

app.get( '/cancel', function ( req, res, next ){
  res.redirect( '/status?token=' + req.query.token );
});

app.get( '/status', function ( req, res, next ){
  var token = req.query.token;

  ec.get_details({ token : token }, function ( err, data ){
    if( err ) return next( err );

    res.render( 'status', {
      title : 'Payment Status',
      data  : data
    });
  });
});

console.log( '\nServer started on http://localhost:3000\n' );
app.listen( 3000 );


