import {Promise} from 'bluebird'

module.exports.redis = Promise.promisifyAll(require('redis').createClient())
