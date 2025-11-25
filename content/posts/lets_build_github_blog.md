---
title: Building a Static Site Generator with Go & Templ
date: 2025-11-25T21:00:00Z
description: A complete technical guide to building a static blog from scratch using Go, Templ, Goldmark, and GitHub Actions.
tags: [go, templ, tutorial, github-pages, static-site-generator]
---

# Building a Static Site Generator with Go & Templ

In this guide, I'll walk you through building a fully-functional static site generator from scratch. We'll cover every feature in detail, from Markdown parsing to automated deployment.

## Tech Stack

- **Go**: Fast, statically-typed language perfect for build tools
- **Templ**: Type-safe HTML templating that compiles to Go code
- **Goldmark**: Markdown parser with extensibility
- **GitHub Actions**: CI/CD for automated deployment

## 1. Markdown Parsing with Goldmark

Our blog posts are written in Markdown with YAML frontmatter. Here's how we parse them:

### Post Structure

```go
// internal/content/parser.go
type Post struct {
    Title       string        `yaml:"title"`
    Date        time.Time     `yaml:"date"`
    Description string        `yaml:"description"`
    Tags        []string      `yaml:"tags"`
    Slug        string        `yaml:"-"`
    Content     template.HTML `yaml:"-"`
}
```

### Parsing Process

```go
func ParsePosts(dir string) ([]Post, error) {
    var posts []Post
    
    // Walk through all .md files
    err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
        if !strings.HasSuffix(path, ".md") {
            return nil
        }
        
        // Read file
        data, err := os.ReadFile(path)
        if err != nil {
            return err
        }
        
        // Split frontmatter and content
        parts := bytes.SplitN(data, []byte("---"), 3)
        if len(parts) < 3 {
            return fmt.Errorf("invalid frontmatter in %s", path)
        }
        
        // Parse YAML frontmatter
        var post Post
        if err := yaml.Unmarshal(parts[1], &post); err != nil {
            return err
        }
        
        // Parse Markdown body to HTML
        md := goldmark.New(
            goldmark.WithParserOptions(parser.WithAttribute()),
            goldmark.WithRendererOptions(html.WithUnsafe()), // Allow raw HTML
        )
        
        var buf bytes.Buffer
        if err := md.Convert(parts[2], &buf); err != nil {
            return err
        }
        
        post.Content = template.HTML(buf.String())
        post.Slug = strings.TrimSuffix(d.Name(), ".md")
        
        posts = append(posts, post)
        return nil
    })
    
    // Sort by date (newest first)
    sort.Slice(posts, func(i, j int) bool {
        return posts[i].Date.After(posts[j].Date)
    })
    
    return posts, err
}
```

**Key Features:**
- Supports YAML frontmatter for metadata
- Uses `html.WithUnsafe()` to allow raw HTML/iframes for YouTube embeds
- Automatically generates slug from filename
- Sorts posts by date

## 2. Templ Templates

Templ provides type-safe HTML generation. Here are our three main templates:

### Layout Template

```go
// templates/layout.templ
package templates

templ Layout(title string) {
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{ title }</title>
        <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body>
        <div class="container">
            <header>
                <nav>
                    <a href="/" class="logo">jaeyoung0509</a>
                </nav>
            </header>
            <main>
                { children... }
            </main>
            <footer>
                <p>&copy; 2025 jaeyoung0509.</p>
            </footer>
        </div>
        <script>/* Copy button script */</script>
    </body>
    </html>
}
```

### Post Template

```go
// templates/post.templ
templ Post(post content.Post) {
    @Layout(post.Title) {
        <article class="post-full">
            <header>
                <h1>{ post.Title }</h1>
                <div class="meta">
                    <time>{ post.Date.Format("January 02, 2006") }</time>
                    if len(post.Tags) > 0 {
                        <span class="tags">
                            for _, tag := range post.Tags {
                                <a href={ templ.SafeURL(fmt.Sprintf("/?q=%s", tag)) } class="tag">#{ tag }</a>
                            }
                        </span>
                    }
                </div>
            </header>
            <div class="content">
                @templ.Raw(string(post.Content))
            </div>
        </article>
    }
}
```

**Key Features:**
- Tags are clickable links that filter the home page
- Uses `templ.Raw()` to render HTML content from Goldmark
- Type-safe: compiler catches errors like missing fields

## 3. Build System

The builder orchestrates the entire site generation:

```go
// internal/builder/builder.go
func Build() error {
    // 1. Clean dist directory
    os.RemoveAll("dist")
    os.MkdirAll("dist", 0755)
    
    // 2. Copy static files
    copyDir("static", "dist/static")
    
    // 3. Parse all posts
    posts, err := content.ParsePosts("content/posts")
    if err != nil {
        return err
    }
    
    // 4. Generate index.html
    f, _ := os.Create("dist/index.html")
    defer f.Close()
    templates.Index(posts).Render(context.Background(), f)
    
    // 5. Generate search.json for client-side search
    generateSearchIndex(posts)
    
    // 6. Generate individual post pages
    for _, post := range posts {
        postDir := filepath.Join("dist", "posts", post.Slug)
        os.MkdirAll(postDir, 0755)
        
        f, _ := os.Create(filepath.Join(postDir, "index.html"))
        templates.Post(post).Render(context.Background(), f)
        f.Close()
    }
    
    return nil
}
```

### Search Index Generation

```go
func generateSearchIndex(posts []content.Post) error {
    type SearchItem struct {
        Title       string   `json:"title"`
        Slug        string   `json:"slug"`
        Description string   `json:"description"`
        Tags        []string `json:"tags"`
        Date        string   `json:"date"`
    }
    
    var items []SearchItem
    for _, p := range posts {
        items = append(items, SearchItem{
            Title:       p.Title,
            Slug:        p.Slug,
            Description: p.Description,
            Tags:        p.Tags,
            Date:        p.Date.Format("January 02, 2006"),
        })
    }
    
    f, _ := os.Create("dist/search.json")
    defer f.Close()
    return json.NewEncoder(f).Encode(items)
}
```

## 4. Client-Side Search

We implement instant search using vanilla JavaScript:

```javascript
// static/search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const postsList = document.getElementById('posts-list');
    
    if (!searchInput || !postsList) return;
    
    const articles = postsList.querySelectorAll('article');
    
    // Filter function
    const filterPosts = (query) => {
        query = query.toLowerCase();
        articles.forEach(article => {
            const title = article.getAttribute('data-title').toLowerCase();
            const tags = article.getAttribute('data-tags').toLowerCase();
            
            if (title.includes(query) || tags.includes(query)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    };
    
    // Real-time search
    searchInput.addEventListener('input', (e) => {
        filterPosts(e.target.value);
    });
    
    // Support URL query params (e.g., /?q=go)
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
        searchInput.value = query;
        filterPosts(query);
    }
});
```

**Key Features:**
- Real-time filtering as you type
- Searches both title and tags
- URL-based filtering: clicking a tag adds `?q=tagname` to URL
- No backend required - pure client-side

## 5. Tag System

Tags are implemented as clickable links that filter posts:

### In Templates

```go
// Each post has data attributes for JS filtering
<article class="post-preview" 
         data-title={ post.Title } 
         data-tags={ fmt.Sprintf("%v", post.Tags) }>
    // ...
    if len(post.Tags) > 0 {
        <span class="tags">
            for _, tag := range post.Tags {
                <a href={ templ.SafeURL(fmt.Sprintf("/?q=%s", tag)) } 
                   class="tag">#{ tag }</a>
            }
        </span>
    }
</article>
```

**How it works:**
1. Each tag is a link to `/?q=tagname`
2. The search script reads the `?q` parameter
3. Posts are filtered to show only those with matching tags

## 6. Copy Button for Code Blocks

We dynamically inject copy buttons into all code blocks:

```javascript
// In templates/layout.templ <script> tag
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre').forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerText = 'Copy';
        
        button.addEventListener('click', () => {
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            });
        });
        
        pre.appendChild(button);
    });
});
```

**Features:**
- Button appears on hover
- Uses Clipboard API
- Visual feedback ("Copied!") for 2 seconds
- No copy-paste library needed

## 7. Development Workflow

We use Air for live reloading during development:

```toml
# .air.toml
[build]
  cmd = "templ generate && go build -o tmp/main cmd/dev/main.go"
  bin = "tmp/main"
  include_ext = ["go", "templ", "md", "css"]
```

### Dev Server

```go
// cmd/dev/main.go
func main() {
    // Build the site
    if err := builder.Build(); err != nil {
        log.Fatal(err)
    }
    
    // Serve dist folder
    fs := http.FileServer(http.Dir("dist"))
    http.Handle("/", fs)
    
    log.Fatal(http.ListenAndServe(":8082", nil))
}
```

**Workflow:**
1. `air` watches for file changes
2. Runs `templ generate` to compile templates
3. Rebuilds and restarts dev server
4. Browser auto-refreshes

## 8. GitHub Actions Deployment

Automated deployment to GitHub Pages:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-go@v4
        with:
          go-version: '1.24'
      
      - name: Install Templ
        run: go install github.com/a-h/templ/cmd/templ@latest
      
      - name: Generate Templates
        run: templ generate
      
      - name: Build Site
        run: go run cmd/generator/main.go
      
      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
```

**Setup:**
1. Create repository as `username.github.io`
2. Push code to `main` branch
3. Go to Settings → Pages → Source → GitHub Actions
4. Done! Every push auto-deploys

## Conclusion

This blog system demonstrates:
- **Type Safety**: Templ catches template errors at compile time
- **Performance**: Go builds are blazing fast
- **Simplicity**: No JavaScript framework needed
- **Extensibility**: Easy to add features like comments, dark mode, etc.

The entire codebase is simple, maintainable, and completely yours to customize.

Happy blogging! 🚀
