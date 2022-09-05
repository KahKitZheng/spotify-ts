import React, { useState } from "react";
import styled from "styled-components";
import { ButtonIcon } from "./Playerbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAvailableDevices,
  selectDeviceId,
  setPlaybackDevice,
} from "../../slices/playerSlice";
import { Popover, ArrowContainer } from "react-tiny-popover";
import { MdComputer, MdOutlinePhoneIphone } from "react-icons/md";
import { BiDevices } from "react-icons/bi";
import { overflowNoScrollbar } from "../../styles/utils";

const PlayerDevices = () => {
  const dispatch = useAppDispatch();
  const currentDevice = useAppSelector(selectDeviceId);
  const devices = useAppSelector(selectAvailableDevices);
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

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
    <Popover
      isOpen={visible}
      positions={["top", "left"]}
      padding={10}
      reposition={false}
      onClickOutside={hide}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={"#262a35"}
          arrowSize={10}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <DeviceList>
            <DeviceListName>Connect to a device</DeviceListName>
            {devices.map((device, index) => (
              <Device key={device.id} onClick={() => handleSetDevice(index)}>
                <DeviceIcon $active={currentDevice === device.id}>
                  {renderDeviceType(device.type)}
                </DeviceIcon>
                <DeviceInfo>
                  <DeviceName $active={currentDevice === device.id}>
                    {device.name}
                  </DeviceName>
                  <DeviceType $active={currentDevice === device.id}>
                    {device.type}
                  </DeviceType>
                </DeviceInfo>
              </Device>
            ))}
          </DeviceList>
        </ArrowContainer>
      )}
    >
      <ButtonIcon onClick={visible ? hide : show}>
        <BiDevices />
      </ButtonIcon>
    </Popover>
  );
};

const DeviceList = styled.div`
  background-color: #262a35;
  color: currentColor;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  list-style: none;
  /* height: 25rem; */
  max-height: 88vh;
  ${overflowNoScrollbar};
`;

const DeviceListName = styled.h3`
  padding: 16px 16px 8px;
`;

const Device = styled.button`
  background-color: transparent;
  border: 0;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  cursor: pointer;

  :hover {
    background-color: #20222c;
  }
`;

const DeviceIcon = styled.div<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.spotify : theme.colors.white};
  font-size: 28px;
`;

const DeviceInfo = styled.div`
  margin-left: 16px;
`;

const DeviceName = styled.p<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.spotify : theme.colors.white};
  font-size: 14px;
  font-weight: 600;
`;

const DeviceType = styled.small<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.spotify : theme.colors.white};
`;

export default PlayerDevices;
