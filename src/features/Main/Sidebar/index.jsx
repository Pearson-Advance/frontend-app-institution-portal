import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Sidebar as SidebarBase, MenuSection, MenuItem } from 'react-paragon-topaz';

import { updateActiveTab } from 'features/Main/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';

import './index.scss';

const menuItems = [
  {
    link: 'dashboard',
    label: 'Home',
    icon: <i className="fa-regular fa-house" />,
  },
  {
    link: 'licenses',
    label: 'License inventory',
    icon: <i className="fa-regular fa-list-check" />,
  },
  {
    link: 'instructors',
    label: 'Instructors',
    icon: <i className="fa-regular fa-chalkboard-user" />,
  },
  {
    link: 'students',
    label: 'Students',
    icon: <i className="fa-regular fa-screen-users" />,
  },
  {
    link: 'courses',
    label: 'Courses',
    icon: <i className="fa-regular fa-bars-sort" />,
  },
  {
    link: 'classes',
    label: 'Classes',
    icon: <i className="fa-regular fa-books" />,
  },
];

export const Sidebar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.main.activeTab);

  const handleTabClick = (tabName) => {
    dispatch(updateActiveTab(tabName));
    history.push(`/${tabName}`);
  };

  const addQueryParam = useInstitutionIdQueryParam();

  return (
    <SidebarBase>
      <MenuSection>
        {
          menuItems.map(({ link, label, icon }) => (
            <MenuItem
              key={link}
              title={label}
              path={addQueryParam(link)}
              active={activeTab === link}
              onClick={handleTabClick}
              icon={icon}
            />
          ))
        }
      </MenuSection>
    </SidebarBase>
  );
};
