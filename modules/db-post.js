/**
    Module: db-post.js
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const doc = require('dynamodb-doc'),
    docClient = doc ? new doc.DynamoDB() : null,
    uuidFactory = require('marchio-id-uuid'),
    crFactory = require('marchio-core-record'),
    path = '/:model';

module.exports.create = ( spec ) => {

    spec = spec || {};

    const adapter = spec.adapter,
          marchio = spec.marchio;

    const model = marchio.model,
          preprocess = marchio.preprocess;

    const query = adapter.query,
          params = adapter.params,
          method = adapter.method,
          body = adapter.body,
          res = adapter.response,
          env = adapter.env;

    const primaryKey = model.primary,
          jsonp = query.jsonp || false,
          cb = query.cb || 'callback';

    var recMgr = null,
        idMgr = null,
        eMsg = '',
        dbId = null;

    var req = {
        method: method,
        query: query,
        params: params,
        body: body
    };

    var _code = 200;
    var _headers = {
        "Content-Type" : "application/json"
    };

    if(method !== 'POST') {
        var resObject = {
            statusCode: 405,
            headers: {
                "Content-Type": "application/json",
                "x-marchio-http-method": method,
                "x-marchio-error": "HTTP Method not supported"
            },
            body: {} 
        };
        res.json(resObject);
        return;
    }

    // TODO - check primaryKey against DynamoDB reserved words
    if(!primaryKey) {
        throw new Error('dp-post: model.primary not defined.');
    }

    return Promise.all([
        crFactory.create( { model: model } ),
        uuidFactory.create()
    ]).
    then( o => {
        recMgr = o[0];  
        idMgr  = o[1];
        return Promise.all([
            recMgr.build( req.body ),   // build RECORD
            idMgr.generate()            // generate id
        ]);
    })
    .then( o => {
        var record = o[0];
        dbId = o[1];
        if( ! record ) {    // record failed validation
            return Promise.reject(404);
        }
        record[primaryKey] = dbId;
        var postObject = {
            "TableName": model.name,
            "ConditionExpression": `attribute_not_exists(${primaryKey})`,
            "Item": record
        };
        return Promise.all([
                docClient.putItem( postObject ).promise(),
                recMgr.select( record )
            ]);
    })
    .then( (o) => {
        var data = o[0],
            record = o[1];
        record[primaryKey] = dbId; // Set againg AFTER select or id will be filtered out
        var resObject = {
            statusCode: 201,  
            headers: {
                "Content-Type" : "application/json",
                "Location": "/" + [ model.name, dbId ].join('/')
            },
            body: record
        };
        res
            .json(resObject);
    })
    .catch( (err) => {  
        if(err) {
            if( err === 404 ) {
                res.json({
                    statusCode: 404
                });
            } else {
                res.json({
                    statusCode: 500,
                    body: { 
                        message: err.message, 
                        err: err
                    }
                });
            }
        } 
    });
};