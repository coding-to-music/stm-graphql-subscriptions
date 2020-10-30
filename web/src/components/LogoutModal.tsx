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
import LogoutButton from './LogoutButton'

interface LogoutModalProps {
  defaultColor: string;
  label: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ defaultColor, label }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <LogoutButton onClose={onClose} defaultColor={defaultColor} />
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
