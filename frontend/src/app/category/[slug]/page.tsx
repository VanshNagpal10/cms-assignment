import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostsByCategory, getAllCategories, formatDate, getExcerpt } from '@/lib/api'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const posts = await getBlogPostsByCategory(params.slug)
  const categories = await getAllCategories()
  const currentCategory = categories.find(cat => cat.slug === params.slug)

  if (!currentCategory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-10">
        
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

        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="bg-blue-900/40 text-blue-400 text-sm font-medium px-3 py-1 rounded-full">
              Category
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{currentCategory.name}</h1>
          <p className="text-lg text-gray-400">
            {posts.length === 0 
              ? `No posts available in ${currentCategory.name}` 
              : `${posts.length} post${posts.length !== 1 ? 's' : ''} in this category`
            }
          </p>
        </div>

        <div className="mb-10">
          <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-3">All Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    category.slug === params.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-md p-10">
              <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400">
                There are no blog posts in the {currentCategory.name} category yet.
              </p>
              <Link 
                href="/"
                className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Browse All Posts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-gray-800 rounded-2xl border border-gray-700 shadow-md hover:shadow-lg transition p-6"
              >

                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-400 transition"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-400 mb-4 line-clamp-3">
                  {getExcerpt(post.content)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-medium text-gray-300">{post.author}</span>
                  <time dateTime={post.publishedDate}>
                    {formatDate(post.publishedDate)}
                  </time>
                </div>

                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center"
                >
                  Read more
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = await getAllCategories()
  const category = categories.find(cat => cat.slug === params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} Posts`,
    description: `Browse all blog posts in the ${category.name} category`,
  }
}
