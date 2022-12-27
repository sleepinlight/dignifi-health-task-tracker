import React, { StrictMode } from "react";
import { useQuery } from "react-query";
import TaskComponent from "./Tasks/Task";

const HomePage: React.FC = () => {
  const userId = 1;

  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: any; data: any } = useQuery("tasks", () =>
    fetch(`http://localhost:3004/api/tasks/${userId}`).then((res) => res.json())
  );

  return (
    <div>
      {data &&
        data.map((task: any) => (
          <TaskComponent key={task.id} task={task}></TaskComponent>
        ))}
    </div>
  );
};

export default HomePage;
