# Cadmus Thesaurus UI

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

Thesaurus editing UI components, app-independent.

The components are:

- thesaurus editor, the main component. This depends on all the following components and services.
- thesaurus node: a single node in the editor.
- thesaurus lookup: a thesauri lookup component used when editing aliases.
- thesaurus nodes service: a service managing nodes in the editing environment.

The lookup component requires to be bound to a service providing lookup capabilities.
