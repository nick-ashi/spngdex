package com.nickashi.dex_api.pokemon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class PokeAPIResponse {

    // Flat data
    String name;
    Integer id;
    String weight;
    String height;

    /**
     * Stat data
     */
    List<StatSlot> stats;
    @Data
    public static class StatSlot {
        private int base_stat;
        private Stat stat;
    }
    @Data
    public static class Stat {
        private String name;
        private String url;
    }

    /**
     * Ability Data
     */
    List<AbilitySlot> abilities;
    @Data
    public static class Ability {
        private String name;
        private String url;
    }
    @Data
    public static class AbilitySlot {
        private Ability ability;
        private boolean is_hidden;
    }

    /**
     * Move data
     */
    List<MoveSlot> moves;
    @Data
    public static class MoveSlot {
        private Move move;
        private List<VersionGroupDetail>  version_group_details;
    }
    @Data
    public static class VersionGroupDetail {
        private int level_learned_at;
        private MoveLearnMethod move_learn_method;
        private VersionGroup version_group;
    }
    @Data
    public static class Move {
        private String name;
        private String url;
    }
    @Data
    public static class MoveLearnMethod {
        private String name;
        private String url;
    }
    @Data
    public static class VersionGroup {
        private String name;
        private String url;
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