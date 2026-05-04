package com.nickashi.dex_api.pokemon;


import com.nickashi.dex_api.exception.PokemonNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class PokemonService {

    private final RestClient restClient = RestClient.builder().baseUrl("https://pokeapi.co/api/v2").build();
    private final CompetitiveService competitiveService;

    public PokemonService(CompetitiveService competitiveService) {
        this.competitiveService = competitiveService;
    }

    public PokemonSummary getByName(String name) {
        try {
            PokeAPIResponse res = restClient.get()
                    .uri("/pokemon/" + name)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(PokeAPIResponse.class);

            List<String> championsList = competitiveService.getChampionsPokemon();

            PokemonSummary summary = new PokemonSummary(res);
            summary.setInChampionsFormat(championsList.contains(name));
            return summary;
        } catch (Exception e) {
            throw new PokemonNotFoundException(name);
        }
    }



}