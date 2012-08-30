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
PayPalEC.prototype.get_details = function ( params, callback ){
  this.nvpreq.execute( 'GetExpressCheckoutDetails', params, callback );
};

/**
 * Make a `DoExpressCheckoutPayment` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the token and all the payment information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_payment = function ( params, callback ){
  this.nvpreq.execute( 'DoExpressCheckoutPayment', params, callback );
};

/**
 * Make a `DoCapture` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the authorization id and capture information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_capture = function ( params, callback ){
  this.nvpreq.execute( 'DoCapture', params, callback );
};

/**
 * Make a `DoAuthorization` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains required params.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_authorization = function ( params, callback ){
  this.nvpreq.execute( 'DoAuthorization', params, callback );
};

/**
 * Make a `DoVoid` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contains the required params.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_void = function ( params, callback ){
  this.nvpreq.execute( 'DoVoid', params, callback );
};

/**
 * Make a `CreateRecurringPaymentsProfile` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the token and information of the recurring payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.create_rpp = function ( params, callback ){
  this.nvpreq.execute( 'CreateRecurringPaymentsProfile', params, callback );
};

/**
 * Make a `GetRecurringPaymentsProfileDetails` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the PROFILEID of the recurring payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.get_rpp_details = function ( params, callback ){
  this.nvpreq.execute( 'GetRecurringPaymentsProfileDetails', params, callback );
};

module.exports = PayPalEC;


