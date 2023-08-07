import React, { Dispatch, Fragment, SetStateAction } from "react";
import styled from "styled-components";
import * as Tabs from "@/styles/components/tabs";
import { resultsTabs } from "./SearchPage";

interface Props {
  tabs: string[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<resultsTabs>>;
}

const SearchTabs = (props: Props) => {
  const { tabs, activeTab, setActiveTab } = props;

  return (
    <TabHeader>
      {tabs.map((tab) => (
        <Fragment key={tab}>
          <Tab
            $isActive={activeTab === tab}
            onClick={() => setActiveTab(tab as resultsTabs)}
          >
            {tab}
          </Tab>
        </Fragment>
      ))}
    </TabHeader>
  );
};

const TabHeader = styled(Tabs.TabHeader)`
  margin-top: -32px;
  justify-content: flex-start;
`;

const Tab = styled(Tabs.Tab)`
  text-transform: capitalize;
`;

export default SearchTabs;
