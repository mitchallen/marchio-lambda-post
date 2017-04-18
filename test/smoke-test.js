/**
    Module: marchio-lambda-post
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint mocha: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    matrix = require('./matrix');

var testMatrix = matrix.create({});

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

describe('deployment smoke test', () => {

    before( done => {
        done();
    });

    after( done => {
        // Call after all tests
        done();
    });

    beforeEach( done => {
        // Call before each test
        done();
    });

    afterEach( done => {
        // Call after each test
        done();
    });

    ///////////////////////////////////////
    // Test each service in a matrix

    testMatrix.forEach(function (el) {

        var matrixKey = el.key,
            service = el.service,
            table = el.table,
            _testHost = el.testHost,
            _testPath = el.testPath;

        describe(`lambda-dynamo: ${service}`, () => {

            var _testModel = {
                // name: 'beta',
                name: table,
                key: "eid", // Primary key field in DynamoDB
                fields: {
                    email:    { type: String, required: true },
                    status:   { type: String, required: true, default: "NEW" },
                    // In a real world example, password would be hashed by middleware before being saved
                    password: { type: String, select: false },  // select: false, exclude from query results,
                }
            };

            var _postUrl = `${_testPath}/${_testModel.name}`;
            // console.log(`POST URL: ${_postUrl}`);

            it('post should succeed', done => {
                var testObject = {
                    email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                    password: "fubar"
                };
                // console.log(`TEST HOST: ${_testHost} `);
                // console.log(`TEST URL: ${_testHost}${_postUrl} `);
                request(_testHost)
                    .post(_postUrl)
                    .send(testObject)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .expect('Content-Type', /json/)
                    .expect('Location', /mldb/ )
                    .end(function (err, res) {
                        should.not.exist(err);
                        // console.log("RESPONSE: ", res.body);
                        res.body.email.should.eql(testObject.email);
                        // Should not return password
                        should.not.exist(res.body.password);
                        res.body.status.should.eql("NEW");
                        should.exist(res.body[_testModel.key]);
                        res.header.location.should.eql(`/${_testModel.name}/${res.body[_testModel.key]}`)
                        done();
                    });
            });

            it('post with invalid model name in url should return 404', done => {
                var testObject = {
                    email: "test" + getRandomInt( 1000, 1000000) + "@smoketest.cloud",
                    password: "fubar"
                };
                // console.log(`TEST HOST: ${_testHost} `);
                var _invalidPostUrl = "/bogus";
                request(_testHost)
                    .post(_invalidPostUrl)
                    .send(testObject)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        done();
                    });
            });
        });
    });
});