import { Box, Container, Flex } from '@chakra-ui/react';
import { Actions, Stage, Title } from './components';
import { useInitBody } from './body';

import './index.css';

export function App(): JSX.Element {
  useInitBody();

  return (
    <Container h="full" maxW="container.xl">
      <Flex h="full" p={12} direction="column" gap={12}>
        <Title />
        <Box flex="auto">
          <Stage />
        </Box>
        <Actions />
      </Flex>
    </Container>
  );
}
