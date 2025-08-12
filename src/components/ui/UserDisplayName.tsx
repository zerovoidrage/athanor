import React from 'react';
import { getUserDisplayNameStyles } from '@/styles/userDisplayName';

interface UserDisplayNameProps {
  displayName: string;
}

const UserDisplayName: React.FC<UserDisplayNameProps> = ({ displayName }) => {
  if (!displayName) return null;

  const styles = getUserDisplayNameStyles();

  return (
    <div className={styles.className} style={styles.inlineStyle}>
      {displayName}
    </div>
  );
};

export default UserDisplayName;
