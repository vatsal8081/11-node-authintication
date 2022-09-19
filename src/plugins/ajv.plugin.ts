import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Types } from 'mongoose';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

ajv.addFormat('objectId', { type: 'string', validate: (val: string) => Types.ObjectId.isValid(val) });

export { ajv };
