import { Button, ConfigProvider, Divider, Input, Table } from "antd";
import NavBar from "../Navbar";
import classes from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { PRIMARY_COLOR } from "../../services/constant";
import {
  SendAllTasksInEmail,
  createTodo,
  deleteTodo,
  fetchTodoApiCall,
  updateStatus,
} from "../../services/apiCall";
import ToastMessage from "../ToastMessage";

export const Home = () => {
  const [newTask, setNewTask] = useState();
  const [tableData, setTableData] = useState([]);
  // const []
  const handleAddNewTask = async () => {
    //API CALL add task - one task
    const userId = localStorage.getItem("userId");
    if (newTask) {
      const data = {
        task: newTask,
        status: "PENDING",
        userId: userId,
      };

      const response = await createTodo(data);
      if (response) {
        const updateIndexTableData = response.map((t, index) => {
          return { ...t, index: index + 1 };
        });
        console.log(updateIndexTableData);
        setTableData(updateIndexTableData);
        setNewTask("");
      }
    }
  };
  const handleSendTodoInEmail = async () => {
    const userId = localStorage.getItem("userId");
    if (tableData.length > 0) {
      const response = await SendAllTasksInEmail(userId);
      if (response) {
        ToastMessage("Email sent successfully");
      }
    } else {
      ToastMessage("There is no task to send", "error");
    }
  };

  const handleUpdateStatus = async (record, value) => {
    const response = await updateStatus(record.id, value);
    console.log(response);
    if (response.status) {
      const data = tableData.map((t) => {
        if (t.id === record.id) {
          return {
            ...t,
            index: t.index,
            status: value,
          };
        }
        return t;
      });
      console.log(data);
      setTableData(data);
    }
  };

  const handleDeleteTodo = async (record) => {
    const response = await deleteTodo(record.id);
    console.log(record);
    if (response.status) {
      const data = tableData
        .filter((t) => t.id !== record.id)
        .map((todo, index) => {
          return {
            ...todo,
            index: index + 1,
          };
        });
      setTableData(data);
      console.log(data);
    } else {
      console.log("Error in deleting");
    }
  };

  const fetchTodos = async () => {
    const data = await fetchTodoApiCall();
    setTableData(
      data.map((todo, index) => {
        return {
          ...todo,
          index: index + 1,
        };
      })
    );
  };
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Update Status",
      dataIndex: "action",
      render: (_, record) => (
        <div className={classes.action_buttons}>
          {record.status !== "IN-PROGRESS" && record.status !== "COMPLETED" ? (
            <Button onClick={() => handleUpdateStatus(record, "IN-PROGRESS")}>
              In progress
            </Button>
          ) : (
            <></>
          )}

          {record.status !== "COMPLETED" ? (
            <Button
              style={{
                borderColor: "#198754",
                color: "#198754",
              }}
              onClick={() => handleUpdateStatus(record, "COMPLETED")}
            >
              Complete
            </Button>
          ) : (
            <></>
          )}

          <Button danger onClick={() => handleDeleteTodo(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <>
      <NavBar />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: PRIMARY_COLOR,
          },
        }}
      >
        <h1 className={classes.title}>
          Welcome, {localStorage.getItem("username")} to TODO application
        </h1>
        <Divider />
        <div className={classes.container}>
          <div className={classes.task_title}>
            <div className={classes.add_task_send}>
              <h1>Today's tasks</h1>
              <Button type="primary" onClick={() => handleSendTodoInEmail()}>
                Email All Tasks
              </Button>
            </div>
            <div className={classes.add_task}>
              <Input
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
                value={newTask}
              />
              <Button type="primary" onClick={() => handleAddNewTask()}>
                Add Task
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            scroll={true}
            pagination={tableData.length > 5 ? { pageSize: 5 } : false}
          />
        </div>
      </ConfigProvider>
    </>
  );
};
