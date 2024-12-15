package org.isp.bankas.worker;

import java.util.List;
import java.util.Map;

public class WorkGraphicDTO {
    private int weekNumber;
    private List<List<Map<String, String>>> workGraphic;

    public int getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(int weekNumber) {
        this.weekNumber = weekNumber;
    }

    public List<List<Map<String, String>>> getWorkGraphic() {
        return workGraphic;
    }

    public void setWorkGraphic(List<List<Map<String, String>>> workGraphic) {
        this.workGraphic = workGraphic;
    }
}
