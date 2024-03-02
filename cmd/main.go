package main

import (
	"fmt"

	"github.com/larahfelipe/tronbridge/pkg/module/account"
)

func main() {
	a, err := account.Create(256, "")
	if err != nil {
		panic(err)
	}

	fmt.Println(a.Key.Path)
	fmt.Println(a.Key.Pair.PublicKey)
	fmt.Println(a.Key.Pair.PrivateKey)
	fmt.Println(a.Address)
}
