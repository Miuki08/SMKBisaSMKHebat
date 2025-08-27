package models

import (
    "time"
    "gorm.io/gorm"
)

type DailyLesson struct {
    gorm.Model
    ID              uint      `json:"id" gorm:"primaryKey"`
    NamaGuru       string    `json:"nama_guru" validate:"required"`
    MataPelajaran  string    `json:"mata_pelajaran" validate:"required"`
    Kelas          string    `json:"kelas" validate:"required"`
    PokokMateri    string    `json:"pokok_materi" validate:"required"`
    BuktiMengajar  string    `json:"bukti_mengajar"`
    TanggalMengajar time.Time `json:"tanggal_mengajar"`
    JamMulai       string    `json:"jam_mulai"`
    JamSelesai     string    `json:"jam_selesai"`
    Status         string    `json:"status" gorm:"default:'terlaksana'"`
    Catatan        string    `json:"catatan"`
    CreatedByID    uint      `json:"created_by_id"`
    CreatedBy      User      `json:"created_by" gorm:"foreignKey:CreatedByID"`
}

type LessonReport struct {
    gorm.Model
    LessonID     uint        `json:"lesson_id"`
    Lesson       DailyLesson `json:"lesson" gorm:"foreignKey:LessonID"`
    Action       string      `json:"action"`
    Description  string      `json:"description"`
    PerformedBy  uint        `json:"performed_by"`
    User         User        `json:"user" gorm:"foreignKey:PerformedBy"`
}