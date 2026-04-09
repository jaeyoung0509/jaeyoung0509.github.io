.PHONY: pdf build dev templ help

## Generate PDF resume and copy to static/
pdf:
	@echo "📄 Generating PDF resume..."
	@cd resume && npx --yes md-to-pdf resume.md
	@cp resume/resume.pdf static/cv_jaeyoung_lee.pdf
	@echo "✅ PDF copied to static/cv_jaeyoung_lee.pdf"

## Generate templ files
templ:
	@echo "🔧 Generating templ files..."
	@go run github.com/a-h/templ/cmd/templ@latest generate

## Build static site
build: templ
	@echo "🏗  Building site..."
	@go run cmd/generator/main.go
	@echo "✅ Site built in ./dist"

## Build site + regenerate PDF
all: pdf build

## Run dev server
dev:
	@go run cmd/dev/main.go

## Show help
help:
	@echo ""
	@echo "Usage:"
	@echo "  make pdf     - Generate PDF resume → static/cv_jaeyoung_lee.pdf"
	@echo "  make build   - Build static site → ./dist"
	@echo "  make all     - Generate PDF + build site"
	@echo "  make dev     - Run local dev server"
	@echo "  make templ   - Regenerate templ Go files"
	@echo ""
