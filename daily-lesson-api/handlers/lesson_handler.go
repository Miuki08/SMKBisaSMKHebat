    package handlers

    import (
        "github.com/gofiber/fiber/v2"
        "daily-lesson-api/database"
        "daily-lesson-api/models"
        "time"
    )

    type CreateLessonRequest struct {
        NamaGuru       string `json:"nama_guru"`
        MataPelajaran  string `json:"mata_pelajaran"`
        Kelas          string `json:"kelas"`
        PokokMateri    string `json:"pokok_materi"`
        BuktiMengajar  string `json:"bukti_mengajar"`
        TanggalMengajar string `json:"tanggal_mengajar"`
        JamMulai       string `json:"jam_mulai"`
        JamSelesai     string `json:"jam_selesai"`
        Status         string `json:"status"`
        Catatan        string `json:"catatan"`
    }

    func CreateLesson(c *fiber.Ctx) error {
        var req CreateLessonRequest
        userID := c.Locals("userID").(uint)
        userRole := c.Locals("role").(string)
        
        if err := c.BodyParser(&req); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Cannot parse JSON",
            })
        }
        
        tanggalMengajar, err := time.Parse("2006-01-02", req.TanggalMengajar)
        if err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Format tanggal tidak valid. Gunakan format YYYY-MM-DD",
            })
        }
        
        lesson := models.DailyLesson{
            NamaGuru:       req.NamaGuru,
            MataPelajaran:  req.MataPelajaran,
            Kelas:          req.Kelas,
            PokokMateri:    req.PokokMateri,
            BuktiMengajar:  req.BuktiMengajar,
            TanggalMengajar: tanggalMengajar,
            JamMulai:       req.JamMulai,
            JamSelesai:     req.JamSelesai,
            Status:         req.Status,
            Catatan:        req.Catatan,
            CreatedByID:    userID,
        }
        
        if err := database.DB.Create(&lesson).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not create lesson record",
            })
        }
        
        action := "CREATE"
        if userRole == "admin" {
            action = "CREATE_ADMIN"
        }
        
        history := models.LessonReport{
            LessonID:     lesson.ID,
            Action:       action,
            Description:  "Catatan mengajar dibuat",
            PerformedBy:  userID,
        }
        database.DB.Create(&history)
        
        return c.JSON(lesson)
    }

    func GetLessons(c *fiber.Ctx) error {
        var lessons []models.DailyLesson
        userRole := c.Locals("role").(string)
        userID := c.Locals("userID").(uint)
        
        query := database.DB.Preload("CreatedBy")
        
        if userRole == "teacher" {
            query = query.Where("created_by_id = ?", userID)
        }
        
        if tanggal := c.Query("tanggal"); tanggal != "" {
            query = query.Where("date(tanggal_mengajar) = ?", tanggal)
        }
        
        if guru := c.Query("guru"); guru != "" {
            query = query.Where("nama_guru LIKE ?", "%"+guru+"%")
        }
        
        if mapel := c.Query("mapel"); mapel != "" {
            query = query.Where("mata_pelajaran LIKE ?", "%"+mapel+"%")
        }
        
        if kelas := c.Query("kelas"); kelas != "" {
            query = query.Where("kelas = ?", kelas)
        }
        
        query = query.Order("tanggal_mengajar DESC, created_at DESC")
        
        if err := query.Find(&lessons).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not fetch lessons",
            })
        }
        
        return c.JSON(lessons)
    }

    func GetLesson(c *fiber.Ctx) error {
        id := c.Params("id")
        var lesson models.DailyLesson
        
        if err := database.DB.Preload("CreatedBy").First(&lesson, id).Error; err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
                "error": "Lesson record not found",
            })
        }
        
        return c.JSON(lesson)
    }

    func UpdateLesson(c *fiber.Ctx) error {
        id := c.Params("id")
        userID := c.Locals("userID").(uint)
        userRole := c.Locals("role").(string)
        var lesson models.DailyLesson
        var updateData map[string]interface{}
        
        if err := c.BodyParser(&updateData); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Cannot parse JSON",
            })
        }
        
        if err := database.DB.First(&lesson, id).Error; err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
                "error": "Lesson record not found",
            })
        }
        
        if userRole == "teacher" && lesson.CreatedByID != userID {
            return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
                "error": "Anda hanya dapat mengubah data sendiri",
            })
        }
        
        if err := database.DB.Model(&lesson).Updates(updateData).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not update lesson record",
            })
        }
        
        action := "UPDATE"
        if userRole == "admin" {
            action = "UPDATE_ADMIN"
        }
        
        history := models.LessonReport{
            LessonID:     lesson.ID,
            Action:       action,
            Description:  "Catatan mengajar diperbarui",
            PerformedBy:  userID,
        }
        database.DB.Create(&history)
        
        return c.JSON(lesson)
    }

    func DeleteLesson(c *fiber.Ctx) error {
        id := c.Params("id")
        userID := c.Locals("userID").(uint)
        userRole := c.Locals("role").(string)
        var lesson models.DailyLesson
        
        if err := database.DB.First(&lesson, id).Error; err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
                "error": "Lesson record not found",
            })
        }
        
        if userRole == "teacher" && lesson.CreatedByID != userID {
            return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
                "error": "Anda hanya dapat menghapus data sendiri",
            })
        }
        
        if err := database.DB.Delete(&lesson).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not delete lesson record",
            })
        }
        
        action := "DELETE"
        if userRole == "admin" {
            action = "DELETE_ADMIN"
        }
        
        history := models.LessonReport{
            LessonID:     lesson.ID,
            Action:       action,
            Description:  "Catatan mengajar dihapus",
            PerformedBy:  userID,
        }
        database.DB.Create(&history)
        
        return c.JSON(fiber.Map{
            "message": "Lesson record deleted successfully",
        })
    }

    func GetLessonHistory(c *fiber.Ctx) error {
        lessonID := c.Params("id")
        var history []models.LessonReport
        
        if err := database.DB.Where("lesson_id = ?", lessonID).
            Preload("User").
            Order("created_at DESC").
            Find(&history).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not fetch lesson history",
            })
        }
        
        return c.JSON(history)
    }

    func GetTeacherReport(c *fiber.Ctx) error {
        guru := c.Query("guru")
        startDate := c.Query("start_date")
        endDate := c.Query("end_date")
        
        var lessons []models.DailyLesson
        
        query := database.DB.Where("nama_guru LIKE ?", "%"+guru+"%")
        
        if startDate != "" && endDate != "" {
            query = query.Where("tanggal_mengajar BETWEEN ? AND ?", startDate, endDate)
        }
        
        query = query.Order("tanggal_mengajar ASC")
        
        if err := query.Find(&lessons).Error; err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Could not fetch teacher report",
            })
        }
        
        return c.JSON(lessons)
    }