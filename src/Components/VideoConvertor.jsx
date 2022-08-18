import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

const VideoConvertor = ({ file, videoObject, removeVideo }) => {
  const [frameRate, setFrameRate] = useState("1");
  const [outputFormat, setOutputFormat] = useState("png");
  const [isExifInfoCaptured, setIsExifInfoCaptured] = useState(false);
  const [quality, setQuality] = useState("2");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const showServerError = useCallback(
    (message = "Something went wrong") => {
      toast({
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
    [toast],
  );

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("frame_rate", frameRate);
      formData.append("output_format", outputFormat);
      formData.append("is_exif_info_captured", isExifInfoCaptured);
      formData.append("quality", quality);

      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      setIsUploading(true);
      const { data } = await axios.post("/api/video_conversions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsUploading(false);
      setUploadCompleted(true);
      toast({
        description: `Upload successful. Check Uploads menu for status`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      setIsUploading(false);

      if (error.response.status === 401 || error.response.status === 422) {
        navigate("/login");
      } else if (error.response.status === 400) {
        showServerError(error.response.data.message);
      } else {
        showServerError();
      }
    }
  };

  return (
    <HStack alignItems="flex-start" gap="6">
      <VStack>
        <video width="700" controls>
          <source src={videoObject} />
        </video>
        <Button colorScheme="red" onClick={removeVideo}>
          Remove
        </Button>
      </VStack>
      <VStack alignItems="flex-start" gap="4" w="30%">
        <Heading as="h3" fontSize="2xl" mb="4">
          Parameters
        </Heading>
        <HStack w="80%" justifyContent="space-between">
          <Text fontSize="xl">Frame Rate: </Text>
          <Select
            disabled={uploadCompleted}
            w="100px"
            value={frameRate}
            onChange={(e) => setFrameRate(e.target.value)}
          >
            <option value="0.25">0.25</option>
            <option value="1">1</option>
            <option value="4">4</option>
          </Select>
        </HStack>
        <HStack w="80%" justifyContent="space-between">
          <Text fontSize="xl">Output Format: </Text>
          <Select
            disabled={uploadCompleted}
            w="100px"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </Select>
        </HStack>
        <HStack w="80%" justifyContent="space-between">
          <Text fontSize="xl">Quality: </Text>
          <Select
            disabled={uploadCompleted}
            w="100px"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="2">2</option>
            <option value="4">4</option>
          </Select>
        </HStack>
        <HStack w="80%">
          <Text fontSize="xl">Capture EXIF Info: </Text>
          <Checkbox
            disabled={uploadCompleted}
            size="lg"
            colorScheme="blue"
            value={isExifInfoCaptured}
            defaultChecked={isExifInfoCaptured}
            onChange={() => setIsExifInfoCaptured(!isExifInfoCaptured)}
          ></Checkbox>
        </HStack>
        <HStack w="100%" p="0 3rem">
          {!uploadCompleted && (
            <Button
              colorScheme="blue"
              alignSelf="center"
              flex="1"
              onClick={handleSubmit}
              isLoading={isUploading}
            >
              Upload
            </Button>
          )}
          {uploadCompleted && (
            <Button
              // colorScheme="blue"
              alignSelf="center"
              flex="1"
              onClick={() => setUploadCompleted(false)}
            >
              Edit
            </Button>
          )}
        </HStack>
        {uploadCompleted && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            // textAlign="center"
            height="100px"
          >
            <AlertDescription maxWidth="sm">
              Click Edit to modify Parameters and re-upload.
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </HStack>
  );
};

export default VideoConvertor;
