package com.nickashi.dex_api.pokemon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class PokeAPIResponse {

    // Flat data
    String name;
    int id;
    int weight;
    int height;

    @Data
    public static class NamedResource {
        private String name;
        private String url;
    }

    /**
     * Type data
     */
    List<TypeSlot> types;
    @Data
    public static class TypeSlot {
        private int slot;
        private NamedResource type;
    }

    /**
     * Stat data
     */
    List<StatSlot> stats;
    @Data
    public static class StatSlot {
        private int base_stat;
        private NamedResource stat;
    }

    /**
     * Ability Data
     */
    List<AbilitySlot> abilities;
    @Data
    public static class AbilitySlot {
        private NamedResource ability;
        private boolean is_hidden;
    }

    /**
     * Move data
     */
    List<MoveSlot> moves;
    @Data
    public static class MoveSlot {
        private NamedResource move;
        private List<VersionGroupDetail>  version_group_details;
    }
    @Data
    public static class VersionGroupDetail {
        private int level_learned_at;
        private NamedResource move_learn_method;
        private NamedResource version_group;
    }

    /**
     *  Sprite data
     */
    SpriteList sprites;
    @Data
    public static class SpriteList {
        private String front_default;
        private String back_default;
        private String front_shiny;
        private String back_shiny;
    }
}