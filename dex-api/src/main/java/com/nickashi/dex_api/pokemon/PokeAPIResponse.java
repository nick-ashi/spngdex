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

    // stat data here

    /**
     * Ability Data
     */
    List<AbilitySlot> abilities;
    @Data
    public static class Ability {
        private String name;
        @JsonProperty("url")
        private String abilityUrl;
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
        @JsonProperty("version_group_details")
        private List<VersionGroupDetail>  versionGroupDetails;
    }
    @Data
    public static class VersionGroupDetail {
        private int level_learned_at;
        @JsonProperty("move_learn_method")
        private MoveLearnMethod moveLearnMethod;
        @JsonProperty("version_group")
        private VersionGroup versionGroup;
    }
    @Data
    public static class Move {
        private String name;
        @JsonProperty("url")
        private String moveUrl;
    }
    @Data
    public static class MoveLearnMethod {
        private String name;
        @JsonProperty("url")
        private String moveLearnMethodUrl;
    }
    @Data
    public static class VersionGroup {
        private String name;
        @JsonProperty("url")
        private String versionGroupUrl;
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