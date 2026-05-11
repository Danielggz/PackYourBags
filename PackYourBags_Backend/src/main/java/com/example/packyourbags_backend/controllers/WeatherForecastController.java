package com.example.packyourbags_backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/weather")
public class WeatherForecastController {
    @GetMapping
    public ResponseEntity<String> getWeather(@RequestParam double lat, @RequestParam double lon) {
        try {
            String url = "http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast"
                    + "?lat=" + lat + ";long=" + lon;

            CloseableHttpClient client = HttpClients.custom()
                    .disableRedirectHandling()
                    .build();

            HttpGet request = new HttpGet(url);

            // Browser-like headers
            request.addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            request.addHeader("Accept", "application/xml,text/xml,*/*;q=0.9");
            request.addHeader("Accept-Language", "en-US,en;q=0.9");
            request.addHeader("Accept-Encoding", "gzip, deflate");

            ClassicHttpResponse response = client.executeOpen(null, request, null);
            String body = EntityUtils.toString(response.getEntity());

            // If Azure still blocks, return 403 instead of parsing HTML
            if (body.startsWith("<html")) {
                return ResponseEntity.status(403).body(null);
            }

            System.out.println(body);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/xml")
                    .body(body);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
