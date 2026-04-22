package com.nickashi.dex_api.pokemon;


import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class PokemonService {

    private final RestClient restClient = RestClient.builder().baseUrl("https://pokeapi.co/api/v2").build();

    public PokeAPIResponse getByName(String name) {
        return restClient.get().uri("/pokemon/" + name).accept(MediaType.APPLICATION_JSON).retrieve().body(PokeAPIResponse.class);
    }



}
