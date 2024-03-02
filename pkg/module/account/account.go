package account

import (
	"github.com/btcsuite/btcd/btcec"
	"github.com/larahfelipe/tronbridge/pkg/common"
	"github.com/larahfelipe/tronbridge/pkg/crypto/mnemonic"
	"github.com/larahfelipe/tronbridge/pkg/module/address"
)

type AccountMnemonic struct {
	BitSize        int
	Seed           []byte
	Phrase, Locale string
}

type KeyPair struct {
	PublicKey, PrivateKey []byte
}

type AccountKey struct {
	Path        string
	Depth       uint8
	IsPrivate   bool
	Fingerprint uint32
	Pair        *KeyPair
}

type AccountNew struct {
	Address  *address.Address
	Mnemonic *AccountMnemonic
	Key      *AccountKey
}

// Creates a new account based on the specified bit size for entropy. For generating 12 words, the bit size must be 128, and for 24 words, it must be 256. Optionally, a custom child derivation path can be provided. For the default path (m/44'/195'/0'/0/0), leave it empty.
func New(bitSize int, childKeyPath string) (*AccountNew, error) {
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

	if len(childKeyPath) == 0 {
		childKeyPath = common.TronChildKeyPath
	}
	k, err = k.DeriveChild(childKeyPath)
	if err != nil {
		return nil, err
	}

	pk, err := k.Key.ECPrivKey()
	if err != nil {
		return nil, err
	}

	kp := &KeyPair{
		PublicKey:  pk.PubKey().SerializeUncompressed(),
		PrivateKey: pk.Serialize(),
	}

	a, err := address.New(kp.PublicKey, btcec.S256())
	if err != nil {
		return nil, err
	}

	return &AccountNew{
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
		Address: a,
	}, nil
}
