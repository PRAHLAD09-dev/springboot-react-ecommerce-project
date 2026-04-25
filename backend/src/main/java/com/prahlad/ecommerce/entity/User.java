package com.prahlad.ecommerce.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prahlad.ecommerce.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true , nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean active = true;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private List<Address> addresses;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL ,  fetch = FetchType.LAZY)
    private List<Order> orders;

	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() 
	{
	    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getUsername() 
	{
	    return email;
	}

	@Override
	public boolean isAccountNonExpired() 
	{
		return true; 
	}

	@Override
	public boolean isAccountNonLocked() 
	{
		return true; 
	}

	@Override
	public boolean isCredentialsNonExpired() 
	{
		return true; 
	}

	@Override
	public boolean isEnabled() 
	{
		return active; 
	}
}