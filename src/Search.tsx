import { Autocomplete } from "@mantine/core";
import { useRef, useState } from "react";

const Search = (props: { handleEnterUsername: (username: string) => void }) => {
  return (
    <Autocomplete
      placeholder="Mahjong Soul Username"
      data={["dingm8", "danielq987", "matttang27"]}
      onOptionSubmit={(username) => {
        props.handleEnterUsername(username);
      }}
      // Clears the input field on option submit
      key={Math.random()}
    />
  );
};

export default Search;
