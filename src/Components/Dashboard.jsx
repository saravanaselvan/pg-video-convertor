import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Container, HStack, Link, Stack } from "@chakra-ui/layout";
import { Outlet, useNavigate } from "react-router";
import { Link as RouterLink, NavLink } from "react-router-dom";
import Login from "./Login";
import pgLogo from "../photoGauge_logo.png";

const Dashboard = () => {
  const normalStyle = {
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
  };
  const activeStyle = { ...normalStyle, background: "#3182ce" };
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Login />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <header>
        <Box bg="#082237">
          <HStack
            sx={{
              color: "#fff",
              maxWidth: "1400px",
              margin: "auto",
              padding: "1rem 5%",
            }}
            gap="1rem"
          >
            <Box bg="transparent" mr="16">
              <Image src={pgLogo} w="200px" />
            </Box>
            <NavLink
              to="/"
              fontWeight="bold"
              style={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
              Home
            </NavLink>
            <Box flex="1">
              <NavLink
                as={RouterLink}
                to="/uploads"
                fontWeight="bold"
                style={({ isActive }) => (isActive ? activeStyle : normalStyle)}
              >
                Uploads
              </NavLink>
            </Box>
            <Avatar name={userInfo?.userName} />
          </HStack>
        </Box>
      </header>
      <Outlet />
    </Box>
  );
};

export default Dashboard;
