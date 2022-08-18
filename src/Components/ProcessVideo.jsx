import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import VideoConvertor from "./VideoConvertor";

const ProcessVideo = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [videoObject, setVideoObject] = useState(null);
  const fileUploadRef = useRef();

  const videoUploadHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFileName(pickedFile.name);
      setFile(pickedFile);
      const url = URL.createObjectURL(pickedFile);
      setVideoObject(url);
    }
  };

  const removeVideo = () => {
    setFileName(null);
    setFile(null);
    setVideoObject(null);
  };
  return (
    <Box bg="#fff" h="100vh">
      <Box maxW="1400px" m="auto" p="4rem 5%">
        {!file && (
          <Flex alignItems="center" justifyContent="center" w="100%">
            <VStack>
              <Heading as="h3" fontSize="2xl" mb="4">
                Please select a video file to extract frames (mp4/mov)
              </Heading>
              <HStack>
                <input
                  type="file"
                  accept="video/mp4,video/*"
                  onChange={videoUploadHandler}
                  id="jsonUploadButton"
                  style={{ display: "none" }}
                  ref={fileUploadRef}
                />
                <Button
                  type="button"
                  onClick={() => fileUploadRef.current.click()}
                >
                  Browse
                </Button>
                <Text ml={4} minW="150px">
                  {fileName || "No file chosen"}
                </Text>
              </HStack>
            </VStack>
          </Flex>
        )}
        {file && videoObject && (
          <VideoConvertor
            file={file}
            videoObject={videoObject}
            removeVideo={removeVideo}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProcessVideo;
