import type {StructureBuilder} from 'sanity/desk';

const SINGLETON_TYPES = ['siteSettings'] as const;

const SINGLETON_ACTIONS = new Set(['create', 'delete', 'duplicate', 'unpublish']);

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .schemaType('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const listItemId = listItem.getId();

        if (!listItemId) {
          return true;
        }

        return !SINGLETON_TYPES.includes(listItemId as (typeof SINGLETON_TYPES)[number]);
      }),
    ]);

export const singletonActions = (actions: {name: string}[], context: {schemaType: string}) =>
  SINGLETON_TYPES.includes(context.schemaType as (typeof SINGLETON_TYPES)[number])
    ? actions.filter((action) => !SINGLETON_ACTIONS.has(action.name))
    : actions;
