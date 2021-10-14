import { Part } from '@myrmidon/cadmus-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';

/**
 * The document references part model.
 */
export interface DocReferencesPart extends Part {
  references: DocReference[];
}

/**
 * The type ID used to identify the DocReferencesPart type.
 */
export const DOC_REFERENCES_PART_TYPEID = 'it.vedph.doc-references';

/**
 * JSON schema for the DocReferences part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const DOC_REFERENCES_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/parts/general/' +
    DOC_REFERENCES_PART_TYPEID +
    '.json',
  type: 'object',
  title: 'DocReferencesPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'references',
  ],
  properties: {
    timeCreated: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d+Z$',
    },
    creatorId: {
      type: 'string',
    },
    timeModified: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d+Z$',
    },
    userId: {
      type: 'string',
    },
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    itemId: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    typeId: {
      type: 'string',
      pattern: '^[a-z][-0-9a-z._]*$',
    },
    roleId: {
      type: ['string', 'null'],
      pattern: '^([a-z][-0-9a-z._]*)?$',
    },
    references: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['citation'],
            properties: {
              type: {
                type: 'string',
              },
              tag: {
                type: 'string',
              },
              citation: {
                type: 'string',
              },
              note: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
  },
};
