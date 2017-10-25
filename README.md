marchio-lambda-post
==
REST POST to DynamoDB via Lambda
--

<p align="left">
<!--
  <a href="https://travis-ci.org/mitchallen/marchio-lambda-post">
    <img src="https://img.shields.io/travis/mitchallen/marchio-lambda-post.svg?style=flat-square" alt="Continuous Integration">
  </a>
-->
<!--
  <a href="https://codecov.io/gh/mitchallen/marchio-lambda-post">
    <img src="https://codecov.io/gh/mitchallen/marchio-lambda-post/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
-->
  <a href="https://npmjs.org/package/marchio-lambda-post">
    <img src="http://img.shields.io/npm/dt/marchio-lambda-post.svg?style=flat-square" alt="Downloads">
  </a>
  <a href="https://npmjs.org/package/marchio-lambda-post">
    <img src="http://img.shields.io/npm/v/marchio-lambda-post.svg?style=flat-square" alt="Version">
  </a>
  <a href="https://npmjs.com/package/marchio-lambda-post">
    <img src="https://img.shields.io/github/license/mitchallen/marchio-lambda-post.svg" alt="License"></a>
  </a>
</p>

## Installation

    $ npm init
    $ npm install marchio-lambda-post --save
  
* * *

## Lambda Setup

### References

* __[Create an API with Lambda Proxy Integration through a Proxy Resource](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)__
* [A Lambda Function in Node.js for Proxy Integration](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html#api-gateway-proxy-integration-lambda-function-nodejs)
* [Build an API Gateway API Using Proxy Integration and a Proxy Resource](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy.html)
* [Create and Test an API with HTTP Proxy Integration through a Proxy Resource](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-http.html)

* * *

### Steps

#### Create Test Role

* Browse to: https://console.aws.amazon.com/iam/
* Click: __Roles__ (from the left column)
* Click: __Create new role__
* __Step 1: Select role type__
 * For __AWS Lambda__, click: __Select__
* __Step 2__ is automatically skipped
* __Step 3: Attach policy__
 * Select both __AmazonDynamoDB*__ policies
* Click: __Next Step__
* Create a name for the role (like __lambda-db-test__)
* Click: __Create role__

#### Create Lambda Function

* Browse to: https://console.aws.amazon.com/lambda
* Click: __Create a Lambda Function__
* Select: __Blank Function__
* Click: __Next__
* Name: __marchio__
* Description: __Marchio service__
* Runtime: __Node.js 4.3__
* Set the __Role__ values
* Click: __Next__
* Click: __Create Function__

#### Setup API Gateway

* Browse to: https://console.aws.amazon.com/apigateway
* Click: __Create API__
* Select: __New API__
* API name: __marchio__
* Description: __Marchio service__
* Click: __Create API__
* Click on the slash (__/__)
* Drop down: __Actions__
* Select: __Create Resource__
* Check: __Configure as proxy resource__
* (Optionally enabled __CORS__)
* Click: __Create Resource__
* For __Integration type__ select: __Lambda Function Proxy__
* Lambda Region: For example: __us-east-1__
* Lambda Function: __marchio__
* Click: __Save__
* Add Permission to Lambda Function: __OK__
* Drop down: __Actions__
* Select: __Deploy API__
* Define a new stage (call it "test")
* Click: __Deploy__
* Save the __Invoke URL__

#### Create DynamoDB Table

* Browse to: https://console.aws.amazon.com/dynamodb/
* Click: __Create Table__
* Table name: __mldb__
* Primary key: __eid__
* The type should be the default (string)
* Click: __Create__
* After some churning, click the __Capacity__ tab
* Set the __Read / Write capacity units__ to __1__ to save money while testing
* Click: __Save__

#### Example and Deploy

See the deployment example located in the repo under:

* examples/deploy

It contains a deployment script and an example lambda source file.

* Install the dependencies by running:
```
$ npm install
```

To run the script you must first make it runnable:
```
$ chmod +x deploy-lambda.sh
```

To test:

* Deploy the API via API Gateway
* Create an environment variable called __AWS\_HOST\_MARCHIO__ which is set to the invocation url
* Test the deployment using __curl__:
```
$ curl -i -X POST -H "Content-Type: application/json" -d '{"email":"test@beta.com"}' $AWS_HOST_MARCHIO/test/marchio
```
* The response should contain a 201 status code and a copy of the created record, along with its id (eid)
* Browse the DynamoDB table to see the new record.

* * *

## Modules

<dl>
<dt><a href="#module_marchio-lambda-post">marchio-lambda-post</a></dt>
<dd><p>Module</p>
</dd>
<dt><a href="#module_marchio-lambda-post-factory">marchio-lambda-post-factory</a></dt>
<dd><p>Factory module</p>
</dd>
</dl>

<a name="module_marchio-lambda-post"></a>

## marchio-lambda-post
Module

<a name="module_marchio-lambda-post-factory"></a>

## marchio-lambda-post-factory
Factory module

<a name="module_marchio-lambda-post-factory.create"></a>

### marchio-lambda-post-factory.create(spec) ⇒ <code>Promise</code>
Factory method 
It takes one spec parameter that must be an object with named parameters

**Kind**: static method of <code>[marchio-lambda-post-factory](#module_marchio-lambda-post-factory)</code>  
**Returns**: <code>Promise</code> - that resolves to {module:marchio-lambda-post}  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Named parameters object |
| spec.event | <code>Object</code> | Lambda event |
| spec.context | <code>Object</code> | Lambda context |
| spec.callback | <code>function</code> | Lambda callback |
| spec.model | <code>Object</code> | Table model |
| [spec.filter] | <code>function</code> | A function that takes the original record and returns a {Promise} that resolves to a filtered record |

**Example** *(Usage example)*  
```js
// Lambda root file
"use strict";

var mlFactory = require('marcio-lambda-post'); 

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Why not just demo hashing with bcrypt?
// Because bcrypt requires installing on AWS Linux before packaging
// That's beyond the scope of this example, so we fake it.
 
function fakeHash( record ) {
   // Not a real hash function - do not use in production
   return new Promise( (resolve, reject) => {
        if(!record) {
            return reject('record not defined');
        }
        if(!record.password) {
            return reject('record.password not defined');
        }
        // fake hashing - do not use in production
        record.password = '$' + getRandomInt(10000, 10000000);
        resolve(record);
   });
}

exports.handler = function(event, context, callback) {

    var model = {
        name: 'mldb',   // must match DynamoDB table name
        partition: 'eid', // primary partition key - cannot be reserved word (like uuid)
        // sort: 'gid', // primary sort key
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // Password will be (fake) hashed by filter before being saved
            password: { type: String, select: false },  // select: false, exclude from query results
        }
    };

    mlFactory.create({ 
        event: event, 
        context: context,
        callback: callback,
        model: model,
        filter: fakeHash
    })
    .catch(function(err) {
        callback(err);
    });
 };
```

 
* * *

## Testing

To test:

* Deploy the example (examples/deploy) 

* Go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/marchio-lambda-post.git](https://bitbucket.org/mitchallen/marchio-lambda-post.git)
* [github.com/mitchallen/marchio-lambda-post.git](https://github.com/mitchallen/marchio-lambda-post.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.3.0

* removed model/table name from url
* updated example url's

#### Version 0.2.2

* added support for sort key (model.sort) - see examples

#### Version 0.2.1

* updated example project

#### Version 0.2.0

* changed model.primary to model.partition

#### Version 0.1.6

* Updated documentation with filtered example

#### Version 0.1.5

* Added filter support

#### Version 0.1.4

* Fixed dependency issue

#### Version 0.1.3

* Refactored db-post module

#### Version 0.1.2

* Refactored db-post module

#### Version 0.1.1

* Fixed some doc issues

#### Version 0.1.0 

* initial release

* * *
