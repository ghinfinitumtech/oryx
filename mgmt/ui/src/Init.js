import Container from "react-bootstrap/Container";
import {Button, Form} from "react-bootstrap";
import React from "react";
import axios from "axios";
import {Token, Tools} from "./utils";
import {useNavigate} from "react-router-dom";

export default function Init({onInit}) {
  const [password, setPassword] = React.useState();
  const navigate = useNavigate();

  // Generate password if not initialized.
  React.useEffect(() => {
    setPassword(Math.random().toString(16).slice(-6));
  }, []);

  // User click login button.
  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('/terraform/v1/mgmt/init', {
      password,
    }).then(res => {
      const data = res.data.data;
      console.log(`Init: OK, token is ${Tools.mask(data)}`);
      Token.save(data);
      onInit && onInit();
      navigate('/system');
    }).catch(e => {
      const err = e.response.data;
      alert(`${err.code}: ${err.data.message}`);
      console.error(e);
    });
  };

  return (
    <>
      <Container>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>请设置初始密码</Form.Label>
            <Form.Control type="text" placeholder="Password" defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}/>
            <Form.Text className="text-muted">
              * 自动生成的初始管理员密码，可以修改
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={(e) => handleLogin(e)}>
            设置管理员密码
          </Button>
        </Form>
      </Container>
    </>
  );
}

