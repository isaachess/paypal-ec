/*!
 * paypal-ec
 * Copyright(c) 2012 Mason Chang <mason@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A simple API wrapper for PayPal's Express Checkout
 */

var NVPRequest = require( './nvp-request' );
var url        = require( 'url' );

var SANDBOX_URL = 'www.sandbox.paypal.com';
var REGULAR_URL = 'www.paypal.com';
var API_METHODS = [
  'createRecurringPaymentsProfile',
  'doAuthorization',
  'doCapture',
  'doExpressCheckoutPayment',
  'doReauthorization',
  'doVoid',
  'getExpressCheckoutDetails',
  'getRecurringPaymentsProfileDetails',
  'manageRecurringPaymentsProfileStatus',
  'setExpressCheckout'
];

/**
 * Creates a new PayPalEC.
 * @class Represents a PayPal Express Checkout.
 * @requires nvprequest
 * @param {Object} cred Contain the credential required to make an API call
 * @param {Object} opts Contain the options like sandbox and version
 * @constructor
 */
var PayPalEC = function ( cred, opts ){
  this.nvpreq  = new NVPRequest( cred, opts );
  this.sandbox = opts ? opts.sandbox : false;
};

/**
 * Determine to use sandbox mode or not.
 * @public
 * @this {PayPalEC}
 * @param {Bool} bool Whether to use sandbox mode or not.
 */
PayPalEC.prototype.use_sandbox = function ( bool ){
  this.nvpreq.use_sandbox( bool );
  this.sandbox = ( bool === true );
};

/**
 * Make a payment url to PayPal based on the given token.
 * @public
 * @this {PayPalEC}
 * @param {String} token A token responsed from PayPal.
 */
PayPalEC.prototype.make_payment_url = function ( token ){
  return url.format({
    protocol : 'https:',
    host     : ( this.sandbox ) ? SANDBOX_URL : REGULAR_URL,
    pathname : '/cgi-bin/webscr',
    query    : {
      cmd   : '_express-checkout',
      token : token
    }
  });
};

API_METHODS.forEach( function ( method ){
  PayPalEC.prototype[ method ] = function ( params, callback ){
    this.nvpreq.execute( method, params, callback );
  };
});

/**
 * Make a `SetExpressCheckout` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain all the payment information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.set = function ( params, callback ){
  var self = this;

  this.nvpreq.execute( 'SetExpressCheckout', params, function ( err, data ){
    if( !err ){
      data.PAYMENTURL = self.make_payment_url( data.TOKEN );
    }

    callback( err, data );
  });
};

/**
 * Make a `GetExpressCheckoutDetails` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the token for the payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.get_details = PayPalEC.prototype[ 'getExpressCheckoutDetails' ];

/**
 * Make a `DoExpressCheckoutPayment` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the token and all the payment information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_payment = PayPalEC.prototype[ 'doExpressCheckoutPayment' ];

/**
 * Make a `DoCapture` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the authorization id and capture information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_capture = PayPalEC.prototype[ 'doCapture' ];

/**
 * Make a `DoAuthorization` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the transaction id and amt.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_authorization = PayPalEC.prototype[ 'doAuthorization' ];

/**
 * Make a `DoReauthorization` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the authorization id and amt.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_reauthorization = PayPalEC.prototype[ 'doReauthorization' ];

/**
 * Make a `DoVoid` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the authorization id and an optional note.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_void = PayPalEC.prototype[ 'doVoid' ];

/**
 * Make a `CreateRecurringPaymentsProfile` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the token and information of the recurring payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.create_rpp = PayPalEC.prototype[ 'createRecurringPaymentsProfile' ];

/**
 * Make a `GetRecurringPaymentsProfileDetails` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the PROFILEID of the recurring payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.get_rpp_details = PayPalEC.prototype[ 'getRecurringPaymentsProfileDetails' ];

/**
 * Make a `ManageRecurringPaymentsProfileStatus` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the PROFILEID of the recurring payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.manage_rpp_status = PayPalEC.prototype[ 'manageRecurringPaymentsProfileStatus' ];

module.exports = PayPalEC;


