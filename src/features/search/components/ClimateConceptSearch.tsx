import { useEffect, useRef, useState } from "react";
import { Box, ClickAwayListener, ListItem, ListItemButton, ListItemText, Paper, TextField } from "@mui/material";
import { VariableSizeList } from "react-window";

import useClimateConceptSearch from "../hooks/useClimateConceptSearch";

interface Props {
  options: { id: string, name: string }[];
  listItemHeight?: number;
  listWidth?: number;
  listHeight?: number;
  onSelect?: (value: { id: string, name: string }) => void;
  onChange?: (value: { id: string, name: string }[]) => void;
}

/** The method for react-window for how to render a row. */
function renderRow(props) {
  const { index, style } = props;
  const { options, handleOptionClick, listItemHeight, highlightedIndex } = props.data;

  return (
    <ListItem style={style} key={index} disablePadding onMouseDown={() => handleOptionClick(options[index])} sx={{ height: listItemHeight }}>
      <ListItemButton selected={index === highlightedIndex} sx={{ height: listItemHeight }}>
        <ListItemText
          primary={options[index].name}
          primaryTypographyProps={{
            style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function ClimateConceptSearch({ options, listItemHeight = 40, listWidth = 450, listHeight = 400, onSelect, onChange }: Props) {
  const { searchClimateConcepts } = useClimateConceptSearch();

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState<{ name: string; id: string }[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleKeyDown = (event) => {
    let newIndex = highlightedIndex;
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent the page from scrolling
      newIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
      setHighlightedIndex(newIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = Math.max(highlightedIndex - 1, 0);
      setHighlightedIndex(newIndex);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selectedOption = filteredOptions[highlightedIndex];
      if (selectedOption) {
        handleOptionClick(selectedOption);
      }

      if (inputRef.current) {
        inputRef.current.blur(); 
      }
    }
  
    // Ensure the new highlighted item is visible in the list
    if (listRef.current && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      listRef.current.scrollToItem(newIndex, 'smart');
    }
  };

  function handleOptionClick(value) {
    if (onSelect) {
      onSelect(value);
    }

    setInputValue(value.name);
    setShowOptions(false);
  }

  // Close the options list when clicking away
  function handleClickAway() {
    setShowOptions(false);
  }

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Filter options whenever the input value changes
  useEffect(() => {
    if (inputValue) {
      const searchResults = searchClimateConcepts(inputValue, options.map(option => option.name));
      const newFilteredOptions = options.filter(option => searchResults.includes(option.name));

      setFilteredOptions(newFilteredOptions);
      setShowOptions(true);

      if (onChange) {
        onChange(newFilteredOptions);
      }
    } else {
      if (onChange) {
        onChange([]);
      }

      setFilteredOptions([]);
      setShowOptions(false);
    }
  }, [inputValue]);

  if (options.length === 0) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        {/* Use react-window to render a virualized list of the search results */}
        {showOptions && (
          <Paper elevation={1} sx={{ maxHeight: listHeight, height: filteredOptions.length * listItemHeight }}>
            <VariableSizeList
              ref={listRef}
              height={listHeight}
              width={listWidth}
              itemSize={() => listItemHeight}
              itemCount={filteredOptions.length}
              itemData={{
                options: filteredOptions,
                handleOptionClick,
                listItemHeight,
                highlightedIndex,
              }}
            >
              {renderRow}
            </VariableSizeList>
          </Paper>
        )}

        {/* The search input for a user */}
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Search ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowOptions(true)}
          sx={{ width: listWidth }}
          autoComplete='off'
          onKeyDown={handleKeyDown}
        />
      </Box>
    </ClickAwayListener>
  );
}

export default ClimateConceptSearch;
