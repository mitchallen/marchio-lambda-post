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
