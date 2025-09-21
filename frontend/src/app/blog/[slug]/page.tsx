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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-10 max-w-4xl">

        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition"
          >
            <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
            Back to Home
          </Link>
        </div>

        <article className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 overflow-hidden">
          <div className="p-8">

            <div className="mb-6">
              <Link 
                href={`/category/${post.category.slug}`}
                className="inline-block bg-blue-900/40 text-blue-400 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-900/60 transition"
              >
                {post.category.name}
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-200">{post.author}</p>
                  <p className="text-gray-500 text-sm">Author</p>
                </div>
              </div>
              <time
                dateTime={post.publishedDate}
                className="text-gray-400 text-sm"
              >
                {formatDate(post.publishedDate)}
              </time>
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Category</h3>
                <Link 
                  href={`/category/${post.category.slug}`}
                  className="inline-block bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition"
                >
                  View all {post.category.name} posts
                </Link>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Published on</p>
                <p className="font-medium text-gray-300">
                  {formatDate(post.publishedDate)}
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-10 flex justify-center">
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition"
          >
            Read More Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

// SEO Metadata
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
