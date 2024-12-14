package org.isp.bankas.worker;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day; // Example: "Monday"
    private LocalTime start;
    private LocalTime end;

    @ManyToOne
    @JoinColumn(name = "work_graphic_id", nullable = false)
    private WorkGraphic workGraphic;

    // Constructor for creating shifts
    public Shift(String day, LocalTime start, LocalTime end, WorkGraphic workGraphic) {
        this.day = day;
        this.start = start;
        this.end = end;
        this.workGraphic = workGraphic;
    }

    // Default constructor for JPA
    public Shift() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public LocalTime getStart() {
        return start;
    }

    public void setStart(LocalTime start) {
        this.start = start;
    }

    public LocalTime getEnd() {
        return end;
    }

    public void setEnd(LocalTime end) {
        this.end = end;
    }

    public WorkGraphic getWorkGraphic() {
        return workGraphic;
    }

    public void setWorkGraphic(WorkGraphic workGraphic) {
        this.workGraphic = workGraphic;
    }
}
