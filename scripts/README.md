# News Import Scripts

This directory contains scripts to efficiently import news data from your news service into Supabase database.

## Available Import Methods

### 1. TypeScript Import Script (Recommended)

The TypeScript script (`import-news.ts`) provides a robust, automated way to import news data with proper error handling and batch processing.

#### Features:
- ✅ Automatic category and user creation
- ✅ Tag handling and association
- ✅ Duplicate detection and skipping
- ✅ Batch processing for performance
- ✅ Comprehensive error handling
- ✅ Progress tracking and reporting

#### Usage:

```bash
# Install dependencies first
npm install

# Import mock news data (for testing)
npm run db:seed

# Import from news service (mock data)
npm run import:news

# Import from RSS feeds
npm run import:news:rss
```

#### What it does:
1. Creates an admin user (`admin@newssite.com`) if it doesn't exist
2. Creates all necessary categories with proper colors and descriptions
3. Fetches news data from your news service
4. Maps the data to your database schema
5. Creates tags and associates them with articles
6. Imports articles in batches to avoid overwhelming the database
7. Provides detailed progress reports

### 2. SQL Import Script (Alternative)

The SQL script (`import-news.sql`) provides a direct database approach for advanced users or when you have data in CSV/JSON format.

#### Features:
- ✅ Direct database operations
- ✅ Bulk insert capabilities
- ✅ Performance optimization queries
- ✅ Data verification queries
- ✅ Index creation for better performance

#### Usage:

```bash
# Connect to your Supabase database
psql "your-supabase-connection-string"

# Run the SQL script
\i scripts/import-news.sql
```

## Data Mapping

The import process maps your news service data structure to the database schema:

### News Service Article → Database Article

| News Service Field | Database Field | Notes |
|-------------------|----------------|-------|
| `title` | `title` | Direct mapping |
| `content` | `content` | Falls back to `excerpt` if empty |
| `excerpt` | `excerpt` | Direct mapping |
| `slug` | `slug` | Used for duplicate detection |
| `imageUrl` | `featuredImage` | Direct mapping |
| `category` | `categoryId` | Mapped to category ID |
| `publishedAt` | `publishedAt` | Direct mapping |
| `views` | `views` | Defaults to 0 if not provided |
| `tags` | `ArticleTag` | Creates tag associations |

### Categories

The following categories are automatically created:

- **Business** (`#10B981`) - Business and financial news
- **Sports** (`#F59E0B`) - Sports news and updates
- **Technology** (`#3B82F6`) - Technology and innovation news
- **Lifestyle** (`#EC4899`) - Health, lifestyle and entertainment
- **Politics** (`#EF4444`) - Political news and analysis
- **National Security** (`#6B7280`) - Security and defense news
- **International** (`#8B5CF6`) - International news and affairs
- **National** (`#059669`) - National news and events
- **Finance** (`#DC2626`) - Financial markets and economy
- **Entertainment** (`#F97316`) - Entertainment and celebrity news

## Performance Considerations

### Batch Processing
- Articles are processed in batches of 10 to avoid overwhelming the database
- Small delays between batches prevent connection issues
- Duplicate detection prevents re-importing existing articles

### Database Optimization
- Indexes are created for frequently queried fields
- Table statistics are updated after import
- Connection pooling is handled by Prisma

## Error Handling

The TypeScript script includes comprehensive error handling:

- **Duplicate Articles**: Skipped automatically based on slug
- **Missing Categories**: Logged as warnings, article skipped
- **Database Errors**: Logged with full error details
- **Network Issues**: Handled gracefully with retries

## Monitoring Import Progress

The script provides real-time feedback:

```
🚀 Starting news import process...
📰 Fetching mock news data...
📊 Found 50 articles to import
✅ Created category: Technology
✅ Created admin user: admin@newssite.com
✅ Imported: Breaking Tech News Article
⏭️  Skipping existing article: Duplicate Article
❌ Error importing article "Invalid Article": Category not found

📈 Import Summary:
✅ Imported: 45 articles
⏭️  Skipped: 3 articles (already exist)
❌ Errors: 2 articles
📊 Total processed: 50

🎉 News import completed successfully!
```

## Troubleshooting

### Common Issues

1. **"Category not found" errors**
   - Ensure your news articles use category names that match the predefined categories
   - Add custom categories to the `CATEGORY_MAPPING` in the script

2. **Database connection errors**
   - Verify your Supabase connection string in `.env`
   - Check that your database is accessible
   - Ensure Prisma is properly configured

3. **Duplicate key errors**
   - The script handles duplicates automatically
   - If you see these errors, check your slug generation logic

4. **Memory issues with large datasets**
   - Reduce the batch size in the script
   - Process data in smaller chunks
   - Consider using the SQL approach for very large datasets

### Verification Queries

After import, verify your data:

```sql
-- Check total articles imported
SELECT COUNT(*) FROM "Article" WHERE published = true;

-- Check articles by category
SELECT c.name, COUNT(a.id) as count 
FROM "Category" c 
LEFT JOIN "Article" a ON c.id = a."categoryId" 
GROUP BY c.name;

-- Check recent imports
SELECT title, "createdAt" 
FROM "Article" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

## Customization

### Adding Custom Categories

Edit the `CATEGORY_MAPPING` in `import-news.ts`:

```typescript
const CATEGORY_MAPPING = {
  'Your Category': { 
    slug: 'your-category', 
    color: '#FF5733', 
    description: 'Your category description' 
  },
  // ... existing categories
};
```

### Modifying Data Mapping

Customize the `convertNewsArticleToDbFormat` function to match your specific data structure.

### Batch Size Tuning

Adjust the batch size based on your database performance:

```typescript
// Smaller batches for slower connections
const result = await importArticles(newsArticles, 5);

// Larger batches for faster connections
const result = await importArticles(newsArticles, 20);
```

## Security Notes

- The admin user is created with a default email (`admin@newssite.com`)
- Change the admin email in production environments
- Ensure your database credentials are properly secured
- Use environment variables for sensitive configuration

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your database schema matches the expected structure
3. Ensure all dependencies are installed (`npm install`)
4. Check your Supabase connection and permissions