package com.example.usertask;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditListener.class)
public abstract class BaseEntity {

    private LocalDateTime createAtDate;
    private LocalDateTime updateAtDate;

    private String createBy;
    private String updateBy;

    public LocalDateTime getCreateAtDate() {
        return createAtDate;
    }

    public void setCreateAtDate(LocalDateTime createAtDate) {
        this.createAtDate = createAtDate;
    }

    public LocalDateTime getUpdateAtDate() {
        return updateAtDate;
    }

    public void setUpdateAtDate(LocalDateTime updateAtDate) {
        this.updateAtDate = updateAtDate;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    @PrePersist
    protected void onCreate() {
        this.createAtDate = LocalDateTime.now();
        this.updateAtDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAtDate = LocalDateTime.now();
    }


}