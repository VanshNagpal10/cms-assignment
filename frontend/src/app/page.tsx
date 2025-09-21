'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogPost, getAllBlogPosts, formatDate, getExcerpt } from '@/lib/api'

export default function HomePage() {

  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([])
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch posts when component first loads
  useEffect(() => {
    async function loadPosts() {
      console.log('Loading posts...')
      const posts = await getAllBlogPosts()
      console.log('Posts loaded:', posts.length)
      
      setAllPosts(posts)
      setDisplayedPosts(posts)
      setIsLoading(false)
    }
    
    loadPosts()
  }, [])

  // Filter posts when search text changes
  useEffect(() => {
    console.log('Searching for:', searchText)
    
    if (searchText === '') {
      setDisplayedPosts(allPosts)
    } else {
      // Filter posts that match the search text
      const filtered = allPosts.filter(post => {
        // Convert everything to lowercase for case-insensitive search
        const searchLower = searchText.toLowerCase()
        
        // Check if search text is found in:
        const titleMatch = post.title.toLowerCase().includes(searchLower)
        const contentMatch = post.content.toLowerCase().includes(searchLower)
        const authorMatch = post.author.toLowerCase().includes(searchLower)
        const categoryMatch = post.category.name.toLowerCase().includes(searchLower)
        
        // Return true if found in any field
        return titleMatch || contentMatch || authorMatch || categoryMatch
      })
      
      console.log('Filtered results:', filtered.length)
      setDisplayedPosts(filtered)
    }
  }, [searchText, allPosts])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = event.target.value
    setSearchText(newSearchText)
  }

  const clearSearch = () => {
    setSearchText('')
  }

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">My Blog</h1>
        <p className="text-gray-400 animate-pulse">Loading posts...</p>
      </div>
    </div>
  )
}

if (allPosts.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">My Blog</h1>
        <p className="text-gray-400">No posts available. Make sure your CMS is running.</p>
      </div>
    </div>
  )
}

return (
  <div className="min-h-screen bg-gray-900">
    <div className="container mx-auto px-6 py-12">

      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">CMS Blog</h1>
        <p className="text-lg text-gray-400">Search, explore & discover amazing stories. </p>
      </div>

      <div className="max-w-lg mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder=" Search posts"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full px-5 py-3 rounded-2xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {searchText && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-200 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchText && (
        <p className="text-center mb-8 text-gray-400">
          {displayedPosts.length === 0 
            ? `No posts found for "${searchText}"`
            : `Found ${displayedPosts.length} post${displayedPosts.length !== 1 ? 's' : ''} for "${searchText}"`
          }
        </p>
      )}

      {displayedPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-6 text-lg">No posts match your search.</p>
          <button 
            onClick={clearSearch}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
          >
            Show All Posts
          </button>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayedPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-gray-700"
            >
              <div className="mb-4">
                <Link 
                  href={`/category/${post.category.slug}`}
                  className="inline-block bg-blue-900/30 text-blue-400 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-900/50 transition"
                >
                  {post.category.name}
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-400"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-400 mb-5 line-clamp-3">
                {getExcerpt(post.content)}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-5">
                <span className="font-medium text-gray-300">{post.author}</span>
                <span>{formatDate(post.publishedDate)}</span>
              </div>

              <Link 
                href={`/blog/${post.slug}`}
                className="inline-block text-blue-400 font-medium hover:text-blue-300 transition"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}

      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>Built with <span className="font-semibold text-white">Payload CMS</span></p>
      </footer>
    </div>
  </div>
)

}