import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Uploads = () => {
  const [conversions, setConversions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = (data, fileName, contentType) => {
    const blob = new Blob([data], { type: contentType });
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

  const viewReport = async (id, type, fileName) => {
    const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
    const response = await axios.get(
      `/api/download_report/${id}?type=${type}`,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    downloadFile(
      response.data,
      `${fileName}`,
      response.headers["content-type"],
    );
  };

  useEffect(() => {
    const fetchVideoConversions = async () => {
      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      setIsLoading(true);
      const { data } = await axios.get("/api/video_conversions_list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setConversions(data.video_conversions);
      setIsLoading(false);
    };

    fetchVideoConversions();
  }, []);

  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        <Table
          size="sm"
          variant="striped"
          sx={{ width: "100%", tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th>Input File</Th>
              <Th textAlign="center" w="325px">
                Params <br />
                <Text fontSize="x-small" fontWeight="bolder">
                  (FPS | Output Format | Quality | EXIF Captured?)
                </Text>
              </Th>
              {/* <Th w="150px">Frame Rate</Th>
              <Th>Output Format</Th>
              <Th>EXIF Captured?</Th> */}
              <Th w="150px">Params YAML</Th>
              <Th w="120px">Report</Th>
              <Th w="200px">Upload Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading && (
              <Tr height="60vh">
                <Td colspan="5" textAlign="center">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </Td>
              </Tr>
            )}
            {conversions.map(
              (
                {
                  id,
                  status,
                  original_uploaded_file_name,
                  param_frame_rate,
                  param_output_format,
                  param_is_exif_info_captured,
                  param_quality,
                  output_yaml_file_name,
                  output_pdf_file_name,
                  created_at,
                },
                index,
              ) => (
                <Tr key={id}>
                  <Td
                    color="#3182ce"
                    fontWeight="500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    <Link to={`/upload-details/${id}`}>
                      {original_uploaded_file_name}
                    </Link>
                  </Td>
                  <Td textAlign="center">
                    {param_frame_rate} | {param_output_format.toUpperCase()} |{" "}
                    {param_quality} |{" "}
                    {param_is_exif_info_captured ? "Yes" : "No"}
                  </Td>
                  {status === "COMPLETED" && (
                    <>
                      <Td
                        onClick={() =>
                          viewReport(id, "yaml", output_yaml_file_name)
                        }
                      >
                        <Text
                          color="#3182ce"
                          fontWeight="500"
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {output_yaml_file_name}
                        </Text>
                      </Td>
                      <Td
                        onClick={() =>
                          viewReport(id, "pdf", output_pdf_file_name)
                        }
                      >
                        <Text
                          color="#3182ce"
                          fontWeight="500"
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {output_pdf_file_name}
                        </Text>
                      </Td>
                    </>
                  )}
                  {status !== "COMPLETED" && (
                    <Td
                      colSpan="2"
                      textAlign="center"
                      color={
                        status === "PENDING" || status.includes("ERR")
                          ? "red"
                          : "orange"
                      }
                      fontWeight="bold"
                    >
                      {status}
                    </Td>
                  )}
                  <Td>{created_at}</Td>
                </Tr>
              ),
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Uploads;
