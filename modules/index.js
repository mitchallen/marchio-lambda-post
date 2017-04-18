/**
    Module: marchio-lambda-post
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

require('dotenv').config();

var adapterFactory = require('@mitchallen/lambda-adapter');
var postFactory = require('./db-post');

/**
 * Module
 * @module marchio-lambda-post
 */

/**
 * 
 * Factory module
 * @module marchio-lambda-post-factory
 */

 /** 
 * Factory method 
 * It takes one spec parameter that must be an object with named parameters
 * @param {Object} spec Named parameters object
 * @param {Object} spec.event Lambda event
 * @param {Object} spec.context Lambda context
 * @param {function} spec.callback Lambda callback
 * @param {Object} spec.model - Table model
 * @returns {Promise} that resolves to {module:marchio-lambda-post}
 * @example <caption>Usage example</caption>
 * // Lambda root file
 * "use strict";
 * 
 * var mlFactory = require('marcio-lambda-post'); 
 * 
 * exports.handler = function(event, context, callback) {
 * 
 *     var model = {
 *         name: 'mldb',   // must match DynamoDB table name
 *         primary: 'eid', // primary key - cannot be reserved word (like uuid)
 *         fields: {
 *             email:    { type: String, required: true },
 *             status:   { type: String, required: true, default: "NEW" },
 *             // In a real world example, password would be hashed by middleware before being saved
 *             password: { type: String, select: false },  // select: false, exclude from query results
 *         }
 *     };
 * 
 *    mlFactory.create({ 
 *         event: event, 
 *         context: context,
 *         callback: callback,
 *         model: model
 *     })
 *     .catch(function(err) {
 *         callback(err);
 *     });
 *  };
 */
module.exports.create = (spec) => {

    spec = spec || {};

    if(!spec.event) {
        return Promise.reject("event parameter not set");
    }

    if(!spec.context) {
        return Promise.reject("context parameter not set");
    }

    if(!spec.context.functionName) {
        return Promise.reject("context.functionName parameter not defined");
    }

    if(!spec.callback) {
        return Promise.reject("callback parameter not set");
    }

    if(!spec.model) {
        return Promise.reject("model parameter not set");
    }

    spec.regex = `/${spec.context.functionName}/:model/:id`;

    const marchio = spec;

    return  adapterFactory.create(spec)
            .then( (adapter) => {
                return postFactory.create({ 
                    adapter: adapter,
                    marchio: marchio 
                });
            })
            .catch(function(err) {
                spec.callback(err);
            });
};