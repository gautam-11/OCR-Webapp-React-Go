package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/otiai10/gosseract"
)

func extractTextFromImage(fileName string) string {
	client := gosseract.NewClient()
	defer client.Close()
	client.SetImage(fileName)
	text, _ := client.Text()
	return text
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("File Upload Endpoint Hit")
	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, _, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err.Error())
		return
	}
	defer file.Close()
	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern

	tempFile, err := ioutil.TempFile("temp-images", "upload-*.png")
	fileName := tempFile.Name()
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)

	text := extractTextFromImage(fileName)
	fmt.Println(text)
	// return that we have successfully uploaded our file!
	w.Write([]byte(text))
}

func setupRoutes() {
	http.HandleFunc("/upload", uploadFile)

	http.ListenAndServe(":8080", nil)
}

func main() {
	fmt.Println("Ready for receiving files")
	setupRoutes()
}
