package com.certifypro.config;

import com.certifypro.entity.*;
import com.certifypro.repository.SkillRepository;
import com.certifypro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("dev")
    public CommandLineRunner initData() {
        return args -> {
            // Create admin user
            if (!userRepository.existsByEmail("admin@certifypro.com")) {
                Set<Skill> adminSkills = new HashSet<>();
                adminSkills.add(createSkill("Management"));
                adminSkills.add(createSkill("Security"));

                User admin = User.builder()
                        .email("admin@certifypro.com")
                        .username("admin")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.ADMIN)
                        .bio("Platform Administrator")
                        .skills(adminSkills)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Created admin user: admin@certifypro.com / password123");
            }

            // Create issuer user
            if (!userRepository.existsByEmail("issuer@certifypro.com")) {
                Set<Skill> issuerSkills = new HashSet<>();
                issuerSkills.add(createSkill("Education"));
                issuerSkills.add(createSkill("Training"));

                User issuer = User.builder()
                        .email("issuer@certifypro.com")
                        .username("issuer")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.ISSUER)
                        .bio("Leading technology training institute")
                        .organization("TechCorp Academy")
                        .skills(issuerSkills)
                        .enabled(true)
                        .build();
                userRepository.save(issuer);
                System.out.println("Created issuer user: issuer@certifypro.com / password123");
            }

            // Create individual user
            if (!userRepository.existsByEmail("john@example.com")) {
                Set<Skill> individualSkills = new HashSet<>();
                individualSkills.add(createSkill("React"));
                individualSkills.add(createSkill("TypeScript"));
                individualSkills.add(createSkill("Node.js"));

                User individual = User.builder()
                        .email("john@example.com")
                        .username("johndoe")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.INDIVIDUAL)
                        .bio("Software Developer passionate about blockchain technology")
                        .location("San Francisco, CA")
                        .experience("5 years")
                        .skills(individualSkills)
                        .profileVisibility(ProfileVisibility.PUBLIC)
                        .enabled(true)
                        .build();
                userRepository.save(individual);
                System.out.println("Created individual user: john@example.com / password123");
            }

            // Create employer user
            if (!userRepository.existsByEmail("recruiter@techcorp.com")) {
                Set<Skill> employerSkills = new HashSet<>();
                employerSkills.add(createSkill("Recruitment"));
                employerSkills.add(createSkill("Technical Screening"));

                User employer = User.builder()
                        .email("recruiter@techcorp.com")
                        .username("sarah_recruiter")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.EMPLOYER)
                        .bio("Senior Technical Recruiter at TechCorp")
                        .organization("TechCorp Inc.")
                        .location("New York, NY")
                        .skills(employerSkills)
                        .enabled(true)
                        .build();
                userRepository.save(employer);
                System.out.println("Created employer user: recruiter@techcorp.com / password123");
            }

            System.out.println("Data initialization completed!");
        };
    }

    private Skill createSkill(String name) {
        return skillRepository.findByName(name)
                .orElseGet(() -> skillRepository.save(
                        Skill.builder()
                                .name(name)
                                .endorsements(0)
                                .build()));
    }
}
