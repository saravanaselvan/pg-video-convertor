import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Container, HStack, Text, VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pgLogo from "../photoGauge_logo.png";

const Register = () => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/register", {
        username,
        email,
        password,
      });
      setLoading(false);
      setError(null);
      localStorage.setItem("userInfo", JSON.stringify(data.user_info));
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <Container
      maxW="xl"
      display="flex"
      flexDirection="column"
      h="100%"
      alignItems="center"
    >
      <Box bg="transparent" mt={6}>
        <Image src={pgLogo} mb={6} w="300px" />
      </Box>
      <Box
        bg="#fff"
        w="100%"
        p={{ base: 8, md: 8 }}
        borderRadius="lg"
        color="#000"
        borderWidth="1px"
        pt={8}
        boxShadow="dark-lg"
      >
        <VStack spacing="5px">
          <HStack alignSelf="flex-start">
            <Text fontSize="2xl" color="#000" mb={6} fontWeight="semibold">
              Create an account
            </Text>
          </HStack>
          <form onSubmit={submitHandler} style={{ width: "100%" }}>
            <FormControl id="username" isRequired mb={6}>
              <FormLabel mb={4} color="gray.600">
                Username
              </FormLabel>
              <Input
                placeholder="Enter Your Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isRequired={true}
              />
            </FormControl>
            <FormControl id="email" isRequired mb={6}>
              <FormLabel mb={4} color="gray.600">
                Email
              </FormLabel>
              <Input
                placeholder="Enter Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired={true}
              />
            </FormControl>
            <FormControl id="password" isRequired mb={6}>
              <FormLabel mb={4} color="gray.600">
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={hidePassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired={true}
                />
                <InputRightElement
                  onClick={() => setHidePassword(!hidePassword)}
                  cursor="pointer"
                  children={hidePassword ? <ViewIcon /> : <ViewOffIcon />}
                ></InputRightElement>
              </InputGroup>
            </FormControl>
            {error && (
              <Text textAlign="left" fontSize="sm" color="red">
                {error}
              </Text>
            )}

            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              isLoading={loading}
              type="submit"
            >
              Register
            </Button>
          </form>
          <Text
            pt={5}
            alignSelf="flex-start"
            fontSize="md"
            color="gray.600"
            fontWeight="500"
          >
            Have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#3182ce" }}
              className="register-link"
            >
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
