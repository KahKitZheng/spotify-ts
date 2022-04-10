import React, { useCallback, useEffect } from "react";
import Modal from "react-modal";
import styled, { keyframes } from "styled-components";
import { MEDIA } from "../../styles/media";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAvailableDevices,
  selectDeviceId,
  setPlaybackDevice,
} from "../../slices/playerSlice";
import { MdOutlinePhoneIphone, MdComputer, MdClose } from "react-icons/md";
import { overflowNoScrollbar } from "../../styles/utils";
import PlayerVolume from "../Playerbar/PlayerVolume";

interface Props {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NowPlayingDevicesModal = ({ modal, setModal }: Props) => {
  const dispatch = useAppDispatch();
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

  const deviceId = useAppSelector(selectDeviceId);
  const devices = useAppSelector(selectAvailableDevices);
  const currentDevice = devices.filter((device) => device.id === deviceId);

  const closeModal = useCallback(() => {
    setModal(false);
  }, [setModal]);

  useEffect(() => {
    isDesktop && closeModal();
  }, [closeModal, isDesktop]);

  const handleSetDevice = (index: number) => {
    const deviceId = devices[index].id;

    if (deviceId !== null) {
      dispatch(setPlaybackDevice({ device_ids: [deviceId] }));
    }
  };

  const renderDeviceType = (type: string) => {
    switch (type) {
      case "Smartphone":
        return <MdOutlinePhoneIphone />;
      case "Computer":
        return <MdComputer />;
    }
  };

  return (
    <Modal
      isOpen={modal}
      style={NowPlayingModalStyle}
      onRequestClose={closeModal}
      closeTimeoutMS={500}
    >
      <ModalContentWrapper $isOpen={modal}>
        <div>
          <ModalHeader>
            <div>
              <h2>Current device</h2>
              <CurrentDevice>{currentDevice[0]?.name}</CurrentDevice>
            </div>
            <CloseModal onClick={() => closeModal()}>
              <MdClose />
            </CloseModal>
          </ModalHeader>
          <DeviceList>
            <DeviceListName>Select a device</DeviceListName>
            {devices.map((device, index) => (
              <Device key={device.id} onClick={() => handleSetDevice(index)}>
                <DeviceIcon>{renderDeviceType(device.type)}</DeviceIcon>
                <DeviceName>{device.name}</DeviceName>
              </Device>
            ))}
          </DeviceList>
        </div>
        <PlayerVolume />
      </ModalContentWrapper>
    </Modal>
  );
};

const fadeIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0%);
    opacity: 1;

  }
`;

const fadeOut = keyframes`
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  
  to {
    transform: translateY(100%);
    opacity: 0;

  }
`;

const NowPlayingModalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    inset: "auto",
    backgroundColor: "#18191d",
    border: "0",
    height: "100vh",
    width: "100vw",
    display: "flex",
    padding: "0",
    overflow: "hidden",
    flexDirection: "column" as const,
  },
};

const ModalContentWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 32px;
  height: 100%;
  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.5s
    cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CurrentDevice = styled.p`
  color: ${({ theme }) => theme.colors.spotify};
  font-weight: 600;
`;

const CloseModal = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0;
  cursor: pointer;
  font-size: 28px;
  ${overflowNoScrollbar};

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const DeviceList = styled.div`
  margin-top: 32px;
`;

const DeviceListName = styled.h4`
  margin-bottom: 8px;
`;

const Device = styled.div`
  display: flex;
  align-items: center;
  margin: 0 -16px;
  padding: 16px;
  border-radius: 8px;

  :hover,
  :focus {
    background-color: #26282e;
  }
`;

const DeviceIcon = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 28px;
`;

const DeviceName = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  margin-left: 16px;
`;

export default NowPlayingDevicesModal;
