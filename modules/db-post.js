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

function defaultFilter( record ) {
    return new Promise( (resolve, reject) => {
        if(!record) {
            return reject('record not defined');
        }
        resolve(record);
    });
}

module.exports.create = ( spec ) => {

    spec = spec || {};

    const adapter = spec.adapter,
          marchio = spec.marchio;

    const model = marchio.model,
          filter = marchio.filter || defaultFilter;

    const query = adapter.query,
          params = adapter.params,
          method = adapter.method,
          body = adapter.body,
          res = adapter.response,
          env = adapter.env;

    const partition = model.partition || null,
          sort = model.sort || null,
          jsonp = query.jsonp || false,
          cb = query.cb || 'callback';

    var recMgr = null,
        idMgr = null,
        eMsg = '';

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
                "x-marchio-error": "HTTP Method not supported (marchio-lambda-post)"
            },
            body: {} 
        };
        res.json(resObject);
        return;
    }

    return Promise.all([
        crFactory.create( { model: model } ),
        uuidFactory.create()
    ]).
    then( o => {
        if(model.primary) {
            throw new Error( "ERROR: marchio-lambda-post: model.primary should now be model.partition" );
        }
        if(!partition) {
            throw new Error( "ERROR: marchio-lambda-post: model.partition not defined" );
        }
        recMgr = o[0];  
        idMgr  = o[1];
        return Promise.all([
            recMgr.build( req.body ),   // build RECORD
            idMgr.generate()            // generate id
        ]);
    })
    .then( o => {
        var record = o[0],
            dbId = o[1];
        if( ! record ) {    // record failed validation
            return Promise.reject(404);
        }
        record[partition] = dbId;
        return filter( record );
    })
    .then( record => {
        var dbId = record[partition];  // save dbId before select
        var postObject = {
            "TableName": model.name,
            "ConditionExpression": `attribute_not_exists(${partition})`,
            "Item": record
        };
        return Promise.all([
                docClient.putItem( postObject ).promise(),
                recMgr.select( record ),
                Promise.resolve( dbId )
            ]);
    })
    .then( (o) => {
        var data = o[0],
            record = o[1],
            dbId = o[2];
        record[partition] = dbId; // Set again AFTER select or id will be filtered out
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
                    headers: {
                        "Content-Type": "application/json",
                        "x-marchio-error": err.message,
                        "x-marchio-table": model.name,
                        "x-marchio-partition": params.partition,
                        "x-marchio-sort": params.sort
                    },
                    body: { 
                        message: err.message, 
                        err: err
                    }
                });
            }
        } 
    });
};