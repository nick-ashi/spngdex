package com.nickashi.dex_api.pokemon;


import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class PokemonService {

    private final RestClient restClient = RestClient.builder().baseUrl("https://pokeapi.co/api/v2").build();
    private final CompetitiveService competitiveService = new CompetitiveService();

    public PokemonSummary getByName(String name) {
        PokeAPIResponse res = restClient.get()
                .uri("/pokemon/" + name)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(PokeAPIResponse.class);

        List<String> championsList = competitiveService.getChampionsPokemon();

        PokemonSummary summary = new PokemonSummary(res);
        summary.setInChampionsFormat(championsList.contains(name));
        return summary;
    }



}