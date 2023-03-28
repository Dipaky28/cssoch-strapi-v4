"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called before an entry is created
    beforeCreate(data) {
      if (Object.keys(data.Labels).length === 0) {
        throw new Error("Labels are required");
      }

      if (!data.Labels.grades) {
        throw new Error("Grades are required");
      }

      if (!data.Labels.concepts) {
        throw new Error("concepts are required");
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.Labels) {
        if (Object.keys(data.Labels).length === 0) {
          throw new Error("Labels are required");
        }

        if (data.Labels.grades && data.Labels.grades.length === 0) {
          throw new Error("Grades are required");
        }

        if (data.Labels.concepts && data.Labels.concepts.length === 0) {
          throw new Error("concepts are required");
        }
      }
    },
  },
};
