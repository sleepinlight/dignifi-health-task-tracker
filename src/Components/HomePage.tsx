import React, { StrictMode, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TaskComponent from "./Tasks/Task";
import "../App.css";
import {
  Button,
  Checkbox,
  DatePicker,
  FloatButton,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  notification,
  Layout,
} from "antd";
import { Task, TaskForCreate } from "../Shared/interfaces/Task";
import Moment from "moment";
import { useAuth } from "../Shared/hooks/useAuth";
import baseUrl from "../Services/api";

const { Header, Content } = Layout;

const HomePage: React.FC = () => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] =
    useState<boolean>(false);
  const [messageApi, parentContextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { user, logout }: any = useAuth();
  const userId = user.id;

  const openRemindersNotification = (tasksWithReminders: Task[]) => {
    notification.open({
      message: `Reminders`,
      description: (
        <>
          <span> {`${tasksWithReminders.length} task(s) overdue`}</span>
          <ul>
            {tasksWithReminders.map((t) => {
              return <li key={`reminder-for-${t.id}`}>{t.title}</li>;
            })}
          </ul>
        </>
      ),
    });
  };

  const onShowNewTaskModal = (): void => {
    setIsCreateTaskModalOpen(true);
  };

  const onDismissNewTaskModal = (): void => {
    setIsCreateTaskModalOpen(false);
  };

  const createTask = useMutation((values: TaskForCreate) => {
    return fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        notes: values.notes || "",
        reminderSet: values.reminderSet || false,
        reminderDate: values.reminderDate || new Date(),
        userId: userId,
      }),
    }).then((res) => {
      if (res.ok) {
        queryClient.invalidateQueries("tasks");
        onDismissNewTaskModal();
      }
    });
  });

  const {
    isLoading,
    isFetching,
    error,
    data,
  }: { isLoading: boolean; isFetching: boolean; error: any; data: any } =
    useQuery("tasks", () =>
      fetch(`${baseUrl}/tasks/${userId}`).then((res) => res.json())
    );

  const onDeleteTask = (): void => {
    messageApi.open({
      type: "success",
      content: "Successfully deleted task.",
    });
  };

  const getTasksWithValidReminders = (tasks: Task[]): Task[] => {
    return (
      tasks.filter((t) => {
        return (
          t.reminderSet &&
          !t.completed &&
          Moment(t.reminderDate).isBefore(Moment())
        );
      }) || []
    );
  };

  const getTasksByCompletionStatus = (completed: boolean): Task[] => {
    let tasks: Task[] = [];
    if (data?.length > 0) {
      tasks = completed
        ? data.filter((x: Task) => x.completed)
        : data.filter((x: Task) => !x.completed);
    }
    return tasks;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const tasksWithReminders = getTasksWithValidReminders(data);
      if (tasksWithReminders.length > 0) {
        openRemindersNotification(tasksWithReminders);
      }
    }
  }, [data]);

  return (
    <Layout>
      <Header>
        <div className="header-bar-container">
          <div>
            <h3>{`Welcome, ${user.username}`}</h3>
          </div>
          <div>
            <h1>Task Tracker</h1>
          </div>
          <Button type="primary" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </Header>
      <Content>
        {" "}
        <div>
          <Modal
            title="Create New Task"
            open={isCreateTaskModalOpen}
            onCancel={() => onDismissNewTaskModal()}
            footer={null}
          >
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={(values) => createTask.mutate(values)}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please include a task title" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Notes" name="notes">
                <Input />
              </Form.Item>
              <Form.Item
                label="Set Reminder"
                name="reminderSet"
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>

              <Form.Item label="Reminder Date" name="reminderDate">
                <DatePicker />
              </Form.Item>
              <div className="create-task-buttons-container">
                <Button
                  onClick={() => onDismissNewTaskModal()}
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

          <div className="tasks-container-outer">
            {parentContextHolder}

            <Spin
              spinning={isLoading || isFetching}
              size={"large"}
              key={"spintask"}
              className="tasks-spin-loader"
            >
              {data && data.length > 0 ? (
                <div className="tasks-container-inner">
                  <div className="task-pane">
                    <h3>Todo</h3>
                    <hr></hr>
                    {getTasksByCompletionStatus(false).map((task: any) => {
                      if (!task.completed) {
                        return (
                          <TaskComponent
                            key={task.id}
                            task={task}
                            onDeleteTaskCallback={onDeleteTask}
                          ></TaskComponent>
                        );
                      }
                    })}
                  </div>
                  {getTasksByCompletionStatus(true).length > 0 && (
                    <div className="task-pane">
                      <h3>Completed</h3>
                      <hr></hr>
                      {getTasksByCompletionStatus(true).map((task: any) => {
                        if (task.completed) {
                          return (
                            <TaskComponent
                              key={task.id}
                              task={task}
                              onDeleteTaskCallback={onDeleteTask}
                            ></TaskComponent>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <h3>
                  No tasks created! Click the button in the bottom right to get
                  started
                </h3>
              )}
            </Spin>
          </div>
          <FloatButton
            type="primary"
            className="create-task-button"
            onClick={() => onShowNewTaskModal()}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;
