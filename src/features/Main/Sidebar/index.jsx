import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import {
  Sidebar as SidebarBase,
  MenuSection,
  MenuItem,
  SIDEBAR_HELP_ITEMS,
  getUserRoles,
  USER_ROLES,
} from 'react-paragon-topaz';

import { updateActiveTab } from 'features/Main/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';

import './index.scss';

const baseItems = [
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
  const roles = getUserRoles();
  const activeTab = useSelector((state) => state.main.activeTab);
  const menuItems = [...baseItems];
  const instructorPortalPath = getConfig().INSTRUCTOR_PORTAL_PATH || '';

  if (roles.includes(USER_ROLES.INSTRUCTOR) && instructorPortalPath.length > 0) {
    menuItems.push({
      link: 'instructor-portal',
      as: 'a',
      href: instructorPortalPath,
      label: 'Instructor Portal',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: <i className="fa-regular fa-person-chalkboard" />,
    });
  }

  const handleTabClick = (tabName) => {
    dispatch(updateActiveTab(tabName));
    history.push(`/${tabName}`);
  };

  const addQueryParam = useInstitutionIdQueryParam();
  const currentSelection = activeTab.replace(/\?institutionId=\d+/, '');

  return (
    <SidebarBase>
      <MenuSection>
        {
          menuItems.map(({
            link, label, icon, as, href, target, rel,
          }) => {
            if (as === 'a') {
              return (
                <MenuItem
                  key={link}
                  title={label}
                  as={as}
                  href={href}
                  icon={icon}
                  target={target}
                  rel={rel}
                />
              );
            }

            return (
              <MenuItem
                key={link}
                title={label}
                path={addQueryParam(link)}
                active={currentSelection === link}
                onClick={handleTabClick}
                icon={icon}
              />
            );
          })
        }
      </MenuSection>
      <MenuSection title="Help and support">
        {
          SIDEBAR_HELP_ITEMS.map(({
            link,
            label,
            ...rest
          }) => (
            <MenuItem
              key={link}
              title={label}
              as="a"
              href={link}
              {...rest}
            />
          ))
        }
      </MenuSection>
    </SidebarBase>
  );
};
