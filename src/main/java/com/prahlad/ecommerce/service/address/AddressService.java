package com.prahlad.ecommerce.service.address;

import java.util.List;

import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.address.AddressRequest;
import com.prahlad.ecommerce.dto.address.AddressResponse;

@Service
public interface AddressService 
{

	AddressResponse addAddress(AddressRequest request, String email);

    List<AddressResponse>  getUserAddresses(String email);

    AddressResponse updateAddress(Long id, AddressRequest request, String email);

    void deleteAddress(Long id, String email) ;

}