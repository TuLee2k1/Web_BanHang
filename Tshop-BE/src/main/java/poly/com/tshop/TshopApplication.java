package poly.com.tshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import poly.com.tshop.configuration.FileStorageProperties;

@SpringBootApplication
@EnableConfigurationProperties(FileStorageProperties.class)
@EnableTransactionManagement
public class TshopApplication {

    public static void main(String[] args) {
        SpringApplication.run(TshopApplication.class, args);
    }

}
