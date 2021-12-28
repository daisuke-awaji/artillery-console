import React from 'react';
import { IoGlobeOutline, IoLogoGithub, IoTransgenderOutline } from 'react-icons/io5';

interface ToolbarProps {}

export const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  return (
    <div>
      <div className="px-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-block text-xl text-pink-500 font-normal italic tracking-wide -ml-1 transform translate-y-0.5">
                Artillery Viewer
              </span>
              <span className="inline-block text-xs text-teal-500 font-normal tracking-wide ml-0.5 transform translate-y-0.5"></span>
            </div>
            <div className="text-pink-500 p-2">
              <IoTransgenderOutline size={24} />
            </div>
          </div>
          <ul className="flex items-center text-pink-500">
            <li className="text-xl opacity-75 hover:opacity-100">
              <a
                href="https://www.artillery.io/docs/guides/guides/test-script-reference"
                title="Artillery Website"
                target="_blank"
                rel="noreferrer"
              >
                <IoGlobeOutline />
              </a>
            </li>
            <li className="text-xl ml-2 opacity-75 hover:opacity-100">
              <a
                href="https://github.com/artilleryio/artillery"
                title="Artillery Github Repository"
                target="_blank"
                rel="noreferrer"
              >
                <IoLogoGithub />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
