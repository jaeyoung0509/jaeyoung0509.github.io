package main

import (
	"fmt"
	"os"

	"github.com/jaeyoung0509/myblog/internal/builder"
)

func main() {
	if err := builder.Build(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Site generated successfully in ./dist")
}
