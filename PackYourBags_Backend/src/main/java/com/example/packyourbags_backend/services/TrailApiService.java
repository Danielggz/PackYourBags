package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.dtos.apiRequest.TrailApiResponse;
import com.example.packyourbags_backend.dtos.apiRequest.TrailFeature;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TrailApiService {
    private static final String API_URL =
    "https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=1=1&outFields=*&f=json";

    public TrailApiResponse fetchAllTrails() {
        //Method to get API information for all trails
        RestTemplate rest = new RestTemplate();
        TrailApiResponse response = rest.getForObject(API_URL, TrailApiResponse.class);
        //In case of null, respond empty object
        return response != null ? response : new TrailApiResponse();
    }
}
