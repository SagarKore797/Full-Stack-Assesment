package com.example.usertask.Controller;

import com.example.usertask.Entity.ContactAdd;
import com.example.usertask.Entity.UserContact;
import com.example.usertask.Entity.UserTask;
import com.example.usertask.Service.MainService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/main/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MainController {

    private final MainService service;

    public MainController(MainService service){
        this.service = service;
    }

    @PostMapping("/contact")
    public ResponseEntity<?> saveContact(
            @RequestBody UserContact request,
            Authentication authentication) {

        String email = authentication.getName(); // comes from JWT

        return ResponseEntity.ok(
                service.saveContact(request, email)
        );
    }

    @PostMapping("/address")
    public ResponseEntity<ContactAdd> saveContactAdd(
            @RequestBody ContactAdd request,
            Authentication authentication) {

        String email = authentication.getName(); // from JWT

        ContactAdd savedContactAdd = service.saveContactAdd(request, email);

        return ResponseEntity.ok(savedContactAdd);
    }

    @PostMapping("/task")
    public ResponseEntity<UserTask> saveUserTask(
            @RequestBody UserTask request,
            Authentication authentication) {

        String email = authentication.getName(); // from JWT

        UserTask savedTask = service.saveUserTask(request, email);

        return ResponseEntity.ok(savedTask);
    }

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(
            @RequestParam String toEmail,
            @RequestParam String subject,
            @RequestParam String body) {

        service.sendTaskEmail(toEmail, subject, body);

        return ResponseEntity.ok(
                Map.of("message", "Email sent successfully")
        );
    }
}
