package address

import (
	"encoding/hex"
	"testing"

	"github.com/btcsuite/btcd/btcec"
	"github.com/stretchr/testify/assert"
)

func TestAddress_ToB58(t *testing.T) {
	expectedResult := "TC36meoLZVm5cfoiDte6vRJqagDBuAH1pk"
	pubKeyHex := "0450823cb6f423c1a5b7c11df8a31c7d5ba17d8329b630c76c302d23629410bdec4dbf4b4b7f0cea33cd2a36e01041b56f78f93da8de64ee620a6ca1975d95bcba"

	pkb, err := hex.DecodeString(pubKeyHex)
	if err != nil {
		t.Errorf("failed decode public key to bytes: %s", err)
	}

	a, err := New(pkb, btcec.S256())
	if err != nil {
		t.Error(err)
	}

	result, err := a.ToB58()
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, expectedResult, result)
}

func TestAddress_B58AddressFromPrivateKey(t *testing.T) {
	expectedResult := "TXAe3Trma1rcaLRgRyJfgp5fSGhQSJ5b9W"
	privKeyHex := "d86bef2b2aecced6a878726c00924541f14b66528428b546134436960ee02270"

	result, err := B58AddressFromPrivateKey(privKeyHex, btcec.S256())
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, expectedResult, result)
}
