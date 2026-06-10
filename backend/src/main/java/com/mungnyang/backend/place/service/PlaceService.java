package com.mungnyang.backend.place.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mungnyang.backend.place.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {

    @Value("${tmap.api-key}")
    private String tmapApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<PlaceResponse> searchPlaces(String category, Double lat, Double lng) {
        try {
            String keyword = switch (category) {
                case "반려동물 동반 카페" -> "애견카페";
                case "반려동물 동반 식당" -> "애견동반 식당";
                case "펫 호텔" -> "펫호텔";
                case "동물병원" -> "동물병원";
                case "산책 · 운동장" -> "애견운동장";
                case "미용실" -> "애견미용";
                default -> category;
            };

            String urlString = UriComponentsBuilder
                    .fromHttpUrl("https://apis.openapi.sk.com/tmap/pois")
                    .queryParam("version", "1")
                    .queryParam("searchKeyword", keyword)
                    .queryParam("resCoordType", "WGS84GEO")
                    .queryParam("reqCoordType", "WGS84GEO")
                    .queryParam("centerLat", lat)
                    .queryParam("centerLon", lng)
                    .queryParam("count", 10)
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();

            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("appKey", tmapApiKey);
            connection.setRequestProperty("Accept", "application/json");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int statusCode = connection.getResponseCode();

            BufferedReader reader;

            if (statusCode >= 200 && statusCode < 300) {
                reader = new BufferedReader(
                        new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8)
                );
            } else {
                reader = new BufferedReader(
                        new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8)
                );
            }

            StringBuilder responseBody = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBody.append(line);
            }

            reader.close();

            System.out.println("===== TMAP URL =====");
            System.out.println(urlString);
            System.out.println("===== TMAP STATUS =====");
            System.out.println(statusCode);
            System.out.println("===== TMAP RESPONSE =====");
            System.out.println(responseBody);

            if (statusCode < 200 || statusCode >= 300) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(responseBody.toString());
            JsonNode poiArray = root.path("searchPoiInfo").path("pois").path("poi");

            List<PlaceResponse> places = new ArrayList<>();

            if (!poiArray.isArray()) {
                return places;
            }

            for (JsonNode poi : poiArray) {
                String name = poi.path("name").asText();

                JsonNode newAddressArray = poi.path("newAddressList").path("newAddress");

                String address = "";

                if (newAddressArray.isArray() && newAddressArray.size() > 0) {
                    address = newAddressArray.get(0).path("fullAddressRoad").asText();
                }

                if (address.isBlank()) {
                    address = poi.path("upperAddrName").asText() + " "
                            + poi.path("middleAddrName").asText() + " "
                            + poi.path("lowerAddrName").asText();
                }

                places.add(
                        PlaceResponse.builder()
                                .name(name)
                                .address(address)
                                .category(category)
                                .latitude(poi.path("noorLat").asDouble())
                                .longitude(poi.path("noorLon").asDouble())
                                .build()
                );
            }

            return places;

        } catch (Exception e) {
            System.out.println("===== PLACE SERVICE ERROR =====");
            e.printStackTrace();
            return List.of();
        }
    }
}