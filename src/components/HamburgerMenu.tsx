import * as React from 'react';
import { Fab, Menu, MenuItem, MenuProps } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { CsvService } from '@svenstar74/business-logic';
import useApiClient from '../hooks/useApiClient';

//#region Styled Menu
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
//#endregion

function HamburgerMenu() {
  const apiClient = useApiClient();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDownload = async () => {
    setAnchorEl(null);

    const allNodes = await apiClient.getAllClimateConceptNodesAggregated();
    const text = CsvService.aggregatedNodesToCsv(allNodes);

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    link.setAttribute('download', 'graph.csv');

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <Fab
        style={{ background: 'white' }}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MenuIcon />
      </Fab>

      <StyledMenu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleDownload} disableRipple>
          <FileDownloadIcon />
          Download Graph as CSV
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default HamburgerMenu;