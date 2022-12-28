import { DeleteOutlined } from "@ant-design/icons";
import { CheckOutlined, HourglassOutlined } from "@ant-design/icons/lib/icons";
import { Button, Card, message } from "antd";
import React, { StrictMode, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Task } from "../../Shared/interfaces/Task";
import "./Task.css";

export interface TaskComponentProps {
  task: Task;
  onDeleteTaskCallback: () => void;
}

const TaskComponent: React.FC<TaskComponentProps> = (
  props: TaskComponentProps
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [taskCompleted, setTaskCompleted] = useState<boolean>(
    props.task.completed
  );
  const queryClient = useQueryClient();

  const markTaskComplete = useMutation(() => {
    return fetch(`http://localhost:3004/api/task/${props.task.id}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    }).then((res) => {
      if (res.ok) {
        setTaskCompleted(true);
        messageApi.open({
          type: "success",
          content: "Successfully completed task. Nice job!",
        });
      }
    });
  });

  const setTaskReminder = useMutation(() => {
    return fetch(`http://localhost:3004/api/task/${props.task.id}/reminder`, {
      method: "PUT",
    }).then((res) => {
      if (res.ok) {
        messageApi.open({
          type: "success",
          content: "Successfully created reminder.",
        });
      }
    });
  });

  const deleteTask = useMutation(() => {
    return fetch(`http://localhost:3004/api/task/${props.task.id}/delete`, {
      method: "DELETE",
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        props.onDeleteTaskCallback();
        queryClient.invalidateQueries("tasks");
      }
    });
  });

  return (
    <Card
      bordered={false}
      className="task-card"
      title={props.task.title}
      extra={[
        <Button
          type="primary"
          className="task-header-button task-reminder-button"
          shape="circle"
          disabled={taskCompleted}
          onClick={() => setTaskReminder.mutate()}
          icon={<HourglassOutlined />}
          size={"small"}
          key={`reminder-${props.task.id}`}
        />,
        <Button
          type="primary"
          className="task-header-button task-complete-button"
          shape="circle"
          disabled={taskCompleted}
          onClick={() => markTaskComplete.mutate()}
          icon={<CheckOutlined />}
          size={"small"}
          key={`complete-${props.task.id}`}
        />,
        <Button
          type="primary"
          className="task-header-button task-delete-button"
          shape="circle"
          onClick={() => deleteTask.mutate()}
          icon={<DeleteOutlined />}
          size={"small"}
          key={`delete-${props.task.id}`}
          danger
        />,
      ]}
      style={{ width: 300 }}
    >
      {contextHolder}
      <p>{props.task.notes}</p>
    </Card>
  );
};

export default TaskComponent;
