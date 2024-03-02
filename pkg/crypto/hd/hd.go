package hd

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/larahfelipe/tronbridge/pkg/common"
)

type Key struct {
	Path string
	Key  *hdkeychain.ExtendedKey
}

// NewMasterKeyFromSeed creates a new master key based on the seed bytes.
func NewMasterKeyFromSeed(seed []byte) (*Key, error) {
	masterKey, err := hdkeychain.NewMaster(seed, &chaincfg.MainNetParams)
	if err != nil {
		return nil, fmt.Errorf("failed to generate master key from seed: %s", err)
	}

	return &Key{
		Path: "",
		Key:  masterKey,
	}, nil
}

// DeriveChild derives a new child key from the parent key using the specified derivation path.
func (k *Key) DeriveChild(childPath string) (*Key, error) {
	pathComponents := strings.Split(strings.Trim(childPath, common.PathSeparator), common.PathSeparator)
	if len(pathComponents) == 0 {
		return nil, common.ErrInvalidChildKeyPath
	}

	childKey := k.Key

	for _, c := range pathComponents {
		if c == common.PathRootKey {
			continue
		}

		hardened := strings.HasSuffix(c, common.PathHardenedKey)
		indexTrimmed := strings.TrimSuffix(c, common.PathHardenedKey)
		index, err := strconv.ParseUint(indexTrimmed, 10, 32)
		if err != nil {
			return nil, fmt.Errorf("failed to parse index: %s", err)
		}

		if hardened {
			index += hdkeychain.HardenedKeyStart
		}

		childKey, err = childKey.Child(uint32(index))
		if err != nil {
			return nil, fmt.Errorf("failed to derive master key: %s", err)
		}
	}

	return &Key{
		Path: childPath,
		Key:  childKey,
	}, nil
}
