"use strict";

module.exports.create = (spec) => {

    spec = spec || {};


    return [
        { 
            key: "AWS",
            service: "aws lambda",
            table: "mldb",  // DynamoDB table
            testHost: process.env.AWS_HOST_MARCHIO, 
            testPath: "/test/marchio"  
        }
    ];
}