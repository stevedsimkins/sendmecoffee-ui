import React, { useState, useEffect } from "react"
import { useWallet } from "use-wallet";
import { ethers } from "ethers";
import {
  useColorMode,
  useToast,
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
  ButtonGroup,
  Spinner,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { FaGithub, FaTwitter, } from "react-icons/fa";
import avatar from "./assets/avatar.jpg";

import abi from "../utils/BuyMeCoffee.json";
import CONTRACT_ADDRESS from "./constants";

const contractABI = abi.abi;

const YOUR_NAME = "Steve Simkins";
const USER_NAME = "stevedsimkins";

const GITHUB_LINK = `https://github.com/${USER_NAME}`;
const TWITTER_LINK = `https://twitter.com/${USER_NAME}`;

function App() {
  const toast = useToast();

  //State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [donationValue, setDonationValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //use-wallet hook
  const wallet = useWallet();

  // Hook for changing from light mode to dark mode
  const { colorMode, toggleColorMode } = useColorMode();

  //Ethereum Functions 
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendDonation = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const buyMeCoffeeContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    let depositTxn = await buyMeCoffeeContract.deposit("hello", { value: ethers.utils.parseEther(donationValue) });
    setIsLoading(true);
    await depositTxn.wait();
    setIsLoading(false);
    setDonationValue(null);
    toastPopUp();
  };


  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!")
        return;
      }

      wallet.connect();
      setCurrentAccount(wallet.account)
    } catch (error) {
      console.log(error)
    }
  }
  //Use Effect 
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  //utils 
  const numberInputHandler = (e) => {
    setDonationValue(e.target.value);
  }

  const toastPopUp = () =>
    toast({
      title: "Donation Sent!",
      description: `Thank you for supporting ${YOUR_NAME}!`,
      status: "success",
      duration: 9000,
      isClosable: true,
    })


  //Conditional Rendering
  const renderContent = () => {
    const { ethereum } = window;
    if (!ethereum) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" width="full">
          <a href="https://metamask.io/" target="_blank"><Button width="full">Download Metamask</Button></a>
        </Box>
      )
    }

    if (wallet.status === 'connected') {
      return (
        <VStack spacing={6} py={5}>
          <NumberInput width="100%">
            <NumberInputField onChange={numberInputHandler} placeholder="Ξ" />
          </NumberInput>
          <Input placeholder="Write a message!" />
          {isLoading ? <Spinner /> :
            <Button w="100%" colorScheme="blue" onClick={() => sendDonation()} >Submit</Button>
          }
        </VStack>

      )
    } else {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" width="full">
          <Button onClick={() => connectWalletAction()}>Connect Wallet</Button>
        </Box>
      )
    }
  }

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
              If you would like to support {YOUR_NAME} in his <br />
              creative endeavors feel free to use this dApp <br />
              to buy him a coffee with cryto! <br />
            </Text>
          </Box>
          {renderContent()}
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
