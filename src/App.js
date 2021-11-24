import { useWallet } from "use-wallet";
import { useColorMode, Flex, Container, VStack, Avatar, Box, Heading, Input, NumberInput, NumberInputField, Button } from "@chakra-ui/react";
import avatar from "./assets/avatar.jpg";

function App() {

  const wallet = useWallet();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.lg" >
      <Flex justify="center" align="center" h="100vh" py={20} >
        <Box>
          <VStack spacing={6}>
            <Avatar size="xl" name="Steve" src={avatar} />
            <Heading>Send Steve a Coffee</Heading>
            <NumberInput width="100%">
              <NumberInputField placeholder="Ξ" />
            </NumberInput>
            <Input placeholder="Message" />
            <Button w="100%" colorScheme="blue" >Submit</Button>
            <Button onClick={toggleColorMode}>Toggle</Button>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

export default App;
