package account

import (
	"fmt"

	"github.com/larahfelipe/tronbridge/pkg/crypto/base58"
	"github.com/larahfelipe/tronbridge/pkg/crypto/mnemonic"
	"golang.org/x/crypto/sha3"
)

type AccountMnemonic struct {
	BitSize int
	Seed    []byte
	Phrase  string
	Locale  string
}

type KeyPair struct {
	PublicKey  string
	PrivateKey string
}

type AccountKey struct {
	Path        string
	Depth       uint8
	IsPrivate   bool
	Fingerprint uint32
	Pair        *KeyPair
}

type AccountCreate struct {
	Address  string
	Mnemonic *AccountMnemonic
	Key      *AccountKey
}

var (
	Network           = []byte{0x41}
	ErrInvalidBitSize = fmt.Errorf("bit size must be `128` for 12 words or `256` for 24 words")
)

const (
	TronChildKeyPath = "m/44'/195'/0'/0/0"
	HexPrefix        = "0x"
)

func ToBase58(data []byte) string {
	h := sha3.NewLegacyKeccak256()
	h.Write(data[1:])
	sh := h.Sum(nil)[12:]

	return base58.CheckEncode(sh, Network[0])
}

func Create(bitSize int, childPathOrLeaveDefault string) (*AccountCreate, error) {
	switch bitSize {
	case 128, 256:
		m, err := mnemonic.New(bitSize)
		if err != nil {
			return nil, err
		}

		m.Seed, err = m.GetSeed("")
		if err != nil {
			return nil, err
		}

		k, err := m.GetMasterKey(m.Seed)
		if err != nil {
			return nil, err
		}

		if len(childPathOrLeaveDefault) == 0 {
			childPathOrLeaveDefault = TronChildKeyPath
		}
		k, err = k.Derive(childPathOrLeaveDefault)
		if err != nil {
			return nil, err
		}

		ecPubKey, err := k.Key.ECPubKey()
		if err != nil {
			return nil, err
		}
		ecPrivKey, err := k.Key.ECPrivKey()
		if err != nil {
			return nil, err
		}

		kp := &KeyPair{
			PublicKey:  fmt.Sprintf("%x", ecPubKey.SerializeUncompressed()),
			PrivateKey: fmt.Sprintf("%x", ecPrivKey.Serialize()),
		}

		return &AccountCreate{
			Mnemonic: &AccountMnemonic{
				BitSize: m.BitSize,
				Seed:    m.Seed,
				Phrase:  m.Phrase,
				Locale:  m.Locale,
			},
			Key: &AccountKey{
				Pair:        kp,
				Path:        k.Path,
				Depth:       k.Key.Depth(),
				IsPrivate:   k.Key.IsPrivate(),
				Fingerprint: k.Key.ParentFingerprint(),
			},
			Address: ToBase58([]byte(kp.PublicKey)),
		}, nil
	default:
		return nil, ErrInvalidBitSize
	}
}
