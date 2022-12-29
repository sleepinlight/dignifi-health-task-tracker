import { Input, Checkbox, Button, Form, Card, Layout, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../Services/api";

const { Header, Content } = Layout;

const RegisterPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onNavigateToLogin = () => {
    navigate("/login", { replace: true });
  };

  const onFinish = async (values: any) => {
    try {
      let createAccountResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      let data = await createAccountResponse.json();
      if (createAccountResponse.ok) {
        messageApi.open({
          type: "success",
          content: "Account creation successful!",
        });
        onNavigateToLogin();
      }
    } catch (e) {
      messageApi.open({
        type: "error",
        content: "Registration failed!",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout>
      <Header>
        <div className="header-bar-container login-header-bar">
          <div>
            <h1>Task Tracker</h1>
          </div>
        </div>
      </Header>
      <Content>
        {contextHolder}
        <div className="auth-form-container">
          <div className="auth-container-header">
            <h3>Create Account</h3>
          </div>
          <Card bordered={false}>
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
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "right" }}>
              <span>
                Already have an account?{" "}
                <Button type="link" onClick={() => onNavigateToLogin()}>
                  Login instead
                </Button>
              </span>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default RegisterPage;
