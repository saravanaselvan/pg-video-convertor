import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Container, HStack, Link, Stack } from "@chakra-ui/layout";
import { Outlet } from "react-router";
import { Link as RouterLink, NavLink } from "react-router-dom";
import pgLogo from "../photoGauge_logo.png";

const Dashboard = () => {
  const normalStyle = {
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
  };
  const activeStyle = { ...normalStyle, background: "#3182ce" };
  const { userName } = JSON.parse(localStorage.getItem("userInfo"));
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
            <Avatar name={userName} />
          </HStack>
        </Box>
      </header>
      <Outlet />
    </Box>
  );
};

export default Dashboard;
