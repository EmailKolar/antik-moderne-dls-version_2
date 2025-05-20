
import NavBar from '../components/NavBar'
import { Box, Heading, Text} from '@chakra-ui/react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {

    const error = useRouteError();
  return (
    <>
    <NavBar/>
    <Box>
        <Heading>Oops! Something went wrong.</Heading>
        <Text>We couldn't find the page you were looking for.</Text>
        <Text>Please check the URL or go back to the homepage.
            {isRouteErrorResponse(error) ? "err" : "err32"}
        </Text>
    </Box>
    
    </>
  )
}

export default ErrorPage

