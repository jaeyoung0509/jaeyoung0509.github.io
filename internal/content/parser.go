package content

import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"gopkg.in/yaml.v3"
)

type Post struct {
	Title       string        `yaml:"title"`
	Date        time.Time     `yaml:"date"`
	Description string        `yaml:"description"`
	Tags        []string      `yaml:"tags"`
	Slug        string        `yaml:"-"`
	Content     template.HTML `yaml:"-"`
	ReadingTime int           `yaml:"-"`
}

func ParsePosts(dir string) ([]Post, error) {
	var posts []Post

	err := filepath.Walk(dir, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !strings.HasSuffix(path, ".md") {
			return nil
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		// Split frontmatter and content
		parts := bytes.SplitN(data, []byte("---"), 3)
		if len(parts) < 3 {
			return fmt.Errorf("invalid markdown format in %s", path)
		}

		var post Post
		if err := yaml.Unmarshal(parts[1], &post); err != nil {
			return fmt.Errorf("failed to parse frontmatter in %s: %w", path, err)
		}

		// Calculate reading time
		wordCount := len(bytes.Fields(parts[2]))
		readingTime := wordCount / 200
		if readingTime == 0 {
			readingTime = 1
		}
		post.ReadingTime = readingTime

		// Parse Markdown
		var buf bytes.Buffer
		md := goldmark.New(
			goldmark.WithExtensions(
				highlighting.NewHighlighting(
					highlighting.WithStyle("dracula"),
				),
			),
			goldmark.WithParserOptions(
				parser.WithAttribute(),
				parser.WithAutoHeadingID(),
			),
			goldmark.WithRendererOptions(html.WithUnsafe()),
		)
		if err := md.Convert(parts[2], &buf); err != nil {
			return fmt.Errorf("failed to parse markdown in %s: %w", path, err)
		}

		post.Content = template.HTML(buf.String())

		// Generate slug from filename
		filename := filepath.Base(path)
		post.Slug = strings.TrimSuffix(filename, ".md")

		posts = append(posts, post)
		return nil
	})

	if err != nil {
		return nil, err
	}

	// Sort by date descending
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Date.After(posts[j].Date)
	})

	return posts, nil
}
