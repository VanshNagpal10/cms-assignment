# CMS + Frontend Integration Assignment

A full-stack blog application built with Payload CMS (backend) and Next.js (frontend) demonstrating headless CMS integration.

## Project Structure

```
cms-assignment/
├── cms/                    # Payload CMS Backend
│   ├── src/
│   │   ├── collections/
│   │   │   ├── Categories.ts
│   │   │   ├── BlogPosts.ts
│   │   │   └── Users.ts
│   │   └── payload.config.ts
│   └── package.json
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── page.tsx
│   │   │   └── not-found.tsx
│   │   └── lib/api.ts
│   └── package.json
└── README.md
```

## Features Implemented

### Backend (Payload CMS)
- **BlogPosts Collection**: Title, Slug, Content, Author, Published Date, Category relationship
- **Categories Collection**: Name, Slug with auto-generation
- **RESTful API endpoints** for data access
- **Admin panel** for content management
- **MongoDB database** integration

### Frontend (Next.js)
- **Homepage**: List all blog posts with excerpts, categories, and metadata
- **Blog Detail Page**: Full blog post content accessed by slug
- **Category Pages**: Filter posts by category
- **Responsive Design**: Mobile and desktop optimized
- **Loading States**: Proper error handling and loading feedback
- **SEO Optimization**: Meta tags and proper page titles

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/VanshNagpal10/cms-assignment.git
cd cms-assignment
```

### 2. Setup Backend (Payload CMS)
```bash
# Navigate to CMS directory
cd cms

# Install dependencies
npm install

# Create environment file (optional - uses default MongoDB connection)
cp .env.example .env

# Start the development server
npm run dev
```

The Payload CMS will be available at: `http://localhost:3000`
Admin panel: `http://localhost:3000/admin`

**First time setup:**
1. Visit the admin panel
2. Create your admin user account
3. Add some categories (Technology, Travel, etc.)
4. Create blog posts and assign them to categories

### 3. Setup Frontend (Next.js)
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:3001`

## API Endpoints Used

### Backend API (Payload CMS)
- `GET /api/blog-posts` - Fetch all blog posts
- `GET /api/blog-posts?where[slug][equals]=slug-name` - Fetch post by slug
- `GET /api/blog-posts?where[category][equals]=category-id` - Fetch posts by category
- `GET /api/categories` - Fetch all categories
- `GET /api/categories?where[slug][equals]=category-slug` - Fetch category by slug

### Frontend API Integration
The frontend uses utility functions in `src/lib/api.ts` to:
- Fetch and display blog posts with populated category data
- Handle loading states and error conditions
- Format dates and create excerpts
- Navigate between posts and categories

## Key Technical Decisions

### Backend
- **Database**: MongoDB for flexible document storage
- **Slug Generation**: Automatic slug creation from titles/names
- **Relationships**: BlogPosts belong to Categories (one-to-many)
- **Access Control**: Public read access for frontend consumption

### Frontend
- **Data Fetching**: Server-side rendering with `fetch` API
- **Styling**: Tailwind CSS for responsive design
- **Navigation**: Dynamic routing with Next.js App Router
- **Error Handling**: Custom 404 pages and error boundaries
- **Performance**: No-cache strategy for fresh content

## Environment Variables

### Backend (.env)
```env
DATABASE_URI=mongodb://127.0.0.1/cms-assignment
PAYLOAD_SECRET=your-secret-key-here
```

### Frontend
No environment variables required (uses localhost:3000 for API calls)

## Development Workflow

1. **Start Backend**: Keep Payload CMS running on port 3000
2. **Add Content**: Use admin panel to create categories and posts
3. **Start Frontend**: Run Next.js app on port 3001
4. **Test Features**: Navigate between homepage, posts, and categories

## Testing the Application

1. **Homepage Test**: Verify all posts display with excerpts and categories
2. **Blog Detail Test**: Click post titles to view full content
3. **Category Filter Test**: Click category badges to filter posts
4. **Responsive Test**: Check mobile and desktop layouts
5. **API Test**: Verify data loads correctly and handles errors

## Assumptions Made

- MongoDB is running locally or connection string is provided
- Both applications run on localhost (3000 for CMS, 3001 for frontend)
- Content is publicly accessible (no authentication required for reading)
- Excerpts are limited to first 100 characters of content
- Categories are required for all blog posts
- Slugs are auto-generated from titles/names

## Future Enhancements

### Planned Features (Bonus)
- Search functionality across blog posts
- Pagination or infinite scroll for large datasets
- Deployment to cloud platforms
- Image uploads and rich text editing
- Comments system
- Social sharing buttons

## Troubleshooting

### Common Issues
- **CMS won't start**: Ensure MongoDB is running
- **Frontend shows no posts**: Verify CMS is running on port 3000
- **404 errors**: Check that slugs match between CMS and frontend
- **Build errors**: Ensure all dependencies are installed

### Development Tips
- Use browser dev tools to inspect API responses
- Check terminal logs for backend errors
- Verify data exists in Payload admin panel
- Clear browser cache if changes don't appear

## Technologies Used

- **Backend**: Payload CMS, Node.js, TypeScript, MongoDB
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Tools**: Git, npm, VS Code
