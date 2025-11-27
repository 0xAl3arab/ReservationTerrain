package org.reservation.reservationterrain.model;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter

@Entity
@Table(name = "owner")
public class Owner extends User {
    @Column(nullable= true,unique=true)
    private String nomComplexe;

}
