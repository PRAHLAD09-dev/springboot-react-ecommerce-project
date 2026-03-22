package com.prahlad.ecommerce.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.prahlad.ecommerce.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchant implements UserDetails
{
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String businessName;

    @Column(unique = true)
    private String email;

    private String password;

    private boolean approved = false;
    
    private boolean active = true;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.MERCHANT;

    @OneToMany(mappedBy = "merchant")
    private List<Product> products;
    
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
		return approved && active; 
	
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() 
	{
	    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	
	}