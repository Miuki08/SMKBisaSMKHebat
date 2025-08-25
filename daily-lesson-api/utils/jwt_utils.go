package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var JWTSecret = []byte("default-secret-key")

type Claims struct {
    UserID uint   `json:"user_id"`
    Email  string `json:"email"`
    Role   string `json:"role"`
    jwt.RegisteredClaims
}

func GenerateJWT(userID uint, email string, role string) (string, error) {
    claims := &Claims{
        UserID: userID,
        Email:  email,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(JWTSecret)
}

func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}
    
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return JWTSecret, nil
    })
    
    if err != nil {
        return nil, err
    }
    
    if !token.Valid {
        return nil, jwt.ErrSignatureInvalid
    }
    
    return claims, nil
}

func SetJWTSecret(secret string) {
    JWTSecret = []byte(secret)
}