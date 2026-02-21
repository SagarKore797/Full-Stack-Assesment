package com.example.usertask.Service;

import com.example.usertask.Config.JwtUtil;
import com.example.usertask.Entity.*;
import com.example.usertask.Repository.*;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MainService {
    private final UsersRepo usersRepo;

    private final UserContactRepo userContactRepo;

    private final ContactAddRepo contactAddRepo;

    private final UserTaskRepo  userTaskRepo;

    private final EmailRepo emailRepo;

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public MainService(UsersRepo usersRepo, UserContactRepo userContactRepo, ContactAddRepo contactAddRepo, UserTaskRepo userTaskRepo,JwtUtil jwtUtil,PasswordEncoder passwordEncoder,EmailRepo emailRepo){
        this.usersRepo=usersRepo;
        this.userContactRepo = userContactRepo;
        this.contactAddRepo = contactAddRepo;
        this.userTaskRepo =userTaskRepo;
        this.jwtUtil= jwtUtil;
        this.passwordEncoder= passwordEncoder;
        this.emailRepo= emailRepo;
    }


    public String registerUser(Users users){
        if (usersRepo.findByEmail(users.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        users.setFullName(users.getFullName());
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        usersRepo.save(users);
        return "successfully registered";
    }

    public String login(String email, String password) {

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return jwtUtil.generateToken(user.getEmail()); // RETURN JWT
    }


    public UserContact saveContact(UserContact request, String email) {

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserContact contact = new UserContact();
        contact.setContactEmail(request.getContactEmail());
        contact.setContactNum(request.getContactNum());
        contact.setNote(request.getNote());

        contact.setUsers(user);

        return userContactRepo.save(contact);
    }

    public ContactAdd saveContactAdd(ContactAdd request, String email) {

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserContact contact = userContactRepo.findById(
                request.getUserContact().getContactId()
        ).orElseThrow(() -> new RuntimeException("Contact not found"));


        if (!contact.getUsers().getUserid().equals(user.getUserid())) {
            throw new RuntimeException("Unauthorized access");
        }

        ContactAdd contactAdd = new ContactAdd();
        contactAdd.setAdd1(request.getAdd1());
        contactAdd.setAdd2(request.getAdd2());
        contactAdd.setCity(request.getCity());
        contactAdd.setState(request.getState());
        contactAdd.setCountry(request.getCountry());
        contactAdd.setPincode(request.getPincode());

        contactAdd.setUserContact(contact);

        return contactAddRepo.save(contactAdd);
    }

    public UserTask saveUserTask(UserTask request, String email) {

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserContact contact = userContactRepo.findById(
                request.getUserContact().getContactId()
        ).orElseThrow(() -> new RuntimeException("Contact not found"));


        if (!contact.getUsers().getUserid().equals(user.getUserid())) {
            throw new RuntimeException("Unauthorized access");
        }

        UserTask task = new UserTask();
        task.setTitle(request.getTitle());
        task.setDescrip(request.getDescrip());
        task.setStatus(request.getStatus());
        task.setDue_date(request.getDue_date());

        task.setUsers(user);
        task.setUserContact(contact);

        return userTaskRepo.save(task);
    }

    //Email Stimulation
    public String sendTaskEmail(String toEmail, String subject, String body){

        EmailLogs email = new EmailLogs();
        email.setToEmail(toEmail);
        email.setSubject(subject);
        email.setBody(body);
        email.setSentAt(LocalDateTime.now());

        emailRepo.save(email);

        return "Email simulated & stored in DB";
    }

}
