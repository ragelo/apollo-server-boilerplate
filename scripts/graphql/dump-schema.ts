#!/usr/bin/env ts-node
import * as fs from 'fs';
import {graphql, introspectionQuery, printSchema} from 'graphql';

if (!fs.existsSync('./schemas')) {
  fs.mkdirSync('./schemas');
}

const jsonFile = './schemas/schema.json';
const graphQLFile = './schemas/schema.graphql';

function onFinish(resolve: any, reject: any) {
  return (err: any) => {
    if (err) {
      reject(err);
    }
    resolve();
  };
}

export async function updateSchema() {
  try {
    const schema = require('../../src/graphql/schema').default;
    const json = await graphql(schema, introspectionQuery);
    await Promise.all([
      new Promise((resolve, reject) => fs.writeFile(
        jsonFile,
        JSON.stringify(json, null, 2), 
        null,
        onFinish(resolve, reject)
      )),
      new Promise((resolve, reject) => fs.writeFile(
        graphQLFile,
        printSchema(schema),
        null,
        onFinish(resolve, reject)
      )),
    ]);
    console.log('Schema has been generated');
  } catch (err) {
    console.error(err);
    throw new Error('An error occurred during schema generation!');
  }
}

if (require.main === module) {
  updateSchema()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default updateSchema;
