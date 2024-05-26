import Joi from 'joi';
import { ConfigModule, DB_SCHEMA } from '../config.module';
import { Test } from '@nestjs/testing';
import { join } from 'path';

function expectValidate(schema: Joi.Schema, value: any) {
  return expect(
    schema.validate(value, {
      abortEarly: false,
    }).error.message,
  );
}

describe('Schema Unit Tests.', () => {
  describe('DB Schema', () => {
    let schema = Joi.object({
      ...DB_SCHEMA,
    });
    describe('DB_VENDOR', () => {
      test('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
      });

      test('invalid cases - when value is not mysql | sqlite', () => {
        expectValidate(schema, { DB_VENDOR: 5 }).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['mysql', 'sqlite'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_VENDOR: value }).not.toContain(
            'DB_VENDOR',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('"DB_HOST" is required');
      });

      test('invalid cases - when is not string', () => {
        expectValidate(schema, { DB_HOST: 5 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_HOST: 'host' }).not.toContain('DB_HOST');
      });
    });

    describe('DB_DATABASE', () => {
      test('invalid cases - required when DB_VENDOR is "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'mysql',
        }).toContain('"DB_DATABASE" is required');
      });

      test('valid cases - not required when DB_VENDOR is not "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
        }).not.toContain('DB_DATABASE');
      });

      test('invalid cases - must be string', () => {
        expectValidate(schema, { DB_DATABASE: 5 }).toContain(
          '"DB_DATABASE" must be a string',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_DATABASE: 'DB_DATABASE' }).not.toContain(
          'DB_DATABASE',
        );
      });
    });

    describe('DB_USERNAME', () => {
      test('invalid cases - required when DB_VENDOR is "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'mysql',
        }).toContain('"DB_USERNAME" is required');
      });

      test('valid cases - not required when DB_VENDOR is not "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
        }).not.toContain('DB_USERNAME');
      });

      test('invalid cases - must be string', () => {
        expectValidate(schema, { DB_USERNAME: 5 }).toContain(
          '"DB_USERNAME" must be a string',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_USERNAME: 'DB_USERNAME' }).not.toContain(
          'DB_USERNAME',
        );
      });
    });

    describe('DB_PASSWORD', () => {
      test('invalid cases - required when DB_VENDOR is "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'mysql',
        }).toContain('"DB_PASSWORD" is required');
      });

      test('valid cases - not required when DB_VENDOR is not "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
        }).not.toContain('DB_PASSWORD');
      });

      test('invalid cases - must be string', () => {
        expectValidate(schema, { DB_PASSWORD: 5 }).toContain(
          '"DB_PASSWORD" must be a string',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_PASSWORD: 'DB_PASSWORD' }).not.toContain(
          'DB_PASSWORD',
        );
      });
    });

    describe('DB_PORT', () => {
      test('invalid cases - required when DB_VENDOR is "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'mysql',
        }).toContain('"DB_PORT" is required');
      });

      test('valid cases - not required when DB_VENDOR is not "mysql"', () => {
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
        }).not.toContain('DB_PORT');
      });

      test('invalid cases - must be a number', () => {
        expectValidate(schema, { DB_PORT: 'string' }).toContain(
          '"DB_PORT" must be a number',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_PORT: 5 }).not.toContain('DB_PORT');
      });
    });

    describe('DB_LOGGING', () => {
      test('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('"DB_LOGGING" is required');
      });

      test('invalid cases - must be a boolean', () => {
        expectValidate(schema, { DB_LOGGING: 'string' }).toContain(
          '"DB_LOGGING" must be a boolean',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_LOGGING: true }).not.toContain(
          'DB_LOGGING',
        );
      });
    });
    describe('DB_AUTO_LOAD_MODELS', () => {
      test('invalid cases - required', () => {
        expectValidate(schema, {}).toContain(
          '"DB_AUTO_LOAD_MODELS" is required',
        );
      });

      test('invalid cases - must be a boolean', () => {
        expectValidate(schema, { DB_AUTO_LOAD_MODELS: 'string' }).toContain(
          '"DB_AUTO_LOAD_MODELS" must be a boolean',
        );
      });

      test('valid cases', () => {
        expectValidate(schema, { DB_AUTO_LOAD_MODELS: true }).not.toContain(
          'DB_AUTO_LOAD_MODELS',
        );
      });
    });
  });
});

describe('ConfigModule Unit Tests', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      });

      fail('ConfigModule should throw an error when env vars are invalid');
    } catch (e) {
      expect(e.message).toContain('"DB_VENDOR" is required');
    }
  });

  it('should be valie', () => {
    const moduleTest = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });

    expect(moduleTest).toBeDefined();
  });
});
