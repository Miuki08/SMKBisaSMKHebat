package models

import (
    "time"
    "gorm.io/gorm"
)

type Activity struct {
    ID           uint           `gorm:"primaryKey" json:"id"`
    Action       string         `gorm:"size:50;not null" json:"action"`
    Description  string         `gorm:"type:text;not null" json:"description"`
    PerformedBy  string         `gorm:"not null" json:"performed_by"`
    CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"-"`
    DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName mengembalikan nama tabel yang digunakan
func (Activity) TableName() string {
    return "user_activities"
}