package middleware

import (
    "github.com/gofiber/fiber/v2"
    "daily-lesson-api/utils"
)

func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if len(authHeader) < 8 || authHeader[:7] != "Bearer " {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "error": "Token required",
            })
        }
        
        tokenString := authHeader[7:]
        claims, err := utils.ValidateJWT(tokenString)
        if err != nil {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "error": "Invalid token",
            })
        }
        
        c.Locals("userID", claims.UserID)
        c.Locals("email", claims.Email)
        c.Locals("role", claims.Role)
        
        return c.Next()
    }
}