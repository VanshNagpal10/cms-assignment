import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, formatDate } from '@/lib/api'

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Category Badge */}
            <div className="mb-6">
              <Link 
                href={`/category/${post.category.slug}`}
                className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {post.category.name}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-gray-500 text-sm">Author</p>
                </div>
              </div>
              <time 
                dateTime={post.publishedDate}
                className="text-gray-500 text-sm"
              >
                {formatDate(post.publishedDate)}
              </time>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-blue max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {/* Tags/Related */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Category</h3>
                  <Link 
                    href={`/category/${post.category.slug}`}
                    className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    View all {post.category.name} posts
                  </Link>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Published on</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(post.publishedDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Read More Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160) + '...',
  }
}