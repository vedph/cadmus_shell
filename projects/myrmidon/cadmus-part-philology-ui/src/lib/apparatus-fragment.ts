import { Fragment } from '@myrmidon/cadmus-core';

/**
 * Type of apparatus entry in an apparatus fragment.
 */
export enum ApparatusEntryType {
  // variant should replace lemma
  replacement = 0,

  // variant should be added before lemma
  additionBefore,

  // variant should be added after lemma
  additionAfter,

  // any note to the text
  note,
}

/**
 * An optionally annotated value used in an apparatus entry.
 */
export interface AnnotatedValue {
  value: string;
  note?: string;
}

/**
 * An annotated value plus a tag and a location.
 */
export interface LocAnnotatedValue extends AnnotatedValue {
  tag?: string;
  location?: string;
}

/**
 * A single entry in an apparatus fragment.
 */
export interface ApparatusEntry {
  type: ApparatusEntryType;
  tag?: string;
  subrange?: string;
  value?: string;
  normValue?: string;
  isAccepted?: boolean;
  groupId?: string;
  witnesses?: AnnotatedValue[];
  authors?: LocAnnotatedValue[];
  note?: string;
}

/**
 * The apparatus layer fragment server model.
 */
export interface ApparatusFragment extends Fragment {
  tag?: string;
  entries: ApparatusEntry[];
}

export const APPARATUS_FRAGMENT_TYPEID = 'fr.it.vedph.apparatus';

export const APPARATUS_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/philology/' +
    APPARATUS_FRAGMENT_TYPEID +
    '.json',
  type: 'object',
  required: ['location', 'entries'],
  properties: {
    location: {
      type: 'string',
    },
    baseText: {
      type: 'string',
    },
    tag: {
      type: 'string',
    },
    entries: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'integer',
          },
          subrange: {
            type: ['string', 'null'],
          },
          tag: {
            type: ['string', 'null'],
          },
          value: {
            type: ['string', 'null'],
          },
          normValue: {
            type: ['string', 'null'],
          },
          isAccepted: {
            type: 'boolean',
          },
          groupId: {
            type: ['string', 'null'],
          },
          witnesses: {
            type: 'array',
            items: {
              type: 'object',
              required: ['value'],
              properties: {
                value: {
                  type: 'string',
                },
                note: {
                  type: ['string', 'null'],
                },
              },
            },
          },
          authors: {
            type: 'array',
            items: {
              type: 'object',
              required: ['value'],
              properties: {
                tag: {
                  type: ['string', 'null'],
                },
                value: {
                  type: 'string',
                },
                location: {
                  type: ['string', 'null'],
                },
                note: {
                  type: ['string', 'null'],
                },
              },
            },
          },
          note: {
            type: ['string', 'null'],
          },
        },
      },
    },
  },
};
