import React from 'react'
import { Box, Container, Tabs, Text, TabList, TabPanel, Tab, TabPanels } from '@chakra-ui/react'
import SignIn from './SignIn'
import Login from './Login'


const HomePage = () => {

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={'blue.500'}
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Comic Neue' color='white' textAlign='center'>Chatter's Paradise</Text>
      </Box>
      <Box bg={"blue.300"} w="100%" p={4} borderRadius="lg" borderWidth="1px" color='black'>
        <Tabs variant='soft-rounded' colorScheme='teal'>
          <TabList mb='1em'>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignIn />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage