package com.example.usertask.Repository;

import com.example.usertask.Entity.ContactAdd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactAddRepo extends JpaRepository<ContactAdd,Long> {
}
