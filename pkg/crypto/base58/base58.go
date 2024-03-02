package base58

import (
	"crypto/sha256"

	"github.com/btcsuite/btcutil/base58"
)

func Encode(data []byte) string {
	return base58.Encode(data)
}

func Decode(data string) []byte {
	return base58.Decode(data)
}

func CheckEncode(data []byte, version byte) string {
	return base58.CheckEncode(data, version)
}

func CheckEncodeRaw(data []byte) string {
	bs := make([]byte, 0, len(data)+4)
	bs = append(bs, data...)

	cs := checksum(bs)
	bs = append(bs, cs[:]...)

	return base58.Encode(bs)
}

func CheckDecode(data string) (result []byte, version byte, err error) {
	return base58.CheckDecode(data)
}

func checksum(data []byte) (cs [4]byte) {
	h := sha256.Sum256(data)
	h2 := sha256.Sum256(h[:])
	copy(cs[:], h2[:4])

	return
}
