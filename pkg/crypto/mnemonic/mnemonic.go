package mnemonic

import (
	"fmt"

	"github.com/larahfelipe/tronbridge/pkg/crypto/hd"
	"github.com/tyler-smith/go-bip39"
)

type Mnemonic struct {
	BitSize int
	Seed    []byte
	Phrase  string
	Locale  string
}

func (m *Mnemonic) GetMasterKey(seed []byte) (*hd.Key, error) {
	masterKey, err := hd.NewMasterKey(seed)
	if err != nil {
		return nil, err
	}

	return masterKey, nil
}

func (m *Mnemonic) GetSeed(password string) ([]byte, error) {
	if !bip39.IsMnemonicValid(m.Phrase) {
		return nil, fmt.Errorf("provided mnemonic phrase is invalid")
	}

	seed, err := bip39.NewSeedWithErrorChecking(m.Phrase, password)
	if err != nil {
		return nil, fmt.Errorf("failed to generate seed from mnemonic phrase: %s", err)
	}

	return seed, nil
}

func New(bitSize int) (*Mnemonic, error) {
	if bitSize < 128 || bitSize > 256 || bitSize%32 != 0 {
		return nil, fmt.Errorf("invalid bit size for generating mnemonic phrase: must be between 128 and 256 and a multiple of 32")
	}

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
		Locale:  "en",
	}

	mnemonic.Seed, err = mnemonic.GetSeed("")
	if err != nil {
		return nil, err
	}

	return mnemonic, nil
}
