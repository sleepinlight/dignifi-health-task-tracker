import { Input, Checkbox, Button, Form, Card, Layout, message } from "antd";
import React, { StrictMode } from "react";
import { useQuery } from "react-query/types/react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../Services/api";
import { useAuth } from "../Shared/hooks/useAuth";

const { Header, Content } = Layout;

const LoginPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user, login }: any = useAuth();
  const navigate = useNavigate();

  const onNavigateToCreateAccount = () => {
    navigate("/register", { replace: true });
  };

  const onFinish = async (values: any) => {
    try {
      let loginResponse = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      let data = await loginResponse.json();
      console.log(loginResponse);
      if (loginResponse.ok) {
        messageApi.open({
          type: "success",
          content: "Login successful!",
        });
        login(data);
      }
    } catch (e) {
      messageApi.open({
        type: "error",
        content: "Login failed!",
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
            <h3>Login</h3>
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
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input your email",
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
                Don't have an account?{" "}
                <Button type="link" onClick={() => onNavigateToCreateAccount()}>
                  Create one now
                </Button>
              </span>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
