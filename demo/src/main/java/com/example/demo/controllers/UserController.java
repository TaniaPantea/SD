package com.example.demo.controllers;

import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/people")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDetailsDTO>> getPeople() {
        return ResponseEntity.ok(userService.findPersons());
    }

    //    @PostMapping
    //    public ResponseEntity<UserDetailsDTO> create(@Valid @RequestBody UserDetailsDTO person) {
    //        UUID id = userService.insert(person);
    //
    //        person.setId(id);
    //
    //        URI location = ServletUriComponentsBuilder
    //                .fromCurrentRequest()
    //                .path("/{id}")
    //                .buildAndExpand(id)
    //                .toUri();
    //
    //        return ResponseEntity.created(location).body(person);
    //    }


    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> getPerson(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findPersonById(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UserDetailsDTO userDTO) {
        UserDetailsDTO updatedUser = userService.update(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping
    public ResponseEntity<UserDetailsDTO> create(@Valid @RequestBody UserDetailsDTO person) {

        UUID id = userService.insertById(person);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity.created(location).body(person);
    }
}
