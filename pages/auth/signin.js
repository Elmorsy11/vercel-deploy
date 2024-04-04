import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import Image from "next/image";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/client";
import jwt_decode from "jwt-decode";
import { useRef } from "react";
import axios from "axios";
import Logo from "public/assets/main-logo.svg";

const Signin = () => {
  const [isToken, setisToken] = useState(false);
  const signInBtnRef = useRef();

  const router = useRouter();
  const { q } = router.query;
  const [respObj, setRespObj] = useState({
    token: null,
    sharex_user: {},
    fms_new_token: null,
    fms_user: null,
  });

  useEffect(() => {
    if (q !== undefined) {
      setisToken(true);
      const userobj = jwt_decode(q);
      setRespObj((prev) => ({
        ...prev,
        token: q,
        sharex_user: userobj,
      }));
      setTimeout(() => {
        signInBtnRef.current.click();
      }, 0);
    }
  }, [q]);

  const loginSchema = yup.object(
    isToken
      ? {
          username: yup.string(),
          password: yup.string(),
        }
      : {
          username: yup.string().required("Required"),
          password: yup.string().required("Required"),
        }
  );

  const initialValues = {
    username: "",
    password: "",
    remember_me: false,
  };
  return (
    <>
      <section
        className="w-100 vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "#3668E9",
        }}
      >
        <Row className="justify-content-center">
          <Col md="10">
            <Card
              className="p-4"
              style={{
                width: "546px",
                height: "650px",
                background: "#F5F5F5",
                borderRadius: "24px",
              }}
            >
              <Card.Body>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    marginBottom: "24px",
                  }}
                >
                  <Image src={Logo} alt="Logo" width={136} height={181} />
                </div>
                <div>
                  <p
                    style={{
                      color: "#2D3748",
                      fontSize: "16px",
                      fontWeight: "400",
                      lineHeight: "24px",
                    }}
                    className="text-start mb-0 "
                  >
                    Welcome back
                  </p>
                  <h2
                    className="text-start"
                    style={{
                      color: "#1A202C",
                      fontSize: "30px",
                      fontWeight: "700",
                      lineHeight: "45px",
                    }}
                  >
                    Login to your account
                  </h2>
                </div>{" "}
                <Formik
                  initialValues={initialValues}
                  validationSchema={loginSchema}
                  onSubmit={async ({ username, password }, { setSubmitting }) => {
                    if (isToken) {
                      signIn("credentials", {
                        user: JSON.stringify(respObj),
                      });
                    }
                    await axios(
                      `https://sr-itc-dev-api-hcr64pytia-uc.a.run.app/api/v1/auth/login`,
                      {
                        method: "POST",
                        data: {
                          username: username,
                          password: password,
                        },
                      }
                    )
                      .then(({ data }) => {
                        signIn("credentials", {
                          user: JSON.stringify(data),
                        });
                      })
                      .catch(({ response }) => {
                        setSubmitting(false);
                        toast.error(response?.data?.enMessage
                          );
                      });
                  }}
                >
                  {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    touched,
                    isSubmitting,
                  }) => (
                    <Form onSubmit={handleSubmit} noValidate>
                      <Row>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <FormLabel htmlFor="username" className="">
                              user Name
                            </FormLabel>
                            <Form.Control
                              type="text"
                              id="username"
                              name="username"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={isToken ? " " : values.username}
                              aria-describedby="username"
                              isInvalid={errors.username && touched.username}
                              placeholder=" "
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.username && touched.username}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Form.Control
                              type="password"
                              id="password"
                              name="password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={isToken ? "*" : values.password}
                              aria-describedby="password"
                              isInvalid={errors.password && touched.password}
                              placeholder=" "
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.password && touched.password}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="12" className="d-flex justify-content-between">
                          <Form.Check className="form-check mb-3">
                            <Form.Check.Input
                              type="checkbox"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              name="remember_me"
                              id="customCheck1"
                            />
                            <Form.Check.Label htmlFor="customCheck1">
                              Remember Me
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center">
                        <Button
                          ref={signInBtnRef}
                          type="submit"
                          disabled={isSubmitting}
                          variant="d-flex fw-bold justify-content-center w-75 align-items-end px-4 py-2 mt-4"
                          style={{
                            background: "#3668E9",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fff",
                          }}
                        >
                          <span>Login Now</span>
                          {isSubmitting && (
                            <Spinner
                              as="span"
                              role="status"
                              style={{ verticalAlign: "sub" }}
                              className="mx-1"
                              aria-hidden="true"
                              size="sm"
                              animation="border"
                            />
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Signin;

export async function getStaticProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
