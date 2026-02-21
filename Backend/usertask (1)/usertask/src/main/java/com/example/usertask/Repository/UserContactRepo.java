package com.example.usertask.Repository;

import com.example.usertask.Entity.UserContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserContactRepo extends JpaRepository<UserContact, Long> {
}
