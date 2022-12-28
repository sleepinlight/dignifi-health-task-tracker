import React, { StrictMode } from "react";
import { useQuery } from "react-query";
import TaskComponent from "./Tasks/Task";
import "../App.css";
import { FloatButton, message, Spin } from "antd";

const HomePage: React.FC = () => {
  const [messageApi, parentContextHolder] = message.useMessage();
  const userId = 1;

  const {
    isLoading,
    isFetching,
    error,
    data,
  }: { isLoading: boolean; isFetching: boolean; error: any; data: any } =
    useQuery("tasks", () =>
      fetch(`http://localhost:3004/api/tasks/${userId}`).then((res) =>
        res.json()
      )
    );

  const onDeleteTask = () => {
    messageApi.open({
      type: "success",
      content: "Successfully deleted task.",
    });
  };

  return (
    <div>
      <div className="tasks-container">
        <h1>Task Tracker</h1>
        {parentContextHolder}
        <Spin
          spinning={isLoading || isFetching}
          size={"large"}
          key={"spintask"}
          className="tasks-spin-loader"
        >
          {data &&
            data.map((task: any) => (
              <TaskComponent
                key={task.id}
                task={task}
                onDeleteTaskCallback={onDeleteTask}
              ></TaskComponent>
            ))}
        </Spin>
      </div>
      <FloatButton
        type="primary"
        className="create-task-button"
        onClick={() => console.log("click")}
      />
    </div>
  );
};

export default HomePage;
