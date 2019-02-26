package dtypes

import "strconv"

// Position represents the coordinates of an object in the form (left, top)
type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

// Event represents the events on the client side
type Event struct {
	EventType string `json:"etype"`

	Object string `json:"object"`

	P1Pos Position `json:"p1_pos"`
	P2Pos Position `json:"p2_pos"`

	B1Pos Position `json:"b1_pos"`
	B2Pos Position `json:"b2_pos"`
	B3Pos Position `json:"b3_pos"`

	G1Pos Position `json:"g1_pos"`
	G2Pos Position `json:"g2_pos"`
	G3Pos Position `json:"g3_pos"`
	G4Pos Position `json:"g4_pos"`

	P1Health int `json:"h1"`
	P2Health int `json:"h2"`
}

func (event *Event) GetStr() string {
	replyStr := ""
	replyStr += "EventType:" + event.EventType
	replyStr += ",Object:" + event.Object
	replyStr += "P!Pos:" + strconv.Itoa(event.P1Pos.X)
	replyStr += "P1Pos:" + strconv.Itoa(event.P1Pos.Y)
	replyStr += "P2Pos:" + strconv.Itoa(event.P2Pos.X)
	replyStr += "P2pos:" + strconv.Itoa(event.P2Pos.Y)
	replyStr += "B1Pos:" + strconv.Itoa(event.B1Pos.X)
	replyStr += "B1Pos:" + strconv.Itoa(event.B1Pos.Y)
	return replyStr
}

// GameRedirector redirects when both clients are connected to server
type GameRedirector struct {
	Redirect bool `json:"redirect"`
}

// Debug struct is used for communicating error codes
type Debug struct {
	Code int `json:"code"`
}

type Rect struct {
	XHi int
	YHi int
	XLo int
	YLo int
}

type Gem struct {
	Gemtype byte
	Value   int
	Pos     Rect
}
type Freepos struct {
	Available bool
	Pos       Rect
}
