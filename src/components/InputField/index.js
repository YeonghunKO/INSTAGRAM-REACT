import PropTypes from 'prop-types';
import { useState } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import SuggestedUsers from './SuggestedUsers';

function InputField({ allUsers }) {
  const [searchingUsername, setSearchingUsername] = useState('');

  const [suggestedUsers, setSuggestedUsers] = useState(allUsers);

  const handleSeachInputChange = evt => {
    setSearchingUsername(evt.target.value.trim());
  };

  return (
    <div className="xs:w-3/6 lg:w-2/6 mr-3 lg:mr-0">
      <OutlinedInput
        autoComplete="off"
        className="h-10 xs:h-8"
        placeholder="search user here"
        id="description"
        color="primary"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleSeachInputChange}
        value={searchingUsername}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
      />
      <div className="rounded absolute top-13 bg-white xs:w-3/6">
        {allUsers.length > 0 &&
          allUsers.map(userInfo => (
            <SuggestedUsers key={userInfo.userId} {...userInfo} />
          ))}
      </div>
    </div>
  );
}

export default InputField;

InputField.propTypes = {
  allUsers: PropTypes.array,
};
