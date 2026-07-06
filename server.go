package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	dir := "./dist"
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		log.Fatalf("Ошибка: директория %s не найдена. Сделайте 'npm run build' перед запуском сервера.", dir)
	}

	fs := http.FileServer(http.Dir(dir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Clean(r.URL.Path)
		fullPath := filepath.Join(dir, path)

				if !strings.HasPrefix(fullPath, filepath.Clean(dir)) {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		info, err := os.Stat(fullPath)
		if err != nil || info.IsDir() {
						http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}

		fs.ServeHTTP(w, r)
	})

	log.Printf("🛰️  Микро-сервер фронтенда запущен на порту %s...", port)
	if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}