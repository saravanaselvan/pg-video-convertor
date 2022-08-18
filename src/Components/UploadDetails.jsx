import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const UploadDetails = () => {
  const [videoObject, setVideoObject] = useState();
  const [videoConversion, setVideoConversion] = useState();
  const navigate = useNavigate();
  const toast = useToast();

  const { id } = useParams();

  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
    const fetchReport = async () => {
      const response = await axios.get(`/api/download_video/${id}`, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setVideoObject(URL.createObjectURL(blob));
    };

    fetchReport();
  }, []);

  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
    const fetchVideoConversion = async () => {
      const {
        data: { video_conversion },
      } = await axios.get(`/api/video_conversions/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setVideoConversion(video_conversion);
    };
    fetchVideoConversion();
  }, []);

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
  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        <HStack alignItems="flex-start" gap="6">
          <VStack>
            <video width="700" controls>
              {videoObject && <source src={videoObject} />}
            </video>
          </VStack>
          <VStack alignItems="flex-start" gap="4" w="30%">
            <Heading as="h3" fontSize="2xl" mb="4">
              Parameters
            </Heading>
            <code>
              <Text color="brown" display="inline">
                input_file_name:
              </Text>{" "}
              <Text color="blue" display="inline">
                {videoConversion?.original_uploaded_file_name}
              </Text>{" "}
              <br />
              <Text color="brown" display="inline">
                params:
              </Text>{" "}
              <br />
              &nbsp;&nbsp;
              <Text color="brown" display="inline">
                frame_rate:{" "}
              </Text>
              <Text color="green" display="inline">
                {videoConversion?.param_frame_rate}
              </Text>{" "}
              <br />
              &nbsp;&nbsp;
              <Text color="brown" display="inline">
                output_format:
              </Text>{" "}
              <Text color="blue" display="inline">
                {videoConversion?.param_output_format.toUpperCase()}
              </Text>
              <br />
              &nbsp;&nbsp;
              <Text color="brown" display="inline">
                quality:
              </Text>{" "}
              <Text color="blue" display="inline">
                {videoConversion?.param_quality}
              </Text>
              <br />
              &nbsp;&nbsp;
              <Text color="brown" display="inline">
                exif_info_captured:
              </Text>{" "}
              <Text color="blue" display="inline">
                {videoConversion?.param_is_exif_info_captured ? "Yes" : "No"}
              </Text>{" "}
            </code>
            <Heading as="h3" fontSize="2xl" mb="4">
              Download
            </Heading>
            {videoConversion?.status === "COMPLETED" && (
              <HStack>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    viewReport(
                      videoConversion.id,
                      "pdf",
                      videoConversion.output_pdf_file_name,
                    )
                  }
                >
                  Report PDF
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    viewReport(
                      videoConversion.id,
                      "yaml",
                      videoConversion.output_yaml_file_name,
                    )
                  }
                >
                  Params YAML
                </Button>
                {videoConversion.param_is_exif_info_captured && (
                  <Button
                    colorScheme="blue"
                    onClick={() =>
                      viewReport(videoConversion.id, "json", "exif.json")
                    }
                  >
                    Exif JSON
                  </Button>
                )}
              </HStack>
            )}
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default UploadDetails;
