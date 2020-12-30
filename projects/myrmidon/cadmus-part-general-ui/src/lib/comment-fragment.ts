import { DocReference, Fragment } from '@myrmidon/cadmus-core';
import { IndexKeyword } from './index-keywords-part';

/**
 * The comment layer fragment server model.
 */
export interface CommentFragment extends Fragment {
  tag?: string;
  text: string;
  references?: DocReference[];
  externalIds?: string[];
  categories?: string[];
  keywords?: IndexKeyword[];
}

export const COMMENT_FRAGMENT_TYPEID = 'fr.it.vedph.comment';

export const COMMENT_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/general/' +
    COMMENT_FRAGMENT_TYPEID +
    '.json',
  type: 'object',
  title: 'CommentFragment',
  required: ['location', 'text'],
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
