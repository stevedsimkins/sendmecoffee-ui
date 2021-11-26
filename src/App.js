import { useWallet } from "use-wallet";
import {
  useColorMode,
  IconButton,
  Text,
  Flex,
  Container,
  VStack,
  Avatar,
  Box,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  ButtonGroup
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { FaGithub, FaTwitter, } from "react-icons/fa";
import avatar from "./assets/avatar.jpg";

const USER_NAME = "stevedsimkins";

const GITHUB_LINK = `https://github.com/${USER_NAME}`;
const TWITTER_LINK = `https://twitter.com/${USER_NAME}`;

function App() {

  const wallet = useWallet();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.lg" >
      <IconButton pos="absolute" top="5%" right="5%" aria-label="toggle color mode" icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} />
      <Flex justify="center" align="center" h="100vh" py={20} >
        <Box>
          <Box display="flex" justifyContent="center" alignItems="center" w="full" py={3}>
            <Avatar size="xl" name="Steve" src={avatar} />
          </Box>
          <Box py={3}>
            <Heading py={2}>Support with Crypto!</Heading>
            <Text fontSize="md">
              If you would like to support Steve in his <br />
              creative endeavors feel free to use this dApp <br />
              to buy him a coffee with cryto! <br />
            </Text>
          </Box>
          <VStack spacing={6} py={5}>
            <NumberInput width="100%">
              <NumberInputField placeholder="Ξ" />
            </NumberInput>
            <Input placeholder="Write a message!" />
            <Button w="100%" colorScheme="blue" >Submit</Button>
          </VStack>
        </Box>
        <Box pos="absolute" bottom="5%">
          <Text fontSize="sm" py={2}>Created by Steve Simkins</Text>
          <ButtonGroup display="flex" justifyContent="center" alignItems="center" spacing="6">
            <a target="_blank" href={GITHUB_LINK}><IconButton aria-label="github social" icon={<FaGithub />} /></a>
            <a target="_blank" href={TWITTER_LINK}><IconButton aria-label="Twitter social" icon={<FaTwitter />} /></a>
          </ButtonGroup>
        </Box>
      </Flex>
    </Container>
  );
}

export default App;
