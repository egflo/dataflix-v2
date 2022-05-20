import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navigation  from './Navbar';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',

    [theme.breakpoints.down('sm')]: {
        paddingTop: 0,
    },
    [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
        paddingTop: 40,
    }
}));

export const DashboardLayout = (props) => {
    const { children } = props;
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Navigation onSidebarOpen={() => setSidebarOpen(false)} />

            <DashboardLayoutRoot>
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                        width: '100%'
                    }}
                >
                    {children}
                </Box>
            </DashboardLayoutRoot>
        </>
    );
};
