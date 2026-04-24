package com.nickashi.dex_api.pokemon;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Take a response from the PokeAPI and
 * make it into something a little more ~usable~
 */
@Data
public class PokemonSummary {

    public PokemonSummary(PokeAPIResponse response) {
        this.name = response.getName();
        this.id = response.getId();
        this.height = response.getHeight();
        this.weight = response.getWeight();
        this.sprites = response.getSprites();

        for (PokeAPIResponse.TypeSlot t : response.getTypes()) {
            this.types.add(t.getType().getName());
        }
        for (PokeAPIResponse.StatSlot s : response.getStats()) {
            this.stats.put(s.getStat().getName(), s.getBase_stat());
        }
        for (PokeAPIResponse.AbilitySlot a : response.getAbilities()) {
            this.abilities.add(a.getAbility().getName());
        }
        for (PokeAPIResponse.MoveSlot m : response.getMoves()) {
            this.moves.add(m.getMove().getName());
        }
    }

    private String name;
    private int id;
    private int height;
    private int weight;
    private List<String> types = new ArrayList<>();
    private Map<String, Integer> stats = new HashMap<>();
    private List<String> abilities = new ArrayList<>();
    private List<String> moves = new ArrayList<>();
    private PokeAPIResponse.SpriteList sprites;

}
