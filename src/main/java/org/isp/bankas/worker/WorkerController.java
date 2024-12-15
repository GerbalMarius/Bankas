package org.isp.bankas.worker;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.role.RoleRepository;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.isp.bankas.utils.Error;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.temporal.WeekFields;
import java.util.*;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/worker")
public class WorkerController {
    private final UserService userService;
    private final RoleRepository roleRepository;

    private final WorkGraphicRepository workGraphicRepository;
    private final FreeDayRequestRepository freeDayRequestRepository;

    public WorkerController(UserService userService, RoleRepository roleRepository,
            WorkGraphicRepository workGraphicRepository, FreeDayRequestRepository freeDayRequestRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.workGraphicRepository = workGraphicRepository;
        this.freeDayRequestRepository = freeDayRequestRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(@Valid @RequestBody UserDTO transferredData) {
        try {

            User alreadyRegistered = userService.findByEmailOrPinNumber(transferredData.getEmail(),
                    transferredData.getPinNumber());
            if (alreadyRegistered != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already registered");
            }

            User savedUser = userService.saveWorker(transferredData);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User %s registered successfully".formatted(savedUser.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + " " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserDTO transferredData, HttpSession session) {
        Error validationError = userService.validateLoginCredentials(transferredData);
        if (validationError != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(validationError.getMessage());
        }
        User actualUser = userService.findByEmail(transferredData.getEmail());
        actualUser.setLastLoginDate(ZonedDateTime.now(ZoneId.of("Europe/Vilnius")));
        userService.update(actualUser);
        session.setAttribute("user", actualUser.transferToDTO());
        session.setAttribute("roles", actualUser.getRoles());
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/out")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(BankApplication.REACT_FRONT_URL + "/login?logout");
    }

    @GetMapping("/graph")
    public ResponseEntity<WorkGraphicDTO> getWorkGraphic(@RequestParam int year, @RequestParam int week) {
        return workGraphicRepository.findByYearAndWeekNumber(year, week)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    WorkGraphicDTO emptyDTO = new WorkGraphicDTO();
                    emptyDTO.setWeekNumber(week);
                    emptyDTO.setWorkGraphic(List.of(
                            new ArrayList<>(), // Monday
                            new ArrayList<>(), // Tuesday
                            new ArrayList<>(), // Wednesday
                            new ArrayList<>(), // Thursday
                            new ArrayList<>(), // Friday
                            new ArrayList<>(), // Saturday
                            new ArrayList<>() // Sunday
                    ));
                    return ResponseEntity.ok(emptyDTO);
                });
    }

    // Helper method to convert WorkGraphic to WorkGraphicDTO
    private WorkGraphicDTO convertToDTO(WorkGraphic workGraphic) {
        WorkGraphicDTO dto = new WorkGraphicDTO();
        dto.setWeekNumber(workGraphic.getWeekNumber());

        // Create the workGraphic structure
        List<List<Map<String, String>>> graphic = new ArrayList<>();

        // Initialize 7 days of the week
        for (int i = 0; i < 7; i++) {
            graphic.add(new ArrayList<>());
        }

        for (Shift shift : workGraphic.getShifts()) {
            // Get the day of the week as an index (Monday = 0, Sunday = 6)
            int dayIndex = DayOfWeek.valueOf(shift.getDay().toUpperCase()).getValue() - 1;

            // Format shift times as a Map
            Map<String, String> shiftTime = Map.of(
                    "start", shift.getStart().toString(),
                    "end", shift.getEnd().toString());

            // Add the shift time to the corresponding day
            graphic.get(dayIndex).add(shiftTime);
        }

        dto.setWorkGraphic(graphic);
        return dto;
    }

    @PutMapping("/graph")
    public ResponseEntity<String> updateWorkGraphic(@RequestBody WorkGraphic updatedGraphic) {
        Optional<WorkGraphic> existingGraphic = workGraphicRepository.findByYearAndWeekNumber(updatedGraphic.getYear(),
                updatedGraphic.getWeekNumber());

        if (existingGraphic.isPresent()) {
            WorkGraphic graphic = existingGraphic.get();
            graphic.getShifts().clear();

            for (Shift shift : updatedGraphic.getShifts()) {
                shift.setWorkGraphic(graphic);
                graphic.getShifts().add(shift);
            }

            int totalHours = updatedGraphic.getShifts().stream()
                    .mapToInt(shift -> shift.getEnd().getHour() - shift.getStart().getHour())
                    .sum();

            if (totalHours != 40) {
                return ResponseEntity.badRequest().body("Total hours must equal 40 for the week!");
            }

            workGraphicRepository.save(graphic);
            return ResponseEntity.ok("Work graphic updated successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/free-days")
    public ResponseEntity<String> requestFreeDay(@RequestBody FreeDayRequest request) {
        if (freeDayRequestRepository.existsByDate(request.getDate())) {
            return ResponseEntity.badRequest().body("Free day already requested.");
        }

        Optional<WorkGraphic> graphic = workGraphicRepository.findByYearAndWeekNumber(
                request.getDate().getYear(),
                request.getDate().get(WeekFields.ISO.weekOfWeekBasedYear()));

        if (graphic.isPresent()) {
            boolean isPlannedWorkDay = graphic.get().getShifts().stream()
                    .anyMatch(shift -> shift.getDay().equalsIgnoreCase(request.getDate().getDayOfWeek().toString()));

            if (isPlannedWorkDay) {
                return ResponseEntity.badRequest().body("Cannot request free day on a planned work day.");
            }
        }

        freeDayRequestRepository.save(request);
        return ResponseEntity.ok("Free day request submitted successfully!");
    }

    @PostMapping("/generate-graph")
    public ResponseEntity<String> generateWorkGraphic(
            @RequestBody Map<String, Object> requestPayload) {

        int year = (int) requestPayload.get("year");
        int week = (int) requestPayload.get("week");
        Map<String, String> preferences = (Map<String, String>) requestPayload.get("preferences");

        List<LocalDate> freeDays = freeDayRequestRepository.findByYearAndWeek(year, week)
                .stream()
                .map(FreeDayRequest::getDate)
                .toList();
        Set<DayOfWeek> freeDaySet = new HashSet<>();
        for (LocalDate freeDay : freeDays) {
            freeDaySet.add(freeDay.getDayOfWeek());
        }

        // Create a new WorkGraphic instance
        WorkGraphic newGraphic = new WorkGraphic();
        newGraphic.setYear(year);
        newGraphic.setWeekNumber(week);

        int totalHours = 0;

        // Preference handling
        String preference = preferences.get("type");
        List<DayOfWeek> workDays = List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);

        switch (preference) {
            case "workEveryOtherDay":
                int shiftLength = 8; // Starting shift length
                for (int i = 0; i < workDays.size(); i += 2) {
                    if (totalHours >= 40)
                        break;
                    if (freeDaySet.contains(workDays.get(i)))
                        continue;

                    // Increment shift length by 2 hours each iteration, capped at 12
                    totalHours = addShifts(newGraphic, workDays.get(i), totalHours, shiftLength);
                    shiftLength = Math.min(shiftLength + 2, 12); // Ensure maximum shift length is 12
                }
                break;

            case "onlyWorkDays":
                for (DayOfWeek day : workDays) {
                    if (totalHours >= 40)
                        break;
                    if (freeDaySet.contains(day))
                        continue;

                    totalHours = addShifts(newGraphic, day, totalHours, 8);
                }
                break;

            case "longShifts":
                List<DayOfWeek> allDays = List.of(
                        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                        DayOfWeek.THURSDAY, DayOfWeek.FRIDAY,
                        DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);

                for (DayOfWeek day : allDays) {
                    // Stop if 40 hours have been scheduled
                    if (totalHours >= 40)
                        break;

                    // Skip free days
                    if (freeDaySet.contains(day))
                        continue;

                    // Calculate remaining hours to reach 40, ensuring max 10-hour shifts
                    int hoursToAdd = Math.min(10, 40 - totalHours);

                    // Add the shift and update total hours
                    totalHours = addShifts(newGraphic, day, totalHours, hoursToAdd);
                }
                break;

            default:
                return ResponseEntity.badRequest().body("Invalid preference");
        }

        // Validate total hours
        if (totalHours != 40) {
            return ResponseEntity.badRequest().body("Generated work graphic does not meet 40-hour requirement");
        }

        // Save generated work graphic
        workGraphicRepository.save(newGraphic);

        return ResponseEntity.ok("Work graphic for year " + year + " week " + week + " generated successfully!");
    }

    // Helper method to create shifts with a lunch break
    private int addShifts(WorkGraphic workGraphic, DayOfWeek day, int currentHours, int hoursToAdd) {
        int morningHours = Math.min(4, hoursToAdd); // Morning session (max 4 hours)
        int afternoonHours = hoursToAdd - morningHours; // Afternoon session

        // Create shifts
        if (morningHours > 0) {
            workGraphic.getShifts().add(new Shift(day.toString(), LocalTime.of(8, 0),
                    LocalTime.of(8, 0).plusHours(morningHours), workGraphic));
        }
        if (afternoonHours > 0) {
            workGraphic.getShifts().add(new Shift(day.toString(), LocalTime.of(13, 0),
                    LocalTime.of(13, 0).plusHours(afternoonHours), workGraphic));
        }

        return currentHours + hoursToAdd;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

}