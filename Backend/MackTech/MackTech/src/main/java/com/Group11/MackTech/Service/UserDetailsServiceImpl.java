package com.Group11.MackTech.Service;

import com.Group11.MackTech.Entity.User;
import com.Group11.MackTech.Repository.UserRepository;
import com.Group11.MackTech.util.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Ensure the user has a password set
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new UsernameNotFoundException("Invalid credentials for user: " + email);
        }
        
        return new CustomUserDetails(user);
    }
}
