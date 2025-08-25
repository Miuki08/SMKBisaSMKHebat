package utils

import (
    "crypto/rand"
    "encoding/base64"
)

// GenerateJWTSecret membuat JWT secret random sepanjang 32 byte
func GenerateJWTSecret() string {
    b := make([]byte, 32)
    _, err := rand.Read(b)
    if err != nil {
        return "fallback-secret" // kalau ada error, kasih default biar nggak crash
    }
    return base64.StdEncoding.EncodeToString(b)
}
