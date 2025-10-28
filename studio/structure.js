// Optional desk structure to manage the siteSettings singleton in Studio
// This file is used by the deskTool plugin in sanity.config.ts

module.exports = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('tag').title('Tags'),
    ]);
