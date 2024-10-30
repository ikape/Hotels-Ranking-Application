import React from 'react';
import Link from 'next/link';
import { Button, Typography, Box, Divider, Paper, Container } from '@mui/material';

const Home: React.FC = () => {
    return (
        <Container maxWidth="sm" sx={{ marginTop: 8 }}>
            <Paper elevation={3} sx={{ padding: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Hotels Ranking
                </Typography>
                <Typography variant="body1" paragraph>
                    Easily manage your list of hotels, add new hotels, and categorize them by star ratings or custom categories.
                    Use the links below to get started!
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginY: 2 }}>
                    <Link href="/hotels" passHref>
                        <Button variant="contained" color="primary">
                            Manage Hotels
                        </Button>
                    </Link>
                    <Link href="/categories" passHref>
                        <Button variant="contained" color="secondary">
                            Manage Categories
                        </Button>
                    </Link>
                </Box>

                <Divider sx={{ marginY: 3 }} />
            </Paper>
        </Container>
    );
};

export default Home;
