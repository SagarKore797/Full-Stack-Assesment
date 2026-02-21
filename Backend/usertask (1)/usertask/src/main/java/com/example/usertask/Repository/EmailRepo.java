package com.example.usertask.Repository;

import com.example.usertask.Entity.EmailLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepo extends JpaRepository<EmailLogs, Long> {
}
