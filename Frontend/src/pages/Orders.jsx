import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { IoSettingsSharp } from "react-icons/io5";

import "../App.module.css";

import {
  alpha, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip,
  FormControlLabel, Switch, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { visuallyHidden } from "@mui/utils";
import "../pages/Products.scss";
import InputAdornment from '@mui/material/InputAdornment';

const Orders = () => {
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [newOrder, setNewOrder] = useState({
    customerName: "",
    orderDate: "",
    totalAmount: "",
    status: "",
  });

  const [openAddModal, setOpenAddModal] = useState(false);

  // Sorting and Pagination States
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderDate");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value,
    });
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewOrder({
      customerName: "",
      orderDate: "",
      totalAmount: "",
      status: "",
    });
  };

  const handleAddOrderSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/orders', newOrder);
      await fetchOrders();
      handleCloseAddModal();
    } catch (err) {
      setError('Error adding order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      await fetchOrders();
    } catch (err) {
      setError('Error deleting order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const headCells = [
    { id: "orderDate", numeric: false, label: "Order Date" },
    { id: "customerName", numeric: false, label: "Customer Name" },
    { id: "totalAmount", numeric: true, label: "Total Amount ($)" },
    { id: "status", numeric: false, label: "Status" },
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"}>
              <TableSortLabel active={orderBy === headCell.id} direction={order} onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  return (
    <div className="orders">

      {/* Error message */}
      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{ padding: '10px', margin: '10px 0' }}>
          Loading...
        </div>
      )}

      {/* Header and Navbar */}
      <header>
        <IoSettingsSharp />
      </header>

      <Navbar />

      {/* Button styling */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '20px', 
        marginBottom: '20px' 
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{
            fontSize: '1rem',
            padding: '10px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }}
        >
          Add New Order
        </Button>
      </Box>

      {/* Add Order Dialog */}
      <Dialog 
        open={openAddModal} 
        onClose={handleCloseAddModal} 
        fullWidth 
        maxWidth="sm"
        sx={{
          '& .MuiDialog-container': {
            backdropFilter: 'blur(2px)',
          },
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: (theme) => theme.palette.primary.main,
          color: '#fff',
          padding: '16px 24px',
          fontWeight: '600'
        }}>
          Add New Order
        </DialogTitle>
        
        <DialogContent className="add-order-form" sx={{ padding: '24px' }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Customer Name"
              name="customerName"
              value={newOrder.customerName}
              onChange={handleInputChange}
              error={!newOrder.customerName}
              helperText={!newOrder.customerName ? "Required field" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Order Date"
              name="orderDate"
              type="date"
              value={newOrder.orderDate}
              onChange={handleInputChange}
              error={!newOrder.orderDate}
              helperText={!newOrder.orderDate ? "Required field" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              required
              fullWidth
              variant="outlined"
              label="Total Amount ($)"
              name="totalAmount"
              type="number"
              value={newOrder.totalAmount}
              onChange={handleInputChange}
              error={!newOrder.totalAmount}
              helperText={!newOrder.totalAmount ? "Required field" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />

            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newOrder.status}
                label="Status"
                onChange={handleInputChange}
                name="status"
                displayEmpty
              >
                <MenuItem value="" disabled>Select Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
          <Button 
            onClick={handleAddOrderSubmit} 
            variant="contained" 
            color="primary"
            disabled={!newOrder.customerName || !newOrder.orderDate || !newOrder.totalAmount || !newOrder.status}
            sx={{
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              '&:disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              }
            }}
          >
            Add Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Orders Table */}
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
       
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
              Orders Table
            </Typography>
          </Toolbar>

          <TableContainer sx={{ maxHeight: 440, overflow: 'auto' }}>
            <Table sx={{ minWidth: 750 }} size="medium" stickyHeader aria-label="orders table">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={(event) => {
                  setSelected(event.target.checked ? orders.map((order) => order.id) : []);
                }}
                onRequestSort={handleRequestSort}
                rowCount={orders.length}
              />
              <TableBody>
                {stableSort(orders, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    const isItemSelected = selected.indexOf(order.id) !== -1;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={order.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => {
                              const selectedIndex = selected.indexOf(order.id);
                              let newSelected = [];

                              if (selectedIndex === -1) {
                                newSelected = newSelected.concat(selected, order.id);
                              } else if (selectedIndex === 0) {
                                newSelected = newSelected.concat(selected.slice(1));
                              } else if (selectedIndex === selected.length - 1) {
                                newSelected = newSelected.concat(selected.slice(0, -1));
                              } else if (selectedIndex > 0) {
                                newSelected = newSelected.concat(
                                  selected.slice(0, selectedIndex),
                                  selected.slice(selectedIndex + 1),
                                );
                              }
                              setSelected(newSelected);
                            }}
                          />
                        </TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell align="right">${order.totalAmount}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default Orders;