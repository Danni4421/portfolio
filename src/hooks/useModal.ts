import { useState } from "react";

export const useModal = (targetModal: string = "main_modal") => {
  const openModal = () => {
    const modal = document.getElementById(targetModal) as HTMLDialogElement;
    modal.showModal();
  };

  return { openModal };
};

interface ModalContent {}
