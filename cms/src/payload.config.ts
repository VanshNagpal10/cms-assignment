// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import 'dotenv/config'
import {Categories} from './collections/Categories'
import {BlogPosts} from './collections/BlogPosts'
import { searchPlugin } from '@payloadcms/plugin-search'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, 
    Media,
    Categories,
    BlogPosts,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    searchPlugin({
      collections: ['blog-posts', 'categories'],
      defaultPriorities: {
        'blog-posts': 2,
        'categories': 1,
      },
      searchOverrides: {
        fields: [
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'excerpt',
            type: 'textarea',
          },
          {
            name: 'meta',
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
              },
              {
                name: 'description',
                type: 'textarea',
              },
            ],
          },
        ],
      },
      beforeSync: ({ originalDoc, searchDoc }) => {
        // Custom logic to modify search document before indexing
        return {
          ...searchDoc,
          title: originalDoc.title,
          excerpt: originalDoc.content ? originalDoc.content.substring(0, 200) + '...' : '',
          meta: {
            title: originalDoc.title,
            description: originalDoc.content ? originalDoc.content.substring(0, 160) + '...' : '',
          },
          // Add category name for better search
          categoryName: originalDoc.category?.name || '',
          author: originalDoc.author,
        }
      },
  
    }),
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  cors: [
    'http://localhost:3000',
  ],
})
