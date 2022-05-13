import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import SuggestedUsers from './SuggestedUsers';

function InputField({ allUsers }) {
  const [searchingUsername, setSearchingUsername] = useState('');

  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const filteringUser = username => {
    console.log(username);
  };

  //   console.log(searchingUsername);
  const handleSeachInputChange = evt => {
    setSearchingUsername(evt.target.value.trim());
    filteringUser(evt.target.value.trim());
  };

  useEffect(() => {
    setSuggestedUsers(allUsers);
  }, [allUsers]);

  return (
    <div className={`xs:w-3/6 w-[25rem] mr-3 lg:mr-0`}>
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
      <div className={`rounded xs:w-[47%] w-[25rem] absolute top-13 bg-white `}>
        {suggestedUsers.length > 0 &&
          suggestedUsers.map(userInfo => (
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
