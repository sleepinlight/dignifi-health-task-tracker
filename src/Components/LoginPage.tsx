import { Input, Checkbox, Button, Form, Card } from "antd";
import React, { StrictMode } from "react";
import { useQuery } from "react-query/types/react";
import { useAuth } from "../Shared/hooks/useAuth";

const LoginPage: React.FC = () => {
  //   const { isLoading, error, data } = useQuery("login", () => {
  //     fetch("http://localhost:3004/api/login");
  //   });

  const { login }: any = useAuth();

  const onFinish = (values: any) => {
    fetch("http://localhost:3004/api/login", {
      method: "POST",
      body: JSON.stringify({ Email: values.email, Password: values.password }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res: any) => {
      if (res && res.status === 200) {
        login(res.json()[0].Token);
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
