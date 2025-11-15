import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  fetchComments,
  setPage,
  setPageSize,
  setSearch,
  setSort,
  applyFilters
} from '../store/slices/dashboardSlice';
import {
  Grid,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,

  Typography,
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Chip,
  Container,
} from '@mui/material';
import { Icon } from '@iconify/react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    comments,
    filteredComments,
    loading,
    error,
    pagination,
    search,
    sort
  } = useAppSelector((state) => state.dashboard);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [comments, search, sort, pagination.pageSize]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localSearch, dispatch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  const handlePageSizeChange = (event: any) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  const handleSort = (field: 'postId' | 'name' | 'email') => {
    dispatch(setSort({ field }));
  };

  const getSortIcon = (field: 'postId' | 'name' | 'email') => {
    if (sort.field !== field) return 'mdi:unfold-more-horizontal';
    return sort.direction === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending';
  };

  const getCurrentPageData = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredComments.slice(startIndex, endIndex);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Icon icon="mdi:alert-circle-outline" width={48} height={48} color="#f44336" />
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            Error loading comments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Comments Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all comments
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
          <Chip
            icon={<Icon icon="mdi:comment-multiple" />}
            label={`${filteredComments.length} comments`}
            variant="outlined"
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by name, email, or content..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            InputProps={{
              startAdornment: <Icon icon="mdi:magnify" width={20} style={{ marginRight: 8 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={pagination.pageSize}
                  label="Page Size"
                  onChange={handlePageSizeChange}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Table */}
      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('postId')}>
                    Post ID
                    <Icon icon={getSortIcon('postId')} width={20} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Name
                    <Icon icon={getSortIcon('name')} width={20} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                    Email
                    <Icon icon={getSortIcon('email')} width={20} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell>Content</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Skeleton Loading
                Array.from(new Array(pagination.pageSize)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                  </TableRow>
                ))
              ) : getCurrentPageData().length === 0 ? (
                // No Data State
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Icon icon="mdi:database-off" width={48} height={48} color="#9e9e9e" />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                      No comments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Try adjusting your search criteria' : 'No comments available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // Data Rows
                getCurrentPageData().map((comment) => (
                  <TableRow key={comment.id} hover>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {comment.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Icon icon="mdi:email-outline" width={16} style={{ marginRight: 8 }} />
                        {comment.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {comment.body}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && filteredComments.length > 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, filteredComments.length)} of{' '}
              {filteredComments.length} entries
            </Typography>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default Dashboard;