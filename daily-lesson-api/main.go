package main

import (
    "log"
    "os"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/joho/godotenv"
    "daily-lesson-api/database"
    "daily-lesson-api/handlers"
    "daily-lesson-api/middleware"
    "daily-lesson-api/utils"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using system environment variables")
    }
    
    // Set JWT secret from environment
    jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
        jwtSecret = "fallback-secret-key-for-development"
        log.Println("WARNING: Using fallback JWT secret")
    }
    utils.SetJWTSecret(jwtSecret)
    
    // Connect to database
    database.Connect()
    
    app := fiber.New()
    
    // Middleware
    app.Use(cors.New(cors.Config{
        AllowOrigins: "*", 
        AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
        AllowHeaders: "*",  
        AllowCredentials: false,
    }))
    
    app.Use(logger.New())
    
    // Root route - untuk menangani request ke "/"
    app.Get("/", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "message": "Daily Lesson API Server is running",
            "version": "1.0.0",
            "endpoints": fiber.Map{
                "auth": "/api   /auth",
                "lessons": "/api/lessons",
                "reports": "/api/reports",
            },
        })
    })
    
    // Health check endpoint
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status": "OK", 
            "database": "connected",
        })
    })
    
    // Public routes
    app.Post("/api/auth/register", handlers.Register)       
    app.Post("/api/auth/login", handlers.Login)             
    
    // Protected routes
    api := app.Group("/api", middleware.JWTMiddleware())
    
    // Auth routes
    api.Get("/auth/profile", handlers.GetProfile)           
    
    // Lesson routes
    api.Get("/lessons", middleware.TeacherOnly(), handlers.GetLessons)          
    api.Get("/lessons/:id", handlers.GetLesson)                                 
    api.Get("/lessons/:id/history", handlers.GetLessonHistory)                  
    api.Get("/reports/teacher", handlers.GetTeacherReport)                      
    
    // Lesson management
    api.Post("/lessons", middleware.TeacherOnly(), handlers.CreateLesson)       
    api.Put("/lessons/:id", middleware.TeacherOnly(), handlers.UpdateLesson)    
    api.Delete("/lessons/:id", middleware.TeacherOnly(), handlers.DeleteLesson) 

    // Tambahkan route activities
    api.Get("/activities", handlers.GetUserActivities)
    
    // Handle 404 - Route not found
    app.Use(func(c *fiber.Ctx) error {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Endpoint not found",
            "message": "The requested endpoint does not exist",
            "path": c.Path(),
        })
    })
    
    port := os.Getenv("SERVER_PORT")
    if port == "" {
        port = "8000"
    }
    
    log.Printf("Server running on port %s", port)
    log.Println("Default users created:")
    log.Println("Admin: admin@sekolah.com / admin123")
    log.Println("Supervisor: supervisor@sekolah.com / supervisor123")
    log.Println("Teacher: guru@sekolah.com / guru123")
    
    app.Listen(":" + port)
}