marchio-lambda-post
==
REST POST to DynamoDB via Lambda
--

<p align="left">
  <a href="https://travis-ci.org/mitchallen/marchio-lambda-post">
    <img src="https://img.shields.io/travis/mitchallen/marchio-lambda-post.svg?style=flat-square" alt="Continuous Integration">
  </a>
  <a href="https://codecov.io/gh/mitchallen/marchio-lambda-post">
    <img src="https://codecov.io/gh/mitchallen/marchio-lambda-post/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
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

## Usage

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
* Create a name for the rold (like __lambda-db-test__)
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
* Lambda Region: __us-east-1__
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
* Click: __Create Table___
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

To run the script you must first make it runnable (chmod +x deploy-lambda.sh)

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

**Example** *(Usage example)*  
```js
// Lambda root file
var factory = require("marchio-lambda-post");

var model = {
   name: 'marchio',
   fields: {
       email:    { type: String, required: true },
       status:   { type: String, required: true, default: "NEW" },
       password: { type: String, select: false }
   }
};

factory.create({
    event: event, 
    context: context,
    callback: callback,
    model: model, 
    post: true
})
.catch( function(err) { 
    console.error(err); 
});
```

* * *

## Testing

To test, go to the root folder and type (sans __$__):

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

#### Version 0.1.0 

* initial release

* * *
