package com.certifypro.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (dbUrl != null && dbUrl.startsWith("postgres://")) {
            try {
                URI uri = new URI(dbUrl);
                String username = uri.getUserInfo().split(":")[0];
                String password = uri.getUserInfo().split(":")[1];
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();

                HikariDataSource dataSource = new HikariDataSource();
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                return dataSource;
            } catch (URISyntaxException e) {
                throw new RuntimeException("Invalid DATABASE_URL format", e);
            }
        }

        // Fallback for standard JDBC URLs or local development
        // We need to construct it manually if we are taking over the bean definition
        // But for standard cases, Spring handles it. However, since we are defining the
        // @Bean,
        // we must return a valid DataSource even for the normal case.
        // It's safer to rely on Spring's properties if it's not a postgres:// URL.
        // But getting the properties here + creating the bean might be
        // redundant/complex if we want to fallback.
        // A better approach for the 'else' block is to return null and let Spring's
        // ConditionalOnMissingBean handle it?
        // No, @Primary bean replaces it.
        // So we should build a standard datasource if it's not the special case.

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(dbUrl);
        dataSource.setUsername(dbUsername);
        dataSource.setPassword(dbPassword);
        // User/Pass will be picked up from properties
        // spring.datasource.username/password normally
        // But since we are creating the bean manually, we should inject them.
        return dataSource;
    }
}
