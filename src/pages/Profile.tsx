import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchUserProfile } from '../store/slices/profileSlice';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
  Container,
  Chip,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Icon icon="mdi:alert-circle-outline" width={48} height={48} color="#f44336" />
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            Error loading profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
          <Button variant="contained" onClick={handleBackToDashboard} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<Icon icon="mdi:arrow-left" />}
          onClick={handleBackToDashboard}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View user information and details
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            // Skeleton Loading
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Skeleton variant="circular" width={120} height={120} sx={{ mx: { xs: 'auto', md: 0 } }} />
                <Skeleton variant="text" width={150} height={32} sx={{ mt: 2, mx: { xs: 'auto', md: 0 } }} />
                <Skeleton variant="text" width={120} height={24} sx={{ mx: { xs: 'auto', md: 0 } }} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Box sx={{ mt: 3 }}>
                  <Skeleton variant="text" height={35} />
                  <Skeleton variant="text" height={25} />
                  <Skeleton variant="text" height={25} />
                </Box>
              </Grid>
            </Grid>
          ) : user ? (
            // Profile Data
            <Grid container spacing={4}>
              {/* Profile Header */}
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: { xs: 'auto', md: 0 },
                    mb: 2,
                  }}
                >
                  <Icon icon="mdi:account" width={60} height={60} color="white" />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {user.name}
                </Typography>
                <Chip
                  label={`@${user.username}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                {/* Contact Information */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon icon="mdi:contact-mail" width={24} style={{ marginRight: 8 }} />
                  Contact Information
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Icon icon="mdi:email-outline" width={20} style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                    </Box>
                    <Typography variant="body1">{user.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Icon icon="mdi:phone" width={20} style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                    </Box>
                    <Typography variant="body1">{user.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Icon icon="mdi:web" width={20} style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">Website</Typography>
                    </Box>
                    <Typography variant="body1">{user.website}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Address */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon icon="mdi:map-marker" width={24} style={{ marginRight: 8 }} />
                  Address
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Street</Typography>
                    <Typography variant="body1">{user.address.street}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Suite</Typography>
                    <Typography variant="body1">{user.address.suite}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">City</Typography>
                    <Typography variant="body1">{user.address.city}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Zipcode</Typography>
                    <Typography variant="body1">{user.address.zipcode}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Company */}
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon icon="mdi:office-building" width={24} style={{ marginRight: 8 }} />
                  Company
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Company Name</Typography>
                    <Typography variant="body1">{user.company.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Catch Phrase</Typography>
                    <Typography variant="body1" fontStyle="italic">"{user.company.catchPhrase}"</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Business</Typography>
                    <Typography variant="body1">{user.company.bs}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            // No Data State
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Icon icon="mdi:account-off" width={48} height={48} color="#9e9e9e" />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                No user data available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;