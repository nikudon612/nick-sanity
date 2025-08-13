import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'Photos', // Make sure this is lowercase and matches `documentTypeList('photo')`
  title: 'Photos',
  type: 'document',
  liveEdit: true, // ✅ Enable live editing
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'order',
      type: 'number',
    }),
  ],
});
