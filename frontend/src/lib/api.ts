const API_URL = 'http://localhost:3001/api'

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  author: string
  publishedDate: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/blog-posts?populate=category`, {
      cache: 'no-store', // Always fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`)
    }
    
    const data: ApiResponse<BlogPost> = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${API_URL}/blog-posts?where[slug][equals]=${slug}&populate=category`,
      {
        cache: 'no-store',
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status}`)
    }
    
    const data: ApiResponse<BlogPost> = await response.json()
    return data.docs[0] || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }
    
    const data: ApiResponse<Category> = await response.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    // First get the category
    const categoriesResponse = await fetch(
      `${API_URL}/categories?where[slug][equals]=${categorySlug}`,
      {
        cache: 'no-store',
      }
    )
    
    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch category: ${categoriesResponse.status}`)
    }
    
    const categoriesData: ApiResponse<Category> = await categoriesResponse.json()
    const category = categoriesData.docs[0]
    
    if (!category) {
      return []
    }
    
    // Then get posts for that category
    const postsResponse = await fetch(
      `${API_URL}/blog-posts?where[category][equals]=${category.id}&populate=category`,
      {
        cache: 'no-store',
      }
    )
    
    if (!postsResponse.ok) {
      throw new Error(`Failed to fetch posts for category: ${postsResponse.status}`)
    }
    
    const postsData: ApiResponse<BlogPost> = await postsResponse.json()
    return postsData.docs
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getExcerpt(content: string, maxLength: number = 100): string {
  // Remove HTML tags if any and get first maxLength characters
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}