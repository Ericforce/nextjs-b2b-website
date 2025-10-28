'use strict';
// Basic sanity check to ensure schemas are registered and include expected document/object types
const assert = require('assert');
const { schemaTypes } = require('../schemas');

function getNames(type) {
  if (Array.isArray(type)) return type.map((t) => t && t.name).filter(Boolean);
  return [];
}

function hasType(name) {
  return schemaTypes.some((t) => t && t.name === name);
}

function main() {
  const names = getNames(schemaTypes);
  const expectedDocs = ['siteSettings', 'page', 'blogPost', 'author', 'category', 'tag'];
  const expectedObjects = [
    'seo',
    'link',
    'blockContent',
    'imageWithAlt',
    'hero',
    'features',
    'featureItem',
    'testimonials',
    'testimonial',
    'cta',
    'stats',
    'stat',
    'faq',
    'faqItem',
    'contentBlock',
  ];

  assert(schemaTypes && Array.isArray(schemaTypes), 'schemaTypes must export an array');
  for (const name of [...expectedDocs, ...expectedObjects]) {
    assert(hasType(name), `Missing schema type: ${name}`);
  }

  // Basic field presence checks on key types
  const blog = schemaTypes.find((t) => t.name === 'blogPost');
  assert(blog.fields.find((f) => f.name === 'title'), 'blogPost.title missing');
  assert(blog.fields.find((f) => f.name === 'slug'), 'blogPost.slug missing');
  assert(blog.fields.find((f) => f.name === 'content'), 'blogPost.content missing');
  assert(blog.fields.find((f) => f.name === 'authors'), 'blogPost.authors missing');

  const page = schemaTypes.find((t) => t.name === 'page');
  assert(page.fields.find((f) => f.name === 'sections'), 'page.sections missing');

  const settings = schemaTypes.find((t) => t.name === 'siteSettings');
  assert(settings.fields.find((f) => f.name === 'navigation'), 'siteSettings.navigation missing');
  assert(settings.fields.find((f) => f.name === 'footerLinks'), 'siteSettings.footerLinks missing');
  assert(settings.fields.find((f) => f.name === 'defaultSeo'), 'siteSettings.defaultSeo missing');

  console.log('sanity:check passed. Registered schema types:', names.join(', '));
}

main();
