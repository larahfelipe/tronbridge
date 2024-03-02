package common

import "fmt"

const (
	LocaleEnglish    = "en"
	HexPrefix        = "0x"
	PathSeparator    = "/"
	PathHardenedKey  = "'"
	PathRootKey      = "m"
	TronChildKeyPath = "m/44'/195'/0'/0/0"
	TronNetworkByte  = byte(0x41)
	NullByte         = 0x00
)

var (
	ErrInvalidBitSize        = fmt.Errorf("bit size must be `128` for 12 words or `256` for 24 words")
	ErrInvalidMnemonicPhrase = fmt.Errorf("invalid mnemonic phrase")
	ErrInvalidChildKeyPath   = fmt.Errorf("invalid child derivation path")
)
