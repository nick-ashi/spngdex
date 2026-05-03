package com.nickashi.dex_api.pokemon;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompetitiveService {

    public List<String> getChampionsPokemon() {
        List<String> res = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_in_Pok%C3%A9mon_Champions")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64")
                    .get();
            Elements links = doc.select("td a");
            for (Element link : links) {
                if (!link.attr("title").contains("type")) {
                    res.add(link.text().toLowerCase());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return res;
    }
}
