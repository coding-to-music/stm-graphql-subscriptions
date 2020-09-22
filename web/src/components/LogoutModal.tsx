import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/core";
import { useLogoutMutation } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";

interface LogoutModalProps {
  defaultColor: string;
  label: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ defaultColor, label }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return (
    <>
      <Button onClick={onOpen} variantColor={defaultColor} variant="ghost">
        {label}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xs"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>Do you want to logout?</ModalBody>

          <ModalFooter>
            <Button
              variantColor={defaultColor}
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
                await onClose();
              }}
              isLoading={logoutFetching}
            >
              Logout
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LogoutModal;
