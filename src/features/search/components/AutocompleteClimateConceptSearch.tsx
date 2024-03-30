import { useState, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import { TextField, ListItem, ListItemText, ClickAwayListener, Box, ListItemButton, Paper } from "@mui/material";
import { useSigma } from '@react-sigma/core';

import useApiClient from '../../../components/hooks/useApiClient';
import { useClimateConceptSearch } from '../hooks';

interface Props {
  listItemHeight?: number;
  listWidth?: number;
  listHeight?: number;
  onSelect?: (value: { id: string, name: string }) => void;
  onChange?: (value: { id: string, name: string }[]) => void;
}

/** The method for react-window for how to render a row. */
function renderRow(props) {
  const { index, style } = props;
  const { options, handleOptionClick, listItemHeight } = props.data;

  return (
    <ListItem style={style} key={index} disablePadding onMouseDown={() => handleOptionClick(options[index])} sx={{ height: listItemHeight }}>
      <ListItemButton sx={{ height: listItemHeight }}>
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

function AutocompleteClimateConceptSearch(
  { listItemHeight = 40, listWidth = 450, listHeight = 400, onChange, onSelect }: Props
) {
  const apiClient = useApiClient();
  const sigma = useSigma();
  const { searchClimateConcepts } = useClimateConceptSearch();

  const [allOptions, setAllOptions] = useState<{ name: string; id: string }[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<{ name: string; id: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Fetch all climate concept nodes on component mount
  useEffect(() => {
    apiClient.getAllClimateConceptNodes().then(allNodes => {
      const options = allNodes.map(node => ({ name: node.name, id: node.id }));
      setAllOptions(options);
    });
  }, []);

  function highlightNodes(nodeIds: string[]) {
    sigma.getGraph().forEachNode(node => {
      sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
    });

    nodeIds.forEach(nodeId => {
      sigma.getGraph().setNodeAttribute(nodeId, 'highlighted', true);
    });
  }

  // Filter options whenever the input value changes
  useEffect(() => {
    if (inputValue) {
      const searchResults = searchClimateConcepts(inputValue, allOptions.map(option => option.name));
      const newFilteredOptions = allOptions.filter(option => searchResults.includes(option.name));

      setFilteredOptions(newFilteredOptions);
      setShowOptions(true);

      highlightNodes(newFilteredOptions.map(option => option.id));
      if (onChange) {
        onChange(newFilteredOptions);
      }
    } else {
      highlightNodes([]);
      setShowOptions(false);
    }
  }, [inputValue]);

  function handleOptionClick(value) {
    if (onSelect) {
      onSelect(value);
    }

    setShowOptions(false);
  }

  // Close the options list when clicking away
  function handleClickAway() {
    setShowOptions(false);
  }

  if (allOptions.length === 0) return null;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        {/* Use react-window to render a virualized list of the search results */}
        {showOptions && (
          <Paper elevation={1} sx={{ maxHeight: listHeight, height: filteredOptions.length * listItemHeight }}>
            <VariableSizeList
              height={listHeight}
              width={listWidth}
              itemSize={() => listItemHeight}
              itemCount={filteredOptions.length}
              itemData={{
                options: filteredOptions,
                handleOptionClick,
                listItemHeight,
              }}
            >
              {renderRow}
            </VariableSizeList>
          </Paper>
        )}

        {/* The search input for a user */}
        <TextField
          fullWidth
          placeholder="Search ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowOptions(true)}
          sx={{ width: listWidth }}
          autoComplete='off'
        />
      </Box>
    </ClickAwayListener>
  );
}

export default AutocompleteClimateConceptSearch;
