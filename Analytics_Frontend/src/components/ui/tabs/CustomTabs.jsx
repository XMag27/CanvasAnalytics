import React, { useState, Suspense } from "react";
import { Tabs } from "@instructure/ui-tabs";
import LoadingSpinner from "../LoadingSpinner";
import "./CustomTabs.css";

export default function CustomTabs({ tabsConfig }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, { index }) => {
    setActiveTab(index);
  };

  const tabClass =
    "text-gray-700 border-b-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500";

  console.log(activeTab);
  return (
    <div className="p-6">
      <Tabs
        onRequestTabChange={handleTabChange}
        selectedIndex={activeTab}
        variant="default"
        className="w-full border-b border-gray-300"
        fixHeight="100%"
      >
        {tabsConfig.map((tab, index) => (
          <Tabs.Panel
            className="w-full grow"
            key={tab.id}
            id={`tab-${tab.id}`}
            isSelected={activeTab === index}
            renderTitle={<span className="text-3xl grow">{tab.title}</span>}
          >
            <Suspense fallback={<LoadingSpinner />}>
              {/* {React.createElement(React.lazy(tab.content))} */}

              {React.createElement(tab.content)}
            </Suspense>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
