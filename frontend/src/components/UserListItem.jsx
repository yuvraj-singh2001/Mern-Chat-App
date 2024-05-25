import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";


const UserListItem = ({ handleFunction, user }) => {

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#7b9ac9"
            _hover={{
                background: "#464991",
                color: "white",
            }}
            w="100%"
            d="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;