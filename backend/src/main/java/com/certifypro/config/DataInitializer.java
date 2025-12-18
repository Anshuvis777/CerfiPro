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
            // Pre-create all skills first to avoid detached entity issues
            Skill management = createAndSaveSkill("Management");
            Skill security = createAndSaveSkill("Security");
            Skill education = createAndSaveSkill("Education");
            Skill training = createAndSaveSkill("Training");
            Skill react = createAndSaveSkill("React");
            Skill typescript = createAndSaveSkill("TypeScript");
            Skill nodejs = createAndSaveSkill("Node.js");
            Skill recruitment = createAndSaveSkill("Recruitment");
            Skill screening = createAndSaveSkill("Technical Screening");

            // Create admin user
            if (!userRepository.existsByEmail("admin@certifypro.com")) {
                User admin = User.builder()
                        .email("admin@certifypro.com")
                        .username("admin")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.ADMIN)
                        .bio("Platform Administrator")
                        .skills(new HashSet<>())
                        .enabled(true)
                        .build();
                admin.getSkills().add(management);
                admin.getSkills().add(security);
                userRepository.save(admin);
                System.out.println("Created admin user: admin@certifypro.com / password123");
            }

            // Create issuer user
            if (!userRepository.existsByEmail("issuer@certifypro.com")) {
                User issuer = User.builder()
                        .email("issuer@certifypro.com")
                        .username("issuer")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.ISSUER)
                        .bio("Leading technology training institute")
                        .organization("TechCorp Academy")
                        .skills(new HashSet<>())
                        .enabled(true)
                        .build();
                issuer.getSkills().add(education);
                issuer.getSkills().add(training);
                userRepository.save(issuer);
                System.out.println("Created issuer user: issuer@certifypro.com / password123");
            }

            // Create individual user
            if (!userRepository.existsByEmail("john@example.com")) {
                User individual = User.builder()
                        .email("john@example.com")
                        .username("johndoe")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.INDIVIDUAL)
                        .bio("Software Developer passionate about blockchain technology")
                        .location("San Francisco, CA")
                        .experience("5 years")
                        .skills(new HashSet<>())
                        .profileVisibility(ProfileVisibility.PUBLIC)
                        .enabled(true)
                        .build();
                individual.getSkills().add(react);
                individual.getSkills().add(typescript);
                individual.getSkills().add(nodejs);
                userRepository.save(individual);
                System.out.println("Created individual user: john@example.com / password123");
            }

            // Create employer user
            if (!userRepository.existsByEmail("recruiter@techcorp.com")) {
                User employer = User.builder()
                        .email("recruiter@techcorp.com")
                        .username("sarah_recruiter")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.EMPLOYER)
                        .bio("Senior Technical Recruiter at TechCorp")
                        .organization("TechCorp Inc.")
                        .location("New York, NY")
                        .skills(new HashSet<>())
                        .enabled(true)
                        .build();
                employer.getSkills().add(recruitment);
                employer.getSkills().add(screening);
                userRepository.save(employer);
                System.out.println("Created employer user: recruiter@techcorp.com / password123");
            }

            System.out.println("Data initialization completed!");
        };
    }

    private Skill createAndSaveSkill(String name) {
        return skillRepository.findByName(name)
                .orElseGet(() -> skillRepository.save(
                        Skill.builder()
                                .name(name)
                                .endorsements(0)
                                .build()));
    }
}
