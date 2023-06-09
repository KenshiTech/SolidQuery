import { toCamel, toCallData } from "../common.js";

/**
 * Generates Solidity functions for updating records in the schema's structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for updating records, each function
 * on a new line.
 */
export const getUpdateFunctions = (schema) => {
  const functions = [];
  for (const [structName, { id, fields }] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, { indexed }] of Object.entries(fields)) {
      if (indexed) {
        const deleteIndexFunction = toCamel(
          "delete",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        indexes.push(`${deleteIndexFunction}(${id.name});`);
        const addIndexFunction = toCamel(
          "add",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        indexes.push(
          `${addIndexFunction}(${id.name}, ${structName}s[${id.name}]);`
        );
      }
    }
    const functionName = toCamel("update", structName);
    const eventFields = Object.keys(fields).map((field) => `value.${field}`);
    const idName = id.name;
    const idType = id.type;
    const body = [
      `${indexes.join("\n")}`,
      `${structName}s[${idName}] = value;`,
      `emit ${structName}Updated(${idName}, ${eventFields.join(", ")});`,
    ]
      .filter(Boolean)
      .join("\n");
    functions.push(`
      /**
       * @dev Updates a ${structName} record by its ${idName}.
       * @notice Emits a ${structName}Updated event on success.
       * @param ${idName} The ${idName} of the record to update.
       * @param value The new data to update the record with.
       */
      function ${functionName}(${idType} ${idName}, ${structName} calldata value) external onlyOwner {
        ${body}
      }
    `);
  }
  return functions.join("\n");
};

/**
 * Generates Solidity functions for setting a specific field of a specific
 * record by its ID.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for getting records, each function
 * on a new line.
 */
export const getFieldSetFunctions = (schema) => {
  const functions = [];
  for (const [structName, { id, fields }] of Object.entries(schema)) {
    for (const [fieldName, { type, get, indexed }] of Object.entries(fields)) {
      if (get) {
        const functionName = toCamel(
          "set",
          structName,
          fieldName,
          "by",
          id.name
        );
        const eventFields = Object.keys(fields).map(
          (field) => `${structName}s[${id.name}].${field}`
        );
        const valueType = toCallData(type);
        const indexes = [];
        if (indexed) {
          const deleteIndexFunction = toCamel(
            "delete",
            structName,
            fieldName,
            "index",
            "for",
            id.name
          );
          indexes.push(`${deleteIndexFunction}(${id.name});`);
          const addIndexFunction = toCamel(
            "add",
            structName,
            fieldName,
            "index",
            "for",
            id.name
          );
          indexes.push(
            `${addIndexFunction}(${id.name}, ${structName}s[${id.name}]);`
          );
        }
        const idName = id.name;
        const idType = id.type;
        const body = [
          `${structName}s[${idName}].${fieldName} = value;`,
          `${indexes.join("\n")}`,
          `emit ${structName}Updated(${idName}, ${eventFields.join(", ")});`,
        ]
          .filter(Boolean)
          .join("\n");
        functions.push(`
          /**
           * @dev Sets the ${fieldName} of a ${structName} record to value.
           * @param ${idName} ${idName} of the record to retrieve.
           * @param value The new value for ${fieldName}.
           */
          function ${functionName}(${idType} ${idName}, ${valueType} value) external onlyOwner {
            ${body}
          }
        `);
      }
    }
  }
  return functions.join("\n");
};
