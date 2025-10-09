# API Contracts: Personal Blog Customization & Indonesian Language Support

**Date**: 2025-10-09  
**Feature**: Personal Blog Customization & Indonesian Language Support  
**Phase**: 1 - Contracts Design

## Configuration Management

### ConfigurationService

**Purpose**: Manages blog owner profile and site configuration

#### getConfiguration()

```typescript
interface GetConfigurationRequest {
  // No parameters - reads from src/config.ts
}

interface GetConfigurationResponse {
  site: {
    name: string;
    url: string;
    description: string;
    lang: 'en' | 'zh' | 'id';
    ogImage: string;
  };
  author: {
    name: string;
    bio: string;
    avatar: string;
    email: string;
    socialLinks: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      email?: string;
    };
  };
  misc: {
    allowIndexing: boolean;
    analytics: {
      enabled: boolean;
      umamiId?: string;
      umamiUrl?: string;
    };
  };
}

// Validation Rules
// - All required fields must be non-empty strings
// - Social links must be valid URLs if provided
// - Language must be one of supported languages
// - Avatar path must exist in src/assets/
```

#### updateConfiguration()

```typescript
interface UpdateConfigurationRequest {
  author: {
    name: string;
    bio?: string;
    email: string;
    socialLinks?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

interface UpdateConfigurationResponse {
  success: boolean;
  updatedFields: string[];
  validationErrors?: string[];
}

// Business Rules
// - Must maintain TypeScript type safety
// - Social URLs validated for correct domain patterns
// - Changes require rebuild to take effect
// - Backup previous config before update
```

## Language Management

### LanguageService

**Purpose**: Manages trilingual support and language switching

#### getSupportedLanguages()

```typescript
interface GetSupportedLanguagesRequest {
  // No parameters
}

interface GetSupportedLanguagesResponse {
  languages: Array<{
    code: 'en' | 'zh' | 'id';
    name: string;
    nativeName: string;
    flag: string;
    isDefault: boolean;
  }>;
  defaultLanguage: 'en' | 'zh' | 'id';
  fallbackHierarchy: Record<string, string[]>;
}

// Data Contract
// languages: [
//   { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isDefault: true },
//   { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isDefault: false },
//   { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isDefault: false }
// ]
```

#### getTranslations()

```typescript
interface GetTranslationsRequest {
  language: 'en' | 'zh' | 'id';
  keys?: string[]; // Optional: specific keys to retrieve
}

interface GetTranslationsResponse {
  language: string;
  translations: Record<string, string>;
  coverage: {
    total: number;
    translated: number;
    percentage: number;
  };
}

// Validation Rules
// - All UI strings must exist for requested language
// - Fallback to English if translation missing
// - Log missing translations for monitoring
```

#### validateTranslationCoverage()

```typescript
interface ValidateTranslationCoverageRequest {
  // No parameters - validates all languages
}

interface ValidateTranslationCoverageResponse {
  isComplete: boolean;
  languages: Array<{
    code: string;
    missingKeys: string[];
    coverage: number;
  }>;
  recommendations: string[];
}

// Business Rules
// - 100% coverage required for production deployment
// - Indonesian translations are priority for this feature
// - Missing keys should use English fallback with warning
```

## Content Management

### ContentService

**Purpose**: Manages blog posts and content operations

#### getContentPosts()

```typescript
interface GetContentPostsRequest {
  language?: 'en' | 'zh' | 'id';
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'title' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

interface GetContentPostsResponse {
  posts: Array<{
    id: string; // format: {lang}/{slug}
    slug: string;
    language: string;
    title: string;
    description?: string;
    tags: string[];
    publishedDate: string; // ISO date
    updatedDate?: string; // ISO date
    license?: string;
    ogImageUrl?: string;
    hasOtherLanguages: boolean;
    availableLanguages: string[];
  }>;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Performance Constraints
// - Response should be under 100KB for typical queries
// - Support pagination for large content sets
// - Cache results when possible
```

#### getContentPost()

```typescript
interface GetContentPostRequest {
  id: string; // format: {lang}/{slug}
  includeContent?: boolean;
}

interface GetContentPostResponse {
  post: {
    id: string;
    slug: string;
    language: string;
    title: string;
    description?: string;
    content?: string; // Rendered HTML if includeContent=true
    tags: string[];
    publishedDate: string;
    updatedDate?: string;
    license?: string;
    ogImageUrl?: string;
    languageVariants: Array<{
      language: string;
      id: string;
      title: string;
    }>;
  };
  metadata: {
    readingTime: number; // minutes
    wordCount: number;
    lastModified: string;
  };
}

// Business Rules
// - Return 404 if post doesn't exist in requested language
// - Suggest available language variants
// - Content rendering includes math equations and syntax highlighting
```

#### createContentPost()

```typescript
interface CreateContentPostRequest {
  language: 'en' | 'zh' | 'id';
  slug: string;
  title: string;
  content: string; // Markdown
  tags: string[];
  description?: string;
  license?: string;
  isDraft?: boolean;
}

interface CreateContentPostResponse {
  success: boolean;
  post: {
    id: string;
    filePath: string;
    url: string;
  };
  validationErrors?: string[];
}

// Validation Rules
// - Slug must be unique within language
// - Title and tags are required
// - Content must be valid Markdown
// - File created in appropriate language directory
```

#### removeTemplateContent()

```typescript
interface RemoveTemplateContentRequest {
  preserveStructure: boolean; // Keep directory structure
  backupPath?: string; // Optional backup location
}

interface RemoveTemplateContentResponse {
  success: boolean;
  removedFiles: string[];
  preservedFiles: string[];
  backupLocation?: string;
}

// Business Rules
// - Remove all posts in src/content/posts/en/ and src/content/posts/zh/
// - Preserve src/content/posts/id/ structure (create if needed)
// - Keep one template post for reference if requested
// - Update any references in configuration
```

## Search Management

### SearchService

**Purpose**: Manages search functionality and indices

#### buildSearchIndex()

```typescript
interface BuildSearchIndexRequest {
  languages: Array<'en' | 'zh' | 'id'>;
  forceRebuild?: boolean;
}

interface BuildSearchIndexResponse {
  success: boolean;
  indices: Array<{
    language: string;
    filePath: string;
    size: number; // bytes
    postCount: number;
  }>;
  buildTime: number; // milliseconds
}

// Performance Requirements
// - Index build time should be under 5 seconds for 100 posts
// - Index file size should be under 1MB per language
// - Include fuzzy search capabilities
```

#### searchContent()

```typescript
interface SearchContentRequest {
  query: string;
  language?: 'en' | 'zh' | 'id';
  tags?: string[];
  limit?: number;
  threshold?: number; // Fuse.js score threshold
}

interface SearchContentResponse {
  results: Array<{
    post: {
      id: string;
      slug: string;
      title: string;
      description?: string;
      tags: string[];
      language: string;
    };
    score: number; // Relevance score
    matches: Array<{
      field: string;
      value: string;
      indices: [number, number][];
    }>;
  }>;
  query: string;
  searchTime: number; // milliseconds
  total: number;
}

// Performance Requirements
// - Search response time under 100ms for typical queries
// - Support fuzzy matching with configurable threshold
// - Highlight matched terms in results
```

## Asset Management

### AssetService

**Purpose**: Manages images, avatars, and static assets

#### updateAvatar()

```typescript
interface UpdateAvatarRequest {
  imageData: Buffer | File;
  format?: 'webp' | 'png' | 'jpg';
  autoResize?: boolean;
}

interface UpdateAvatarResponse {
  success: boolean;
  avatar: {
    path: string; // src/assets/avatar.webp
    url: string; // Generated URL
    size: {
      width: number;
      height: number;
      bytes: number;
    };
  };
  optimizationStats: {
    originalSize: number;
    optimizedSize: number;
    savings: number; // percentage
  };
}

// Processing Rules
// - Convert to WebP format for optimal performance
// - Resize to 200x200px for consistency
// - Maintain aspect ratio with cropping if needed
// - Generate responsive sizes if needed
```

#### optimizeImages()

```typescript
interface OptimizeImagesRequest {
  targetFormat: 'webp';
  quality?: number; // 1-100, default 85
  generateResponsive?: boolean;
}

interface OptimizeImagesResponse {
  success: boolean;
  optimizedFiles: Array<{
    originalPath: string;
    optimizedPath: string;
    originalSize: number;
    optimizedSize: number;
    savings: number;
  }>;
  totalSavings: {
    bytes: number;
    percentage: number;
  };
}

// Performance Requirements
// - Process all images in under 30 seconds
// - Achieve at least 30% size reduction
// - Maintain visual quality above 85%
```

## Performance Monitoring

### PerformanceService

**Purpose**: Tracks and validates performance metrics

#### measurePerformance()

```typescript
interface MeasurePerformanceRequest {
  pages?: string[]; // Specific pages to test
  device?: 'mobile' | 'desktop';
  networkThrottling?: '3g' | '4g' | 'wifi';
}

interface MeasurePerformanceResponse {
  timestamp: string;
  results: Array<{
    page: string;
    lighthouse: {
      performance: number;
      accessibility: number;
      seo: number;
      bestPractices: number;
    };
    coreWebVitals: {
      lcp: number; // milliseconds
      fid: number; // milliseconds
      cls: number; // score
    };
    bundleSize: {
      javascript: number; // bytes
      css: number; // bytes
      total: number; // bytes
    };
  }>;
  passesRequirements: boolean;
  recommendations: string[];
}

// Validation Thresholds
// - Lighthouse Performance: ≥ 95
// - Lighthouse Accessibility: ≥ 95
// - LCP: < 2.5s
// - FID: < 100ms
// - CLS: < 0.1
// - Bundle size: < 100KB gzipped
```

## Deployment Management

### DeploymentService

**Purpose**: Manages GitHub Pages deployment process

#### validateDeployment()

```typescript
interface ValidateDeploymentRequest {
  environment: 'staging' | 'production';
  checkPerformance?: boolean;
  checkAccessibility?: boolean;
}

interface ValidateDeploymentResponse {
  isValid: boolean;
  checks: {
    buildSuccess: boolean;
    typeCheck: boolean;
    performanceScore?: number;
    accessibilityScore?: number;
    allLanguagesWorking: boolean;
    assetsOptimized: boolean;
  };
  errors: string[];
  warnings: string[];
  deploymentUrl?: string;
}

// Deployment Requirements
// - All TypeScript files must pass type checking
// - All three languages must be accessible
// - Performance requirements must be met
// - No broken links or missing assets
```

#### deployToGitHubPages()

```typescript
interface DeployToGitHubPagesRequest {
  branch?: string; // default: gh-pages
  customDomain?: string;
  forceRebuild?: boolean;
}

interface DeployToGitHubPagesResponse {
  success: boolean;
  deploymentId: string;
  url: string;
  buildTime: number; // milliseconds
  deploymentStatus: 'building' | 'deployed' | 'failed';
  errors?: string[];
}

// Deployment Process
// 1. Run type checking and linting
// 2. Build static site with all languages
// 3. Optimize all assets
// 4. Deploy to GitHub Pages
// 5. Validate deployment success
```

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  requestId?: string;
}

// Error Codes
// CONFIG_INVALID - Configuration validation failed
// LANG_NOT_SUPPORTED - Requested language not available
// CONTENT_NOT_FOUND - Content does not exist
// SEARCH_INDEX_CORRUPT - Search index needs rebuilding
// PERFORMANCE_BELOW_THRESHOLD - Performance requirements not met
// DEPLOYMENT_FAILED - Deployment process failed
// ASSET_OPTIMIZATION_FAILED - Image optimization failed
```

## Rate Limiting & Performance

### General Constraints

- All API operations should complete within 5 seconds
- Search operations must complete within 100ms
- File operations (create/update) should complete within 2 seconds
- Build operations allowed up to 60 seconds for full site rebuild
- Memory usage should not exceed 512MB during any operation

### Caching Strategy

- Configuration cached until file modification
- Translation data cached per language
- Search indices cached until content changes
- Performance metrics cached for 1 hour
- Asset optimization results cached until source changes
