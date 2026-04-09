package builder

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/jaeyoung0509/myblog/internal/content"
	"github.com/jaeyoung0509/myblog/templates"
)

func Build() error {
	// 1. Clean dist
	if err := os.RemoveAll("dist"); err != nil {
		return fmt.Errorf("failed to clean dist: %w", err)
	}
	if err := os.MkdirAll("dist", 0755); err != nil {
		return fmt.Errorf("failed to create dist: %w", err)
	}

	// 2. Copy static
	if err := copyDir("static", "dist/static"); err != nil {
		return fmt.Errorf("failed to copy static: %w", err)
	}

	// 3. Parse posts and pages
	posts, err := content.ParsePosts("content/posts")
	if err != nil {
		return fmt.Errorf("failed to parse posts: %w", err)
	}
	pages, err := content.ParsePosts("content/pages")
	if err != nil {
		return fmt.Errorf("failed to parse pages: %w", err)
	}

	var aboutPage content.Post
	for _, p := range pages {
		if p.Slug == "about" {
			aboutPage = p
			break
		}
	}

	// 4. Generate Landing Page (About)
	f, err := os.Create("dist/index.html")
	if err != nil {
		return fmt.Errorf("failed to create index.html: %w", err)
	}
	defer f.Close()

	if err := templates.Page(aboutPage).Render(context.Background(), f); err != nil {
		return fmt.Errorf("failed to render index: %w", err)
	}

	// 4.1 Generate Blog Listing (/blog/index.html)
	if err := os.MkdirAll("dist/blog", 0755); err != nil {
		return fmt.Errorf("failed to create dist/blog: %w", err)
	}
	fBlog, err := os.Create("dist/blog/index.html")
	if err != nil {
		return fmt.Errorf("failed to create blog index.html: %w", err)
	}
	defer fBlog.Close()

	if err := templates.Index(posts).Render(context.Background(), fBlog); err != nil {
		return fmt.Errorf("failed to render blog index: %w", err)
	}

	// 4.5 Generate search.json
	if err := generateSearchIndex(posts); err != nil {
		return fmt.Errorf("failed to generate search index: %w", err)
	}

	// 5. Generate Posts
	for _, post := range posts {
		postDir := filepath.Join("dist", "posts", post.Slug)
		if err := os.MkdirAll(postDir, 0755); err != nil {
			return fmt.Errorf("failed to create dir for post %s: %w", post.Slug, err)
		}

		f, err := os.Create(filepath.Join(postDir, "index.html"))
		if err != nil {
			return fmt.Errorf("failed to create index.html for post %s: %w", post.Slug, err)
		}
		defer f.Close()

		if err := templates.Post(post).Render(context.Background(), f); err != nil {
			return fmt.Errorf("failed to render post %s: %w", post.Slug, err)
		}
	}

	return nil
}

func copyDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		dstPath := filepath.Join(dst, relPath)

		if info.IsDir() {
			return os.MkdirAll(dstPath, info.Mode())
		}

		srcFile, err := os.Open(path)
		if err != nil {
			return err
		}
		defer srcFile.Close()

		dstFile, err := os.Create(dstPath)
		if err != nil {
			return err
		}
		defer dstFile.Close()

		_, err = io.Copy(dstFile, srcFile)
		return err
	})
}

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

	f, err := os.Create("dist/search.json")
	if err != nil {
		return err
	}
	defer f.Close()

	return json.NewEncoder(f).Encode(items)
}
