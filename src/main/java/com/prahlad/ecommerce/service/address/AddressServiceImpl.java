package com.prahlad.ecommerce.service.address;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Address;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.AddressRepository;
import com.prahlad.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService 
{

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser() 
    {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public Address addAddress(Address address) 
    {

        User user = getLoggedInUser();

        address.setUser(user);

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getUserAddresses() 
    {

        User user = getLoggedInUser();

        return addressRepository.findByUserId(user.getId());
    }

    @Override
    public Address updateAddress(Long id, Address address) 
    {

        User user = getLoggedInUser();

        Address existing = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!existing.getUser().getId().equals(user.getId())) 
        {
            throw new UnauthorizedException("Unauthorized access");
        }

        existing.setStreet(address.getStreet());
        existing.setCity(address.getCity());
        existing.setState(address.getState());
        existing.setZipCode(address.getZipCode());

        return addressRepository.save(existing);
    }

    @Override
    public void deleteAddress(Long id) 
    {

        User user = getLoggedInUser();

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) 
        {
            throw new UnauthorizedException("Unauthorized access");
        }

        addressRepository.delete(address);
    }
}