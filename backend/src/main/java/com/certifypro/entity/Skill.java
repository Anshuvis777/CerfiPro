package com.certifypro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Integer endorsements = 0;

    @ManyToMany(mappedBy = "skills")
    @Builder.Default
    private Set<User> users = new HashSet<>();

    @ManyToMany(mappedBy = "skills")
    @Builder.Default
    private Set<Certificate> certificates = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Skill))
            return false;
        Skill skill = (Skill) o;
        return name != null && name.equals(skill.getName());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
