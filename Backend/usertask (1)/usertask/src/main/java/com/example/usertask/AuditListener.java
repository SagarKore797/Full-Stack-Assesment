package com.example.usertask;



import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditListener {

    @PrePersist
    public void setCreatedBy(BaseEntity entity) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            entity.setCreateBy(auth.getName());
            entity.setUpdateBy(auth.getName());
        }
    }

    @PreUpdate
    public void setUpdatedBy(BaseEntity entity) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            entity.setUpdateBy(auth.getName());
        }
    }
}