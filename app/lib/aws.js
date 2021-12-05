'use strict';

const aws = require('aws-sdk');
const config = require('../config');

const generateDataKey = async () => {
    const kms = new aws.KMS({
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretAccessKey,
        region: 'eu-central-1'
    });
    const params = {
        KeyId: config.aws.cmkIdentifier,
        NumberOfBytes: 32
    };
    return kms.generateDataKey(params).promise()
}

const decrypt = async (key) => {
    const kms = new aws.KMS({
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretAccessKey,
        region: 'eu-central-1'
    });
    const decrypted = await kms.decrypt({ CiphertextBlob: Buffer.from(key, 'hex') }).promise();
    return decrypted.Plaintext;
}

module.exports = {
    generateDataKey,
    decrypt
}