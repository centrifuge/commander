import Ajv, { Options as ValidatorOptions } from 'ajv';
import { JTDSchemaType } from 'ajv/dist/jtd';
//import { DefinedError } from 'ajv';
import { Configuration } from './types';

/**
 * JDT schema validator options
 */
const validatorOptions: ValidatorOptions = {
  allErrors: true,
};

const ajv = new Ajv(validatorOptions);

/**
 * Configuration schema definition.
 *
 * Define configuration file schema using JSON Type Definition (JTD) standard. The type
 * 'JDTSchemaType' ensures that the defined schema will match the 'Configuration' type.
 */
const ConfigurationSchema: JTDSchemaType<Configuration> = {
  properties: {
    relaychain: {
      properties: {
        chain: { type: 'string' },
        nodes: {
          elements: {
            properties: {
              name: { type: 'string' },
              port: { type: 'uint16' },
              wsPort: { type: 'uint16' },
            },
          },
        },
        source: {
          discriminator: 'variant',
          mapping: {
            binaryFile: {
              properties: {
                path: { type: 'string' },
              },
            },
            dockerImage: {
              properties: {
                image: { type: 'string' },
                container: { type: 'string' },
              },
            },
            gitRepository: {
              properties: {
                url: { type: 'string' },
              },
            },
          },
        },
      },
      optionalProperties: {
        spec: { type: 'string' },
        //                genesis: { type: "string" }
      },
    },
  },

  optionalProperties: {
    buildsDir: { type: 'string' },
  },
};

/**
 * Pre-compiled validator for configuration file schema.
 *
 * If type annotation is not used to define the schema, type parameter can be used
 * to make it type guard for the 'Configuration' structure.
 * This compilation step transforms the input 'ConfigurationSchema' into a set of functions
 * and cache them, so that next time the schema is used it won't be compiled again.
 *
 * @see https://github.com/ajv-validator/ajv/blob/master/spec/types/json-schema.spec.ts
 */
export const validateConfiguration = ajv.compile<Configuration>(ConfigurationSchema);
