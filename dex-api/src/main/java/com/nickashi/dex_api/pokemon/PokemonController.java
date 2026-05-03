package com.nickashi.dex_api.pokemon;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pokemon")
public class PokemonController {

    private final PokemonService pokemonService;
    private final CompetitiveService competitiveService;

    public PokemonController(PokemonService pokemonService, CompetitiveService competitiveService) {
        this.pokemonService = pokemonService;
        this.competitiveService = competitiveService;
    }

    @GetMapping("/{name}")
    public PokemonSummary getPokemon(@PathVariable String name) {
        return pokemonService.getByName(name);
    }

    @GetMapping("/competitive/champions")
    public List<String> getChampionsPokemon() {
        return competitiveService.getChampionsPokemon();
    }

}
