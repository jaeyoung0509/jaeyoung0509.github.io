package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jaeyoung0509/myblog/internal/builder"
)

func main() {
	// 1. Build the site
	fmt.Println("Building site...")
	if err := builder.Build(); err != nil {
		fmt.Fprintf(os.Stderr, "Build failed: %v\n", err)
		// Don't exit, so the server can still run (maybe show an error page later?)
		// For now, just log it.
	} else {
		fmt.Println("Build successful!")
	}

	// 2. Serve dist
	fs := http.FileServer(http.Dir("dist"))
	http.Handle("/", fs)

	port := "8082"
	fmt.Printf("Serving on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
