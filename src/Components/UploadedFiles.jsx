import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";

const UploadedFiles = ({ prices }) => {
  const downloadFile = (data, fileName) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  return (
    <Box overflowX="auto" maxWidth={{ sm: "375px", md: "630px", lg: "900px" }}>
      <Table
        size="sm"
        variant="striped"
        sx={{ width: "100%", tableLayout: "fixed" }}
      >
        <Thead>
          <Tr>
            {/* <Th>Created Date</Th> */}
            <Th w="200px">Input File</Th>
            <Th w="320px">Output File</Th>
            <Th w="120px">Begin Date</Th>
            <Th w="120px">End Date</Th>
            <Th w="95px" textAlign="right">
              Sum / Average
            </Th>
            {/* <Th>Average</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {prices.map((price, index) => (
            <Tr key={price.id}>
              {/* <Td>{price.created_at}</Td> */}
              <Td bgColor={index === 0 ? "#9AE6B4 !important" : ""}>
                {price.original_uploaded_file_name}
              </Td>
              <Td
                onClick={async () => {
                  const { accessToken } = JSON.parse(
                    localStorage.getItem("userInfo")
                  );
                  const { data } = await axios.get(
                    `/api/download_result/${price.id}`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );
                  downloadFile(data, price.output_file_name);
                }}
                bgColor={index === 0 ? "#9AE6B4 !important" : ""}
              >
                <Text
                  color="teal"
                  fontWeight="500"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  {price.output_file_name}
                </Text>
              </Td>
              <Td bgColor={index === 0 ? "#9AE6B4 !important" : ""}>
                {price.begin_date}
                {/* / {price.end_date} */}
              </Td>
              <Td bgColor={index === 0 ? "#9AE6B4 !important" : ""}>
                {price.end_date}
              </Td>
              <Td
                textAlign="right"
                bgColor={index === 0 ? "#9AE6B4 !important" : ""}
              >
                {price.sum} / {price.average}
              </Td>
              {/* <Td>{price.average}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UploadedFiles;
