package org.reservation.reservationterrain.config;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class SequenceFixer {

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    @Transactional
    public void fixSequences() {
        try {
            // List of tables to fix sequences for
            List<String> tables = List.of("owner", "client", "complexe", "terrain", "reservation");

            for (String table : tables) {
                try {
                    // Postgres specific query to reset sequence to max(id) + 1
                    String sql = String.format(
                            "SELECT setval(pg_get_serial_sequence('%s', 'id'), COALESCE((SELECT MAX(id) FROM %s) + 1, 1), false)",
                            table, table);
                    entityManager.createNativeQuery(sql).getSingleResult();
                    System.out.println("Fixed sequence for table: " + table);
                } catch (Exception e) {
                    System.err.println("Could not fix sequence for table " + table + ": " + e.getMessage());
                    // Continue to next table even if one fails
                }
            }
        } catch (Exception e) {
            System.err.println("General error fixing sequences: " + e.getMessage());
        }
    }
}
