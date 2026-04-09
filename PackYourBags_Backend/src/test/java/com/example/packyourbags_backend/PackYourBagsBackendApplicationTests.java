package com.example.packyourbags_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class PackYourBagsBackendApplicationTests extends AbstractMysqlTest {

	@Test
	void contextLoads() {
	}

}
