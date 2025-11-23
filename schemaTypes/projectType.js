import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  liveEdit: true,
  fields: [
    // original fields
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),

   
    defineField({
      name: 'image',
      type: 'image',
      title: 'Main Image',
      options: { hotspot: true }
    }),

    // 🔽 NEW: main video fields (upload + URL)
    defineField({
      name: 'mainVideoFile',
      title: 'Main Video (upload)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Optional. If set, this will be used as the main showcase asset instead of the image.'
    }),

    defineField({
      name: 'mainVideoUrl',
      title: 'Main Video URL (YouTube/Vimeo)',
      type: 'url',
      description: 'Optional. Used as main showcase asset (takes priority over upload and image).'
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [{ name: 'href', type: 'url', title: 'URL' }]
              }
            ]
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),

    // link routing
    defineField({
      name: 'linkMode',
      title: 'Link Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Internal detail page', value: 'internal' },
          { title: 'External link', value: 'external' },
          { title: 'No link', value: 'none' }
        ],
        layout: 'radio'
      },
      initialValue: 'external',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkMode !== 'external',
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const mode = ctx?.parent?.linkMode;
          if (mode === 'external' && !val) return 'External URL is required when Link Mode is External';
          return true;
        })
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const mode = ctx?.parent?.linkMode;
          if (mode === 'internal' && !val?.current) return 'Slug is required when Link Mode is Internal';
          return true;
        })
    }),

    defineField({
      name: 'order',
      type: 'number',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Web', value: 'web' },
          { title: 'Production', value: 'production' },
          { title: 'Photo', value: 'photo' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery (Images)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              options: { isHighlighted: true }
            }
          ]
        }
      ],
      options: { layout: 'grid' }
    }),

    // detail page fields (only when internal)
    defineField({
      name: 'shortDescription',
      title: 'Short Description (1–2 sentences)',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      validation: (Rule) => Rule.max(300).warning('Keep this tight for previews and SEO.')
    }),

    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      hidden: ({ parent }) => parent?.linkMode !== 'internal'
    }),

    defineField({
      name: 'agency',
      title: 'Agency / Production Company',
      type: 'string',
      hidden: ({ parent }) => parent?.linkMode !== 'internal'
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      hidden: ({ parent }) => parent?.linkMode !== 'internal'
    }),

    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      of: [
        {
          type: 'object',
          name: 'credit',
          fields: [
            { name: 'role', type: 'string', title: 'Role' },
            { name: 'name', type: 'string', title: 'Name' }
          ],
          preview: {
            select: { role: 'role', name: 'name' },
            prepare: ({ role, name }) => ({
              title: name || '—',
              subtitle: role || '—'
            })
          }
        }
      ]
    }),

    defineField({
      name: 'hero',
      title: 'Hero Media',
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      type: 'object',
      fields: [
        { name: 'image', title: 'Hero Image', type: 'image', options: { hotspot: true } },
        { name: 'videoFile', title: 'Hero Video (upload)', type: 'file', options: { accept: 'video/*' } },
        { name: 'videoUrl', title: 'Hero Video URL (YouTube/Vimeo)', type: 'url', description: 'If set, this will be used instead of videoFile.' }
      ],
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const mode = ctx?.parent?.linkMode;
          if (mode !== 'internal') return true;
          if (!val) return 'Add an image or a video for the hero.';
          if (!val.image && !val.videoFile && !val.videoUrl) return 'Add an image or a video for the hero.';
          return true;
        })
    }),

    defineField({
      name: 'detailGallery',
      title: 'Detail Gallery (Images + Videos)',
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      type: 'array',
      of: [
        {
          type: 'image',
          name: 'galleryImage',
          title: 'Image',
          options: { hotspot: true },
          fields: [{ name: 'caption', type: 'string', title: 'Caption' }]
        },
        {
          type: 'object',
          name: 'galleryVideo',
          title: 'Video (upload)',
          fields: [
            { name: 'file', type: 'file', title: 'Video File', options: { accept: 'video/*' }, validation: (Rule) => Rule.required() },
            { name: 'caption', type: 'string', title: 'Caption' }
          ],
          preview: {
            select: { caption: 'caption', asset: 'file.asset' },
            prepare: ({ caption, asset }) => ({
              title: caption || 'Video',
              subtitle: asset && asset._ref ? 'Uploaded' : 'Missing file'
            })
          }
        },
        {
          type: 'object',
          name: 'galleryVideoUrl',
          title: 'Video (URL)',
          fields: [
            { name: 'url', type: 'url', title: 'Video URL', description: 'YouTube or Vimeo link' },
            { name: 'caption', type: 'string', title: 'Caption' }
          ],
          preview: {
            select: { url: 'url', caption: 'caption' },
            prepare: ({ url, caption }) => ({
              title: caption || 'Linked Video',
              subtitle: url || 'No URL'
            })
          }
        }
      ],
      options: { layout: 'grid' }
    }),

    // visibility / private link
    defineField({
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Unlisted (private link)', value: 'unlisted' }
        ],
        layout: 'radio'
      },
      initialValue: 'public'
    }),

    defineField({
      name: 'secretKey',
      title: 'Private Link Key',
      type: 'string',
      description: 'Used as ?k=… in the private link. Auto-generated.',
      readOnly: true,
      hidden: ({ parent }) => parent?.visibility !== 'unlisted',
      initialValue: () => (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2))
    })
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      type: 'projectType',
      mode: 'linkMode',
      url: 'url',
      slug: 'slug.current',
      visibility: 'visibility'
    },
    prepare({ title, media, type, mode, url, slug, visibility }) {
      const dest =
        mode === 'internal' ? `/Work/${slug || '—'}` :
        mode === 'external' ? (url || '—') :
        'No link';
      const vis = visibility || 'public';
      return {
        title,
        media,
        subtitle: `${type || '—'} • ${mode || '—'} → ${dest} • ${vis}`
      };
    }
  }
});
