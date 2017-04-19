/* ************************
 * DO NOT EDIT AS index.js 
 * Edit lambda.js
 * The file will be copied to index.js for deployment
 */

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const mlFactory = require('marchio-lambda-post'),
      bcrypt = require('bcrypt');

const saltRounds = 10;

/*
 * *** UNTESTED ***
 * *** EXPERIMENTAL ***
 * *** Requires installing bcrypt on AWS Linux before uploading
 * If you do not install bycrypt on an AWS Linux image, 
 * before packaging for Lambda, you will get this error:
 * "/var/task/node_modules/bcrypt/lib/binding/bcrypt_lib.node: invalid ELF header"
 */

function hashPassword( record ) {
    return new Promise( (resolve, reject) => {
        if(!record) {
            return reject('record not defined');
        }
        if(!record.password) {
            return reject('record.password not defined');
        }
        bcrypt.genSalt(saltRounds)
        .then( salt => bcrypt.hash( record.password, salt ) )
        .then( hash => {
            record.password = hash;
            resolve(record);
        });
    });
}

exports.handler = function(event, context, callback) {

    var model = {
        name: 'mldb',   // must match DynamoDB table name
        primary: 'eid',     // primary key - cannot be reserved word (like uuid)
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // In a real world example, password would be hashed by middleware before being saved
            password: { type: String, select: false }  // select: false, exclude from query results
        }
    };

    mlFactory.create({ 
        event: event, 
        context: context,
        callback: callback,
        model: model,
        filter: hashPassword
    })
    .catch(function(err) {
        callback(err);
    });
};