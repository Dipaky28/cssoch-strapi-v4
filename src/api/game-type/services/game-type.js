'use strict';

/**
 * game-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-type.game-type');