package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.Customizer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(
                        org.springframework.security.config.annotation.web.builders.HttpSecurity http)
                        throws Exception {
                http
                                .csrf().disable()
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/h2-console/**").permitAll()
                                                .requestMatchers("/distribution-centres", "/distribution-centres/")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .formLogin(withDefaults());

                http.headers().frameOptions().disable();

                return http.build();
        }

        @Bean
        public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
                return new InMemoryUserDetailsManager(
                                User.withUsername("test")
                                                .password(passwordEncoder.encode("123"))
                                                .roles("ADMIN")
                                                .build(),
                                User.withUsername("user")
                                                .password(passwordEncoder.encode("1234"))
                                                .roles("USER")
                                                .build());
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
