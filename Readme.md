# paypal-ec <sup>0.2.7</sup>

A simple API wrapper for PayPal's Express Checkout.



## Description

A simple API wrapper which assists you through all the payment processes to PayPal's Express Checkout.



## Requires

Checkout `package.json` for dependencies.



## Installation

Install paypal-ec through npm

    npm install paypal-ec



## Usage

> Require the module before using

    var PayPalEC = require( 'paypal-ec' );



### new PayPalEC( cred, opts );

Create a new PayPalEC object.

#### Arguments

> cred

    type: Object
    desc: the credential required to make an API call.

> opts

    type: Object
    desc: the options like sandbox and version.

### ec.set( params, callback );

Make a `SetExpressCheckout` API call to PayPal.

#### Arguments

> params

    type: Object
    desc: Contains all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.get_details( params, callback );

Make a `GetExpressCheckoutDetails` API call to PayPal.

#### Arguments

> params

    type: Object
    desc: Contains the token for the payment.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.do_payment( params, callback );

Make a `DoExpressCheckoutPayment` API call to PayPal.

#### Arguments

> params

    type: Object
    desc: Contains the token and all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.do_capture( params, callback )

Make a `DoCapture` API call to PayPal.

> params

    type: Object
    desc: Contains the token and all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.do_void( params, callback )

Make a `DoVoid` API call to PayPal.

> params

    type: Object
    desc: Contains the token and all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.do_reauthorization( params, callback )

Make a `DoReauthorization` API call to PayPal.

> params

    type: Object
    desc: Contains the token and all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

### ec.do_authorization( params, callback)

Make a `DoAuthorization` API call to PayPal.

> params

    type: Object
    desc: Contains the token and all the payment information.

> callback

    type: Function
    desc: Callback function to get called when done.

#### Example code

    var cred = {
      username  : 'seller_1339472528_biz_api1.gmail.com',
      password  : '1339472553',
      signature : 'AFcWxV21C7fd0v3bYYYRCpSSRl31Af-aECo8vsiP1HospgIyBCFncbx3'
    };

    var opts = {
      sandbox : true,
      version : '78.0'
    };

    var PayPalEC = require( 'paypal-ec' );
    var ec       = new PayPalEC( cred, opts );

    var params = {
      returnUrl : 'http://localhost:3000/confirm',
      cancelUrl : 'http://localhost:3000/cancel',
      SOLUTIONTYPE                   : 'sole',
      PAYMENTREQUEST_0_AMT           : '10.0',
      PAYMENTREQUEST_0_DESC          : 'Something',
      PAYMENTREQUEST_0_CURRENCYCODE  : 'USD',
      PAYMENTREQUEST_0_PAYMENTACTION : 'Sale',
    };

    ec.set( params, function ( err, data ){
      // data[ 'PAYMENTURL' ] is the payment url which
      // you should redirect your user to
    });

    // NOTE: you must set another `params` with the token
    // you just get from PayPal
    ec.get_details( params, function ( err, data ){
      // data contains all the payment details, let your
      // user confirm this information
    });

    // NOTE: set the `params` to contain both the token
    // and all the payment information
    ec.do_payment( params, function ( err, data ){
      // really charge the user for the payment
    });

### ec.do_capture( params, calllback );

Make a `DoCapture` API call to PayPal.

#### Arguments

> params

    type: Object
    desc: Contains the authorization id and capture information.

> callback

    type: Function
    desc: Callback function to get called when done.



## Example

> Checkout the `example` folder for the example app.



## License

(The MIT License)

Copyright (c) 2012 dreamerslab &lt;mason@dreamerslab.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
