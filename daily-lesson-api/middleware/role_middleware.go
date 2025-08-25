package middleware

import (
    "github.com/gofiber/fiber/v2"
    "daily-lesson-api/models"
)

func RequireRole(requiredRole models.UserRole) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userRole := c.Locals("role").(string)
        
        if userRole == string(models.RoleAdmin) {
            return c.Next()
        }
        
        if userRole != string(requiredRole) {
            return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
                "error": "Insufficient permissions",
            })
        }
        
        return c.Next()
    }
}

func TeacherOnly() fiber.Handler {
    return func(c *fiber.Ctx) error {
        userRole := c.Locals("role").(string)
        userID := c.Locals("userID").(uint)
        
        if userRole == string(models.RoleAdmin) || userRole == string(models.RoleSupervisor) {
            return c.Next()
        }
        
        if userRole == string(models.RoleTeacher) {
            c.Locals("teacherID", userID)
            return c.Next()
        }
        
        return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
            "error": "Insufficient permissions",
        })
    }
}