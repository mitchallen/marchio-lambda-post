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

var factory = require("marchio-lambda-post");

var model = {
   name: 'marchio',
   fields: {
       email:    { type: String, required: true },
       status:   { type: String, required: true, default: "NEW" },
       password: { type: String, select: false },  // select: false, exclude from query results
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
