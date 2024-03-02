package mnemonic

import (
	"fmt"

	"github.com/larahfelipe/tronbridge/pkg/common"
	"github.com/larahfelipe/tronbridge/pkg/crypto/hd"
	"github.com/tyler-smith/go-bip39"
)

type Mnemonic struct {
	BitSize        int
	Seed           []byte
	Phrase, Locale string
}

// GetMasterKey returns a new master key based on the seed bytes.
func (m *Mnemonic) GetMasterKey(seed []byte) (*hd.Key, error) {
	masterKey, err := hd.NewMasterKeyFromSeed(seed)
	if err != nil {
		return nil, err
	}

	return masterKey, nil
}

// GetSeed returns a hashed seed based on the mnemonic phrase and a password.
func (m *Mnemonic) GetSeed(password string) ([]byte, error) {
	if !bip39.IsMnemonicValid(m.Phrase) {
		return nil, common.ErrInvalidMnemonicPhrase
	}

	seed, err := bip39.NewSeedWithErrorChecking(m.Phrase, password)
	if err != nil {
		return nil, fmt.Errorf("failed to generate seed from mnemonic phrase: %s", err)
	}

	return seed, nil
}

// Returns a new mnemonic based on the specified bit size for entropy. For generating 12 words, the bit size must be 128, and for 24 words, it must be 256.
func New(bitSize int) (*Mnemonic, error) {
	switch bitSize {
	case 128, 256:
		entropy, err := bip39.NewEntropy(bitSize)
		if err != nil {
			return nil, fmt.Errorf("failed to generate entropy from bit size: %s", err)
		}

		mnemonicPhrase, err := bip39.NewMnemonic(entropy)
		if err != nil {
			return nil, fmt.Errorf("failed to generate mnemonic phrase from entropy: %s", err)
		}

		mnemonic := &Mnemonic{
			BitSize: bitSize,
			Phrase:  mnemonicPhrase,
			Locale:  common.LocaleEnglish,
		}

		mnemonic.Seed, err = mnemonic.GetSeed("")
		if err != nil {
			return nil, err
		}

		return mnemonic, nil
	default:
		return nil, common.ErrInvalidBitSize
	}
}
