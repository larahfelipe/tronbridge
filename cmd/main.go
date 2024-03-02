package main

import (
	"fmt"

	"github.com/larahfelipe/tronbridge/pkg/module/account"
)

func main() {
	acc, err := account.New(256, "")
	if err != nil {
		panic(err)
	}

	fmt.Println(acc.Address.ToB58())
}
