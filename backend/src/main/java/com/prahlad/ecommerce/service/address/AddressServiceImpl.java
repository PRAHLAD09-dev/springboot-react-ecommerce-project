package com.prahlad.ecommerce.service.address;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.address.AddressRequest;
import com.prahlad.ecommerce.dto.address.AddressResponse;
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

    // ================= ADD =================
    @Override
    public AddressResponse addAddress(AddressRequest request, String email) 
    {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = new Address();
        address.setStreet(request.street());
        address.setCity(request.city());
        address.setState(request.state());
        address.setZipCode(request.zipCode());
        address.setUser(user);

        Address saved = addressRepository.save(address);

        return mapToDTO(saved);
    }

    // ================= GET =================
    @Override
    public List<AddressResponse> getUserAddresses(String email) 
    {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= UPDATE =================
    @Override
    public AddressResponse updateAddress(Long id, AddressRequest request, String email) 
    {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address existing = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!existing.getUser().getId().equals(user.getId())) 
        {
            throw new UnauthorizedException("Unauthorized access");
        }

        existing.setStreet(request.street());
        existing.setCity(request.city());
        existing.setState(request.state());
        existing.setZipCode(request.zipCode());

        Address updated = addressRepository.save(existing);

        return mapToDTO(updated);
    }

    // ================= DELETE =================
    @Override
    public void deleteAddress(Long id, String email) 
    {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) 
        {
            throw new UnauthorizedException("Unauthorized access");
        }

        addressRepository.delete(address);
    }

    // ================= MAPPER =================
    private AddressResponse mapToDTO(Address address) 
    {
        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getZipCode(),
                address.getCountry()
        );
    }
}