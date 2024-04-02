import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Pagination } from '@mui/lab';
import axios from 'axios';

const API_URL = 'https://api.stackexchange.com/2.3/tags';

function App() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setLoading(true);
    axios.get(API_URL, {
      params: {
        page,
        pagesize: pageSize,
        order: sortOrder,
        sort: sortField,
        site: 'stackoverflow'
      }
    })
      .then(response => {
        setTags(response.data.items);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [page, pageSize, sortField, sortOrder]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    const [field, order] = event.target.value.split('_');
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="pagesize-label">Items per page</InputLabel>
        <Select
          labelId="pagesize-label"
          id="pagesize-select"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          id="sort-select"
          value={`${sortField}_${sortOrder}`}
          onChange={handleSortChange}
        >
          <MenuItem value="name_asc">Name (Ascending)</MenuItem>
          <MenuItem value="name_desc">Name (Descending)</MenuItem>
          <MenuItem value="count_asc">Count (Ascending)</MenuItem>
          <MenuItem value="count_desc">Count (Descending)</MenuItem>
        </Select>
      </FormControl>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map(tag => (
                <TableRow key={tag.name}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination count={10} page={page} onChange={handlePageChange} />
    </div>
  );
}

export default App;
