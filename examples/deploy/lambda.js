/* ************************
 * DO NOT EDIT AS index.js 
 * Edit lambda.js
 * The file will be copied to index.js for deployment
 */

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

// var mlFactory = require('marcio-lambda-post'); // Use once package is live
var mlFactory = require('modules/index');   // TEMP until package is live

exports.handler = function(event, context, callback) {

    var model = {
        name: 'mldb',   // must match DynamoDB table name
        primary: 'eid',     // primary key - cannot be reserved word (like uuid)
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // In a real world example, password would be hashed by middleware before being saved
            password: { type: String, select: false },  // select: false, exclude from query results
        }
    };

    mlFactory.create({ 
        event: event, 
        context: context,
        callback: callback,
        model: model
    })
    .catch(function(err) {
        callback(err);
    });
};