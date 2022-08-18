import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [userName, setUserName] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      const { userName } = JSON.parse(localStorage.getItem("userInfo"));
      setUserName(userName);
    }
  }, []);
  return (
    <Flex
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px"
      borderBottomColor="blue.500"
      pb={3}
      mb={3}
    >
      <Text>Welcome, {userName}</Text>

      <Button
        rightIcon={<Icon as={MdLogout} w="22px" h="22px" />}
        size="sm"
        colorScheme="pink"
        variant="solid"
        onClick={() => {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }}
      >
        <Text display={{ base: "none", md: "block" }}>Sign Out!</Text>
      </Button>
    </Flex>
  );
};

export default Navbar;
