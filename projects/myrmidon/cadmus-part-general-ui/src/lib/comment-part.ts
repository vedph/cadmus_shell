import { DocReference, Part } from '@myrmidon/cadmus-core';
import { IndexKeyword } from './index-keywords-part';

/**
 * A comment.
 */
export interface Comment {
  tag?: string;
  text: string;
  references?: DocReference[];
  externalIds?: string[];
  categories?: string[];
  keywords?: IndexKeyword[];
}

/**
 * The Comment part model.
 */
export interface CommentPart extends Part, Comment {}

/**
 * The type ID used to identify the CommentPart type.
 */
export const COMMENT_PART_TYPEID = 'it.vedph.comment';

/**
 * JSON schema for the Comment part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const COMMENT_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/general/' + COMMENT_PART_TYPEID + '.json',
  type: 'object',
  title: 'CommentPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'text'
  ],
  properties: {
    location: {
      $id: '#/properties/location',
      type: 'string',
    },
    baseText: {
      $id: '#/properties/baseText',
      type: 'string',
    },
    text: {
      type: 'string',
    },
    tag: {
      type: ['string', 'null'],
    },
    references: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['author', 'work'],
            properties: {
              tag: {
                type: 'string',
              },
              author: {
                type: 'string',
              },
              work: {
                type: 'string',
              },
              location: {
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
    externalIds: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
          },
        ],
      },
    },
    categories: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
          },
        ],
      },
    },
    keywords: {
      type: 'array',
      items: {
        type: 'object',
        required: ['indexId', 'language', 'value'],
        properties: {
          indexId: {
            type: 'string',
          },
          language: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
          note: {
            type: 'string',
          },
          tag: {
            type: 'string',
          },
        },
      },
    },
  },
};
