'use strict';

/**
 * puzzle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::puzzle.puzzle');