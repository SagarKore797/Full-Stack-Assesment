package com.example.usertask.Controller;

import com.example.usertask.Entity.Users;
import com.example.usertask.Service.MainService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/main/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final MainService service;

    public AuthController(MainService service){
        this.service = service;
    }

    @PostMapping("/register")
    public String register(@RequestBody Users users){
        return service.registerUser(users);
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password){
        return service.login(email, password);
    }

    @PostMapping("/logout")
    public String logout(){
        return "Logout successful (Delete token from frontend)";
    }
}