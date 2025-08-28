
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { IoSettingsSharp } from "react-icons/io5";

// import "../App.module.css";

import {
  alpha, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip,
  FormControlLabel, Switch, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import "./Products.scss";
import InputAdornment from '@mui/material/InputAdornment';

const Products = () => {
  // Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Initial dummy data for reference
  // Sample product data for reference
  const dummyProducts = [
    { id: 1, name: "Laptop", color: "Red", price: 1000, brand: "BrandA", quantity: 10, category: "Electronics", inStock: true },
    { id: 2, name: "Phone", color: "Blue", price: 500, brand: "BrandB", quantity: 5, category: "Electronics", inStock: true },
    { id: 3, name: "Tablet", color: "Black", price: 300, brand: "BrandC", quantity: 20, category: "Electronics", inStock: true },
    { id: 4, name: "Headphones", color: "White", price: 150, brand: "BrandD", quantity: 30, category: "Accessories", inStock: true },
    { id: 5, name: "Smartwatch", color: "Silver", price: 200, brand: "BrandE", quantity: 15, category: "Wearables", inStock: true },
    { id: 6, name: "Keyboard", color: "Black", price: 50, brand: "BrandF", quantity: 50, category: "Accessories", inStock: true },
    { id: 7, name: "Mouse", color: "Gray", price: 25, brand: "BrandG", quantity: 60, category: "Accessories", inStock: true },
    { id: 8, name: "Monitor", color: "Black", price: 200, brand: "BrandH", quantity: 25, category: "Electronics", inStock: false },
    { id: 9, name: "Charger", color: "White", price: 20, brand: "BrandI", quantity: 100, category: "Accessories", inStock: true },
    { id: 10, name: "Camera", color: "Red", price: 500, brand: "BrandJ", quantity: 8, category: "Electronics", inStock: true },
    { id: 11, name: "Printer", color: "Black", price: 150, brand: "BrandK", quantity: 12, category: "Electronics", inStock: true },
    { id: 12, name: "Laptop Bag", color: "Gray", price: 40, brand: "BrandL", quantity: 40, category: "Accessories", inStock: true },
    { id: 13, name: "External Hard Drive", color: "Black", price: 100, brand: "BrandM", quantity: 22, category: "Storage", inStock: true },
    { id: 14, name: "USB Cable", color: "White", price: 10, brand: "BrandN", quantity: 70, category: "Accessories", inStock: true },
    { id: 15, name: "Webcam", color: "Black", price: 40, brand: "BrandT", quantity: 30, category: "Electronics", inStock: false }
  ];

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    pname: "",
    colour: "",
    price: "",
    brand: "",
    quantity: "",
    category: "",
    description: "",
    imageUrl: ""
  });

  const [openAddModal, setOpenAddModal] = useState(false);

  // Sorting and Pagination States
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewProduct({
      pname: "",
      colour: "",
      price: "",
      brand: "",
      quantity: "",
      category: "",
      description: "",
      imageUrl: ""
    });
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/products/${productId}`, updatedData);
      await fetchProducts(); // Refresh the products list
    } catch (err) {
      setError('Error updating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/products/${selectedProduct.pid}`, selectedProduct);
      await fetchProducts();
      handleCloseEditModal();
    } catch (err) {
      setError('Error updating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/products', newProduct);
      await fetchProducts(); // Refresh the products list
      handleCloseAddModal();
    } catch (err) {
      setError('Error adding product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      await fetchProducts(); // Refresh the products list
    } catch (err) {
      setError('Error deleting product: ' + err.message);
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
    { id: "pname", numeric: false, label: "Product Name" },
    { id: "colour", numeric: false, label: "Color" },
    { id: "price", numeric: true, label: "Price ($)" },
    { id: "brand", numeric: false, label: "Brand" },
    { id: "quantity", numeric: true, label: "Quantity" },
    { id: "category", numeric: false, label: "Category" },
    { id: "inStock", numeric: false, label: "In Stock" },
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
    <div className="products-container">
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
      <div className="products">
        <header>
          <IoSettingsSharp />
        </header>

        <Navbar />

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
          Add New Product
        </Button>
      </Box>

      
      
      
      {/* Add Product Dialog ----------------------------------------------------------- */}
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
    Add New Product
  </DialogTitle>
  
  <DialogContent className="add-product-form" sx={{ padding: '24px' }}>
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TextField
        required
        fullWidth
        variant="outlined"
        label="Product Name"
        name="name"
        value={newProduct.name}
        onChange={handleInputChange}
        error={!newProduct.name}
        helperText={!newProduct.name ? "Required field" : ""}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: '1px',
            }
          }
        }}
      />
      
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Color"
          name="color"
          value={newProduct.color}
          onChange={handleInputChange}
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
          label="Price ($)"
          name="price"
          type="number"
          value={newProduct.price}
          onChange={handleInputChange}
          error={!newProduct.price}
          helperText={!newProduct.price ? "Required field" : ""}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        label="Brand"
        name="brand"
        value={newProduct.brand}
        onChange={handleInputChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}
      />
      
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <TextField
          required
          fullWidth
          variant="outlined"
          label="Quantity"
          name="quantity"
          type="number"
          value={newProduct.quantity}
          onChange={handleInputChange}
          error={!newProduct.quantity}
          helperText={!newProduct.quantity ? "Required field" : ""}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
        
        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newProduct.category}
            label="Category"
            onChange={handleInputChange}
            variant="outlined"
          >
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
            <MenuItem value="Wearables">Wearables</MenuItem>
            <MenuItem value="Storage">Storage</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <FormControlLabel
        className="in-stock-switch"
        control={
          <Switch
            name="inStock"
            checked={newProduct.inStock}
            onChange={handleInputChange}
            color="primary"
            sx={{
              padding: '8px',
              '& .MuiSwitch-track': {
                backgroundColor: '#dadce0',
                opacity: 1,
                borderRadius: '10px',
              },
              '& .MuiSwitch-thumb': {
                color: '#ffffff',
              },
              '&.Mui-checked': {
                '& .MuiSwitch-track': {
                  backgroundColor: 'rgba(25, 118, 210, 0.5)',
                }
              }
            }}
          />
        }
        label="In Stock"
        labelPlacement="start"
        sx={{ 
          justifyContent: 'space-between',
          marginLeft: 0,
          marginRight: 0,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
            color: '#5f6368',
          }
        }}
      />
    </Box>
  </DialogContent>
  
  <DialogActions className="modal-actions" sx={{ 
    padding: '16px 24px',
    borderTop: '1px solid #e0e0e0',
    '& .MuiButton-root': {
      minWidth: '100px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      textTransform: 'none',
      borderRadius: '6px',
      padding: '8px 20px',
      transition: 'all 0.2s ease',
    }
  }}>
    <Button 
      className="cancel-btn"
      onClick={handleCloseAddModal}
      variant="outlined"
      sx={{ 
        border: '1px solid #dadce0',
        color: '#3c4043',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderColor: 'rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      Cancel
    </Button>
    <Button 
      className="submit-btn"
      onClick={handleAddProductSubmit} 
      variant="contained"
      disabled={!newProduct.name || !newProduct.price || !newProduct.quantity}
      sx={{ 
        backgroundColor: '#1976d2',
        color: 'white',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#1565c0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '&:disabled': {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.26)',
        }
      }}
    >
      Add Product
    </Button>
  </DialogActions>
</Dialog>

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
            <Typography sx={{ flex: "1 1 100%" }} variant="h6">
              Product Table
            </Typography>
          </Toolbar>

          <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
            <Table sx={{ minWidth: 750 }} size="medium">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={() => {}}
                onRequestSort={handleRequestSort}
                rowCount={products.length}
              />
              <TableBody>
                {stableSort(products, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" />
                      </TableCell>
                      <TableCell>{row.pname}</TableCell>
                      <TableCell>{row.colour}</TableCell>
                      <TableCell align="right">${row.price}</TableCell>
                      <TableCell>{row.brand}</TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.quantity > 0 ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditClick(row)}
                          color="primary"
                          sx={{ margin: 0, padding: '4px' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteProduct(row.pid)}
                          color="error"
                          sx={{ margin: 0, padding: '4px' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />
        </Paper>
      </Box>

      {/* Add Product Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="pname"
            label="Product Name"
            type="text"
            fullWidth
            value={newProduct.pname}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="colour"
            label="Color"
            type="text"
            fullWidth
            value={newProduct.colour}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="brand"
            label="Brand"
            type="text"
            fullWidth
            value={newProduct.brand}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={newProduct.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={newProduct.category}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            multiline
            rows={3}
            fullWidth
            value={newProduct.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="imageUrl"
            label="Image URL"
            type="text"
            fullWidth
            value={newProduct.imageUrl}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
          <Button onClick={handleAddProductSubmit} variant="contained" color="primary">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            value={selectedProduct?.pname || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, pname: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Color"
            type="text"
            fullWidth
            value={selectedProduct?.colour || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, colour: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={selectedProduct?.price || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="Brand"
            type="text"
            fullWidth
            value={selectedProduct?.brand || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, brand: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={selectedProduct?.quantity || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, quantity: parseInt(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="Category"
            type="text"
            fullWidth
            value={selectedProduct?.category || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            multiline
            rows={3}
            fullWidth
            value={selectedProduct?.description || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Image URL"
            type="text"
            fullWidth
            value={selectedProduct?.imageUrl || ''}
            onChange={(e) => setSelectedProduct({...selectedProduct, imageUrl: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
};

export default Products;