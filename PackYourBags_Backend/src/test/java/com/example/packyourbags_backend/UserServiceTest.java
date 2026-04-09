package com.example.packyourbags_backend;

import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.UserRepository;
import com.example.packyourbags_backend.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest extends AbstractMysqlTest {

    @Mock
    private UserRepository repo;

    @InjectMocks
    private UserService service;

    @Test
    void getAllUsers_returnsList() {
        List<User> users = Arrays.asList(new User(), new User());
        when(repo.findAll()).thenReturn(users);

        List<User> result = service.getAllUsers();

        assertEquals(2, result.size());
    }

    @Test
    void createUser_savesUser() {
        User user = new User();
        when(repo.save(user)).thenReturn(user);

        User result = service.createUser(user);

        assertEquals(user, result);
    }

    @Test
    void getUser_returnsUser() {
        User user = new User();
        when(repo.findById(1)).thenReturn(Optional.of(user));

        User result = service.getUser(1);

        assertEquals(user, result);
    }

    @Test
    void deleteUser_callsRepository() {
        service.deleteUser(1);
        verify(repo, times(1)).deleteById(1);
    }
}
