package handlers

import (
    "daily-lesson-api/database"
    "daily-lesson-api/models"
    "strconv"

    "github.com/gofiber/fiber/v2"
)

// GetUserActivities mendapatkan aktivitas user
func GetUserActivities(c *fiber.Ctx) error {
    // Mendapatkan parameter query untuk pagination
    limitStr := c.Query("limit", "10")
    limit, err := strconv.Atoi(limitStr)
    if err != nil {
        limit = 20
    }

    var activities []models.Activity

    // Query untuk mendapatkan semua aktivitas
    result := database.DB.Order("created_at DESC").Limit(limit).Find(&activities)

    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error":   "Failed to fetch activities",
            "message": result.Error.Error(),
        })
    }

    return c.JSON(fiber.Map{
        "activities": activities,
        "total":      len(activities),
    })
}

// CreateActivity untuk membuat aktivitas baru (akan dipanggil dari handler lain)
func CreateActivity(performedBy, action, description string) error {
    activity := models.Activity{
        Action:      action,
        Description: description,
        PerformedBy: performedBy,
    }

    result := database.DB.Create(&activity)
    return result.Error
}