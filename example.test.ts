import path from 'path';
import { resetDatabase } from '@keystone-6/core/testing';
import { getContext } from '@keystone-6/core/context';
import baseConfig from './keystone';
import * as PrismaModule from '.prisma/client';

const dbUrl = `file:./test-${process.env.JEST_WORKER_ID}.db`;
const prismaSchemaPath = path.join(__dirname, 'schema.prisma');
const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

const context = getContext(config, PrismaModule);

beforeEach(async () => {
  await resetDatabase(dbUrl, prismaSchemaPath);
});

test('Create a User using the Query API', async () => {

  const person = await context.query.User.createOne({
    data: { firstName: 'Janusz', lastName: "Kowalski", email: 'janusz@example.com', password: 'super-secret' },
    query: 'id firstName lastName email',
  });
  expect(person.firstName).toEqual('Janusz');
  expect(person.lastName).toEqual('Kowalski');
  expect(person.email).toEqual('janusz@example.com');
});
