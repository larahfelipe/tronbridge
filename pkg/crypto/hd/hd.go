package hd

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil/hdkeychain"
)

type Key struct {
	Path string
	Key  *hdkeychain.ExtendedKey
}

const (
	PathSeparator   = "/"
	PathHardenedKey = "'"
	PathRootKey     = "m"
)

func NewMasterKey(seed []byte) (*Key, error) {
	masterKey, err := hdkeychain.NewMaster(seed, &chaincfg.MainNetParams)
	if err != nil {
		return nil, fmt.Errorf("failed to generate master key from seed: %s", err)
	}

	return &Key{
		Path: "",
		Key:  masterKey,
	}, nil
}

func (k *Key) Derive(childPath string) (*Key, error) {
	pathComponents := strings.Split(strings.Trim(childPath, PathSeparator), PathSeparator)
	if len(pathComponents) == 0 {
		return nil, fmt.Errorf("invalid child path")
	}

	childKey := k.Key

	for _, c := range pathComponents {
		if c == PathRootKey {
			continue
		}

		hardened := strings.HasSuffix(c, PathHardenedKey)
		indexTrimmed := strings.TrimSuffix(c, PathHardenedKey)
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
