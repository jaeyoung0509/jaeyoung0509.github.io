---
title: Building a Static Site Generator with Go & Templ
date: 2025-11-25T21:00:00Z
description: How I built a simple static blog with Go, Templ, Goldmark, and GitHub Actions.
tags: [go, templ, tutorial, github-pages, static-site-generator]
---

# Building a Static Site Generator with Go & Templ

This post walks through the small static site generator behind this blog. The stack is simple on purpose: Go handles the build step, Templ renders HTML, and GitHub Actions takes care of deployment.

## Tech Stack

- **Go**: A good fit for a small build tool, fast to compile and easy to ship as one binary
- **Templ**: HTML templates that compile to Go, which keeps rendering explicit and typed
- **Goldmark**: A Markdown parser that is straightforward to extend when needed
- **GitHub Actions**: Enough CI/CD to build and publish the site without extra moving parts

## 1. Markdown Parsing with Goldmark

Posts live in Markdown files with YAML frontmatter. Here is the shape of the parser:

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

**What this gives us:**
- YAML frontmatter for metadata
- `html.WithUnsafe()` so raw HTML and embeds still work
- Slugs generated from filenames
- Posts sorted by date

## 2. Templ Templates

Templ handles HTML generation. The templates are small enough that the rendering logic stays easy to follow.

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

**What matters here:**
- Tags are clickable links that filter the home page
- `templ.Raw()` renders the HTML produced by Goldmark
- Template mistakes show up at compile time instead of at runtime

## 3. Build System

The builder ties the whole pipeline together:

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

Search is handled with a small bit of vanilla JavaScript:

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

**What it does:**
- Filters as you type
- Searches both titles and tags
- Supports URL-based filtering, so clicking a tag adds `?q=tagname`
- Needs no backend, everything runs client-side

## 5. Tag System

Tags are just links that feed back into the same client-side filtering:

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

**Flow:**
1. Each tag is a link to `/?q=tagname`
2. The search script reads the `?q` parameter
3. Posts are filtered to show only those with matching tags

## 6. Copy Button for Code Blocks

I also inject copy buttons into code blocks:

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

**What it gives us:**
- A button that shows up on hover
- Clipboard API support without an extra library
- Small visual feedback for two seconds after copying

## 7. Development Workflow

For local development, I use Air for live reloading:

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
4. The browser refreshes with the rebuilt output

## 8. GitHub Actions Deployment

Deployment is handled with GitHub Actions:

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
4. From there, every push deploys automatically

## Conclusion

This setup works well for me because:
- **Type safety:** Templ catches template mistakes at compile time
- **Fast builds:** Go keeps the generation step quick
- **Simplicity:** The site works without a frontend framework
- **Room to grow:** It is easy to add comments, dark mode, or other extras later

More than anything, I like that the whole codebase is easy to read and easy to own.
