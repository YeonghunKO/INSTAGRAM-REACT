import PropTypes from 'prop-types';
import { useState, useContext } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import SuggestedUsers from './SuggestedUsers';

import PostPhotosContext from '../../context/postPhotos';

import originalPhotosContext from '../../context/originalPost';

function InputField({ allUsers }) {
  const [searchingUsername, setSearchingUsername] = useState('');

  const { setPostPhotos } = useContext(PostPhotosContext);

  const { orginalPhotos } = useContext(originalPhotosContext);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  console.log('inputfield rendering');
  const [cursorPos, setCursorPos] = useState(-1);
  const filteringUser = username => {
    const filteredSuggestedUsers = allUsers.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );
    setSuggestedUsers(filteredSuggestedUsers);
  };

  const handleSeachInputChange = ({ target }) => {
    const inputValue = target.value.trim();
    setSearchingUsername(inputValue);
    if (inputValue.length) {
      filteringUser(inputValue);
    } else {
      setSuggestedUsers([]);
      setCursorPos(-1);
    }
  };

  const filterPostbyUserId = (
    selectedUserId = suggestedUsers[cursorPos].userId
  ) => {
    const filteredPost = orginalPhotos.filter(
      photo => photo.userId === selectedUserId
    );
    setSuggestedUsers([]);
    setCursorPos(-1);
    setSearchingUsername('');
    setPostPhotos(filteredPost);
  };

  const handelSuggestedUserContainer = async ({ key }) => {
    switch (key) {
      case 'ArrowUp':
        setCursorPos(prevCurPos =>
          prevCurPos === 0 ? suggestedUsers.length - 1 : prevCurPos - 1
        );
        break;
      case 'ArrowDown':
        setCursorPos(prevCurPos =>
          prevCurPos === suggestedUsers.length - 1 ? 0 : prevCurPos + 1
        );
        break;
      case 'Enter':
        filterPostbyUserId();

        break;
      default:
        break;
    }
  };

  return (
    <div
      onKeyUp={handelSuggestedUserContainer}
      className={`xs:w-3/6 w-[25rem] mr-3 lg:mr-0`}
    >
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
          suggestedUsers.map((userInfo, index) => (
            <SuggestedUsers
              key={userInfo.userId}
              {...userInfo}
              userPos={index}
              cursorPos={cursorPos}
              filterPostbyUserId={filterPostbyUserId}
            />
          ))}
      </div>
    </div>
  );
}

export default InputField;

InputField.propTypes = {
  allUsers: PropTypes.array,
};
