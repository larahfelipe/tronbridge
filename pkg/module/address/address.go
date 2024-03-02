package address

import (
	"encoding/hex"
	"fmt"

	"github.com/btcsuite/btcd/btcec"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil"
	"github.com/btcsuite/btcutil/base58"
	"github.com/larahfelipe/tronbridge/pkg/common"
	"golang.org/x/crypto/sha3"
)

type Address struct {
	*btcec.PublicKey
}

// Returns a new address based on the provided public key and elliptic curve.
func New(publicKeyBytes []byte, ellipticCurve *btcec.KoblitzCurve) (*Address, error) {
	pk, err := btcec.ParsePubKey(publicKeyBytes, ellipticCurve)
	if err != nil {
		return nil, fmt.Errorf("failed to parse public key: %s", err)
	}

	apk, err := btcutil.NewAddressPubKey(pk.SerializeCompressed(), &chaincfg.Params{
		PubKeyHashAddrID: common.NullByte,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get address from public key: %s", err)
	}

	return &Address{apk.PubKey()}, nil
}

// ToHex converts the address to a hexadecimal string representation.
func (a *Address) ToHex() string {
	return hex.EncodeToString(a.SerializeCompressed())
}

// ToBytes converts the address to a byte slice representation.
func (a *Address) ToBytes() []byte {
	return []byte(a.ToHex())
}

// ToB58 converts the address to a base58-encoded string representation.
func (a *Address) ToB58() (string, error) {
	h := sha3.NewLegacyKeccak256()
	ah := a.ToHex()
	if _, err := h.Write([]byte(ah[1:])); err != nil {
		return "", fmt.Errorf("failed to write hash: %s", err)
	}

	sh := h.Sum(nil)[12:]

	return base58.CheckEncode(sh, common.TronNetworkByte), nil
}

// B58AddressFromPrivateKey returns a base58-encoded string representing the address derived from the provided private key.
func B58AddressFromPrivateKey(privateKeyHex string, ellipticCurve *btcec.KoblitzCurve) (string, error) {
	pkb, err := hex.DecodeString(privateKeyHex)
	if err != nil {
		return "", fmt.Errorf("failed to decode private key to bytes: %s", err)
	}

	pk, _ := btcec.PrivKeyFromBytes(ellipticCurve, pkb)
	a, err := New(pk.PubKey().SerializeUncompressed(), ellipticCurve)
	if err != nil {
		return "", err
	}

	ab58, err := a.ToB58()
	if err != nil {
		return "", err
	}

	return ab58, nil
}
