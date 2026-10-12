import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from 'chai';
import { utilityClient } from '../clients/utilityClient.js';

// The API publishes its own OpenAPI document, so responses are checked against
// the contract the server promises instead of a schema copied into this repo.
const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
let loaded;

async function load() {
  loaded ??= utilityClient.openApi().expect(200).then((res) => ajv.addSchema(res.body, 'openapi'));
  return loaded;
}

/** Asserts `data` matches `components.schemas.<name>` of the published OpenAPI document. */
export async function expectContract(data, name) {
  await load();
  const validate = ajv.getSchema(`openapi#/components/schemas/${name}`);
  expect(validate, `No schema named ${name} in /openapi.json`).to.be.a('function');
  expect(validate(data), JSON.stringify(validate.errors, null, 2)).to.equal(true);
}
