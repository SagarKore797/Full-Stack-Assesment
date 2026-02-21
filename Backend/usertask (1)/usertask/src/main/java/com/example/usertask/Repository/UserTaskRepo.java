package com.example.usertask.Repository;

import com.example.usertask.Entity.UserTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTaskRepo extends JpaRepository<UserTask,Long> {
}
