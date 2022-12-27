import { Card } from "antd";
import React, { StrictMode } from "react";
import { Task } from "../../Shared/interfaces/Task";

export interface TaskComponentProps {
  task: Task;
}

const TaskComponent: React.FC<TaskComponentProps> = (
  props: TaskComponentProps
) => {
  return (
    <Card
      size="small"
      title={props.task.title}
      extra={<a href="#">Set Reminder</a>}
      style={{ width: 300 }}
    >
      <p>{props.task.notes}</p>
    </Card>
  );
};

export default TaskComponent;
