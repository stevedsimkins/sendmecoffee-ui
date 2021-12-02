import React, { useState, useEffect } from "react"
import { useWallet } from "use-wallet";
import { ethers } from "ethers";
import {
  useColorMode,
  useToast,
  useColorModeValue,
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

import abi from "./BuyMeCoffee.json";
import { OWNER_ADDRESS, CONTRACT_ADDRESS } from "./constants";

const contractABI = abi.abi;

const YOUR_NAME = "Steve";
const USER_NAME = "stevedsimkins";

const GITHUB_LINK = `https://github.com/${USER_NAME}`;
const TWITTER_LINK = `https://twitter.com/${USER_NAME}`;

function App() {
  const toast = useToast();

  //State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [donationValue, setDonationValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allDonations, setAllDonations] = useState([]);
  const [message, setMessage] = useState("");

  //use-wallet hook
  const wallet = useWallet();

  // Hook for changing from light mode to dark mode
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.200", "#2c313d");
  const color = useColorModeValue("black", "white");
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
          getAllDonations();
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendDonation = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const buyMeCoffeeContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      let depositTxn = await buyMeCoffeeContract.deposit(`${donationValue}`, `${message}`, { value: ethers.utils.parseEther(donationValue) });
      setIsLoading(true);
      await depositTxn.wait();
      setIsLoading(false);
      setDonationValue(null);
      toastPopUp();
      getAllDonations();
    } catch (error) {
      console.log(error)
    }
  };

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const buyMeCoffeeContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    let withdrawTxn = await buyMeCoffeeContract.withdraw();
    setIsLoading(true);
    await withdrawTxn.wait();
    setIsLoading(false);
    toastPopUpWithdraw();
  }


  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!")
        return;
      }

      wallet.connect();
      setCurrentAccount(wallet.account)
      getAllDonations();
    } catch (error) {
      console.log(error)
    }
  }

  const getAllDonations = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const buyMeCoffeeContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      let donations = await buyMeCoffeeContract.getAllCoffees();

      let donationsCleaned = []
      donations.forEach(donation => {
        donationsCleaned.push({
          sender: donation.sender,
          amount: donation.amount,
          message: donation.message,
        })
      });
      donationsCleaned.reverse();
      setAllDonations(donationsCleaned);
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

  const messageInputHandler = (e) => {
    setMessage(e.target.value);
  }

  const toastPopUp = () =>
    toast({
      title: "Donation Sent!",
      description: `Thank you for supporting ${YOUR_NAME}!`,
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  const toastPopUpWithdraw = () =>
    toast({
      title: "Withdraw Successful!",
      description: `Please check your wallet to confirm the funds sent to your account`,
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
          {wallet.account === OWNER_ADDRESS ? (
            null
          ) :
            <>
              <NumberInput width="100%">
                <NumberInputField onChange={numberInputHandler} placeholder="Ξ" />
              </NumberInput>
              <Input placeholder="Write a message!" onChange={messageInputHandler} />
            </>
          }
          {isLoading ? <Spinner /> :
            <Button w="100%" colorScheme="blue" onClick={() => { wallet.account === OWNER_ADDRESS ? withdraw() : sendDonation() }} >{wallet.account === OWNER_ADDRESS ? `Withdraw` : `Submit`}</Button>
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
      <Flex justify="center" align="center" minH="100vh" flexWrap="wrap" py={20} >
        <Box mx={10}>
          <Box display="flex" justifyContent="center" alignItems="center" w="full" py={3}>
            <Avatar size="xl" name="Steve" src={avatar} />
          </Box>
          <Box py={3}>
            <Heading py={2}>Support with Crypto!</Heading>
            {wallet.account === OWNER_ADDRESS ? (
              <Text fontSize="md">
                Withdraw your donations below!
              </Text>
            ) : (
              <Text fontSize="md">
                If you would like to support {YOUR_NAME} in his <br />
                creative endeavors feel free to use this dApp <br /> to buy him a coffee with cryto! <br /> </Text>)} </Box> {renderContent()}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" flexDir="column">
          <Heading> 🚀 {YOUR_NAME}'s Supporters</Heading>
          <Box mx={10} my={3} overflowY="scroll" maxH="350">
            {allDonations.map((donation, index) => {
              return (
                <Box maxW="420px" p={4} my={3} bg={bg} color={color} rounded="md">
                  <Text isTruncated >From: {donation.sender}</Text>
                  <Text>Donated: Ξ {donation.message}</Text>
                  <Text>Message: {donation.amount}</Text>
                </Box>
              )
            })}
          </Box>
        </Box>
        <Box pos="absolute" bottom="2%">
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
