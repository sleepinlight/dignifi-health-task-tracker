import { ClockCircleFilled } from "@ant-design/icons";
import { Space, Badge, Button, Popover, Tooltip } from "antd";
import { Task } from "../../../Shared/interfaces/Task";
import Moment from "moment";

export interface TaskDecoratorProps {
  task: Task;
  children: any;
}

const TaskDecorator: React.FC<TaskDecoratorProps> = (
  props: TaskDecoratorProps
) => {
  return (
    <Space>
      <Badge
        count={
          props.task.reminderSet && !props.task.completed ? (
            <Tooltip
              title={`Reminder set for ${Moment(props.task.reminderDate).format(
                "MM-DD-YYYY"
              )}`}
            >
              <Button
                shape="circle"
                className="reminder-indicator"
                style={{ marginTop: "10px" }}
              >
                <ClockCircleFilled style={{ color: "#ffffff" }} />
              </Button>
            </Tooltip>
          ) : (
            0
          )
        }
      >
        {props.children}
      </Badge>
    </Space>
  );
};

export default TaskDecorator;
