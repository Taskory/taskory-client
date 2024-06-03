package codeartitect.taskflower.task.taskitem;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveTaskItemRequest {
    private Long taskId;
    private String title;
}
