package com.nickashi.dex_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.sql.SQLOutput;

@SpringBootApplication
@EnableCaching
public class DexApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(DexApiApplication.class, args);
	}

}
