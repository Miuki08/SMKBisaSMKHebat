package handlers

import (
    "github.com/gofiber/fiber/v2"
    "daily-lesson-api/database"
    "daily-lesson-api/models"
    "daily-lesson-api/utils"
)

type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type RegisterRequest struct {
    Name     string          `json:"name"`
    Email    string          `json:"email"`
    Password string          `json:"password"`
    Role     models.UserRole `json:"role"`
}

func Register(c *fiber.Ctx) error {
    var req RegisterRequest
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON",
        })
    }
    
    user := models.User{
        Name:     req.Name,
        Email:    req.Email,
        Password: req.Password,
        Role:     req.Role,
    }
    
    if err := user.HashPassword(); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Could not hash password",
        })
    }
    
    if err := database.DB.Create(&user).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Could not create user - email mungkin sudah digunakan",
        })
    }
    
    token, err := utils.GenerateJWT(user.ID, user.Email, string(user.Role))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Could not generate token",
        })
    }
    
    return c.JSON(fiber.Map{
        "token": token,
        "user": fiber.Map{
            "id":    user.ID,
            "name":  user.Name,
            "email": user.Email,
            "role":  user.Role,
        },
    })
}

func Login(c *fiber.Ctx) error {
    var req LoginRequest
    var user models.User
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON",
        })
    }
    
    if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Email atau password salah",
        })
    }
    
    if !user.CheckPassword(req.Password) {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Email atau password salah",
        })
    }
    
    token, err := utils.GenerateJWT(user.ID, user.Email, string(user.Role))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Could not generate token",
        })
    }
    
    return c.JSON(fiber.Map{
        "token": token,
        "user": fiber.Map{
            "id":    user.ID,
            "name":  user.Name,
            "email": user.Email,
            "role":  user.Role,
        },
    })
}

func GetProfile(c *fiber.Ctx) error {
    userID := c.Locals("userID").(uint)
    var user models.User
    
    if err := database.DB.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "User not found",
        })
    }
    
    return c.JSON(fiber.Map{
        "id":    user.ID,
        "name":  user.Name,
        "email": user.Email,
        "role":  user.Role,
    })
}