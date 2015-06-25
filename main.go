package main

import (
	"bytes"
	"code.google.com/p/go.net/websocket"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"io"
	"time"

	"net/http"
)

func main() {
	r := mux.NewRouter()
	fileHandler := http.StripPrefix("/public/", http.FileServer(http.Dir("./public/")))
	http.Handle("/public/", fileHandler)

	r.HandleFunc("/img", ImgHandler)
	r.HandleFunc("/set", SetHandler)
	r.HandleFunc("/css", CssHandler)

	r.HandleFunc("/", HomeHandler)

	r.Handle("/ws/", websocket.Handler(EchoHandler))

	http.Handle("/", r)

	address := ":8080"
	fmt.Println("Server started on ", address)
	if err := http.ListenAndServe(address, nil); err != nil {
		panic(err)
	}
}

func HomeHandler(w http.ResponseWriter, req *http.Request) {
	index, err := template.ParseFiles("templates/index.html")
	if err != nil {
		fmt.Fprint(w, err)
	}

	index.Execute(w, "Test")
}

var WsList []*websocket.Conn

func EchoHandler(ws *websocket.Conn) {
	WsList = append(WsList, ws)

	io.Copy(ws, ws)
}

func SetHandler(w http.ResponseWriter, req *http.Request) {
	v := req.FormValue("v")
	if v == "" {
		fmt.Fprintf(w, "?v=")
		return
	}
	i := sendToAll("message", v)

	fmt.Fprintf(w, "Wyslany komunikat do %d odbiorców", i)
}

func ImgHandler(w http.ResponseWriter, req *http.Request) {
	v := req.FormValue("v")
	if v == "" {
		fmt.Fprintf(w, "?v=")
		return
	}
	i := sendToAll("img", v)

	fmt.Fprintf(w, "Wyslany komunikat do %d odbiorców", i)
}

func CssHandler(w http.ResponseWriter, req *http.Request) {
	v := req.FormValue("v")
	if v == "" {
		fmt.Fprintf(w, "?v=")
		return
	}
	i := sendToAll("css", v)

	fmt.Fprintf(w, "Wyslany komunikat do %d odbiorców", i)
}

func sendToAll(messageType, value string) int {
	m := &Message{
		Type: messageType,
		Text: value,
		Date: time.Now(),
	}

	ms, _ := json.Marshal(m)

	i := 0
	for _, ws := range WsList {
		io.Copy(ws, bytes.NewReader(ms))

		i++
	}
	return i
}

type Message struct {
	Type string
	Text string
	Date time.Time
}
