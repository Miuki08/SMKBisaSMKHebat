package models

import (
    "gorm.io/gorm"
    "golang.org/x/crypto/bcrypt"
)

type UserRole string

const (
    RoleAdmin      UserRole = "admin"
    RoleTeacher    UserRole = "teacher"
    RoleSupervisor UserRole = "supervisor"
)

type User struct {
    gorm.Model
    Name     string   `json:"name" validate:"required"`
    Email    string   `json:"email" validate:"required,email" gorm:"unique"`
    Password string   `json:"password" validate:"required,min=6"`
    Role     UserRole `json:"role" gorm:"type:varchar(20);default:'teacher'"`
}

func (u *User) HashPassword() error {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.Password = string(hashedPassword)
    return nil
}

func (u *User) CheckPassword(password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
    return err == nil
}