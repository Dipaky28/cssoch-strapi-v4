'use strict';

/**
 * game-set service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-set.game-set');