package database

import (
    "log"
    "os"
    "daily-lesson-api/models"
    "github.com/glebarez/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
    // Create database directory if not exists
    if err := os.MkdirAll("data", os.ModePerm); err != nil {
        log.Fatal("Failed to create data directory:", err)
    }

    // SQLite connection dengan Pure Go driver
    db, err := gorm.Open(sqlite.Open("data/database.db"), &gorm.Config{
        DisableForeignKeyConstraintWhenMigrating: true, // Optional: untuk avoid warning
    })
    
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    
    DB = db
    
    // Auto migrate tables
    err = DB.AutoMigrate(
        &models.User{},
        &models.DailyLesson{},
        &models.LessonReport{},
        &models.Activity{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    log.Println("SQLite database connected successfully (Pure Go driver)")
    
    // Create default users if not exists
    createDefaultUsers()
    
    // Create sample activities if table is empty
    createSampleActivities()
}

func createDefaultUsers() {
    // Create admin user
    var admin models.User
    result := DB.Where("email = ?", "admin@sekolah.com").First(&admin)
    
    if result.Error != nil {
        admin := models.User{
            Name:     "Administrator",
            Email:    "admin@sekolah.com",
            Password: "admin123",
            Role:     models.RoleAdmin,
        }
        
        if err := admin.HashPassword(); err != nil {
            log.Println("Failed to hash admin password:", err)
            return
        }
        
        if err := DB.Create(&admin).Error; err != nil {
            log.Println("Failed to create admin user:", err)
        } else {
            log.Println("Default admin user created: admin@sekolah.com / admin123")
        }
    }

    // Create supervisor user
    var supervisor models.User
    result = DB.Where("email = ?", "supervisor@sekolah.com").First(&supervisor)
    
    if result.Error != nil {
        supervisor := models.User{
            Name:     "Supervisor",
            Email:    "supervisor@sekolah.com",
            Password: "supervisor123",
            Role:     models.RoleSupervisor,
        }
        
        if err := supervisor.HashPassword(); err != nil {
            log.Println("Failed to hash supervisor password:", err)
            return
        }
        
        if err := DB.Create(&supervisor).Error; err != nil {
            log.Println("Failed to create supervisor user:", err)
        } else {
            log.Println("Default supervisor user created: supervisor@sekolah.com / supervisor123")
        }
    }

    // Create teacher user
    var teacher models.User
    result = DB.Where("email = ?", "guru@sekolah.com").First(&teacher)
    
    if result.Error != nil {
        teacher := models.User{
            Name:     "Guru Contoh",
            Email:    "guru@sekolah.com",
            Password: "guru123",
            Role:     models.RoleTeacher,
        }
        
        if err := teacher.HashPassword(); err != nil {
            log.Println("Failed to hash teacher password:", err)
            return
        }
        
        if err := DB.Create(&teacher).Error; err != nil {
            log.Println("Failed to create teacher user:", err)
        } else {
            log.Println("Default teacher user created: guru@sekolah.com / guru123")
        }
    }
}

// Fungsi untuk membuat sample activities jika tabel kosong
func createSampleActivities() {
    var count int64
    DB.Model(&models.Activity{}).Count(&count)
    
    if count == 0 {
        sampleActivities := []models.Activity{
            {
                Action:       "login",
                Description:  "User admin@sekolah.com logged in to the system",
                PerformedBy:  "admin@sekolah.com",
            },
            {
                Action:       "create",
                Description:  "Membuat lesson baru: Matematika Kelas 10",
                PerformedBy:  "guru@sekolah.com",
            },
            {
                Action:       "update",
                Description:  "Memperbarui lesson: Bahasa Indonesia Kelas 11",
                PerformedBy:  "supervisor@sekolah.com",
            },
            {
                Action:       "view",
                Description:  "Melihat laporan guru",
                PerformedBy:  "admin@sekolah.com",
            },
        }
        
        for _, activity := range sampleActivities {
            if err := DB.Create(&activity).Error; err != nil {
                log.Printf("Failed to create sample activity: %v", err)
            }
        }
        
        log.Println("Sample activities created successfully")
    }
}   