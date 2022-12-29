import { DeleteOutlined } from "@ant-design/icons";
import {
  CheckOutlined,
  ClockCircleOutlined,
  HourglassOutlined,
} from "@ant-design/icons/lib/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  message,
  Modal,
  Progress,
  Space,
} from "antd";
import React, { StrictMode, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import baseUrl from "../../Services/api";
import { Task, TaskReminderForCreate } from "../../Shared/interfaces/Task";
import "./Task.css";
import TaskDecorator from "./TaskDecorator/TaskDecorator";

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
  const [isReminderModalOpen, setIsReminderModalOpen] =
    useState<boolean>(false);
  const queryClient = useQueryClient();

  const onShowTaskReminderModal = (): void => {
    setIsReminderModalOpen(true);
  };

  const onDismissTaskReminderModal = (): void => {
    setIsReminderModalOpen(false);
  };

  const markTaskComplete = useMutation(() => {
    return fetch(`${baseUrl}/task/${props.task.id}/complete`, {
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

  const setTaskReminder = useMutation((values: TaskReminderForCreate) => {
    return fetch(`${baseUrl}/task/${props.task.id}/reminder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reminderSet: true,
        reminderDate: values.reminderDate,
      }),
    }).then((res) => {
      if (res.ok) {
        onDismissTaskReminderModal();
        messageApi.open({
          type: "success",
          content: "Successfully created reminder.",
        });
      }
    });
  });

  const deleteTask = useMutation(() => {
    return fetch(`${baseUrl}/task/${props.task.id}/delete`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        props.onDeleteTaskCallback();
        queryClient.invalidateQueries("tasks");
      }
    });
  });

  return (
    <TaskDecorator task={props.task}>
      <Card
        bordered={false}
        className={`task-card ${
          props.task.completed ? "task-card-completed" : ""
        }`}
        title={props.task.title}
        extra={[
          <Button
            type="primary"
            className="task-header-button task-reminder-button"
            shape="circle"
            disabled={taskCompleted || props.task.reminderSet}
            onClick={onShowTaskReminderModal}
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
        {props.task.completed ? (
          <div style={{ textAlign: "center" }}>
            <Progress type="circle" width={65} percent={100} />
          </div>
        ) : (
          <p>{props.task.notes}</p>
        )}

        <Modal
          open={isReminderModalOpen}
          title={props.task.title}
          footer={null}
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={(values) => setTaskReminder.mutate(values)}
          >
            <Form.Item label="Reminder Date" name="reminderDate">
              <DatePicker />
            </Form.Item>
            <div className="create-task-buttons-container">
              <Button
                onClick={() => onDismissTaskReminderModal()}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </Card>
    </TaskDecorator>
  );
};

export default TaskComponent;
