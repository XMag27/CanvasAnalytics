import React from "react";
import NoDataContent from "@components/ui/messages/NoDataContent";

const DynamicList = ({ data, extraColumnTitle, renderExtraContent }) => {
  if (!data || data.length === 0) {
    return <NoDataContent />;
  }

  const keys = Object.keys(data[0]);

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  {keys.map((key) => (
                    <th
                      scope="col"
                      key={key}
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                    >
                      {key}
                    </th>
                  ))}
                  {extraColumnTitle && (
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                      {extraColumnTitle}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {data.map((item, index) => (
                  <tr key={index}>
                    {keys.map((key) => (
                      <td
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200"
                      >
                        {Array.isArray(item[key])
                          ? item[key].join(", ")
                          : item[key]}
                      </td>
                    ))}
                    {renderExtraContent && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {renderExtraContent(item)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicList;
