import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/ToastNotification";

const AdminMealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mealPlanData, setMealPlanData] = useState({
    name: "",
    description: "",
    price: "",
    meals: [],
    deliveryDays: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/plans`);
      setMealPlans(res.data);
    } catch (error) {
      showErrorToast("Error fetching meal plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!mealPlanData.name || !mealPlanData.description || !mealPlanData.price) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editMode) {
        await axios.put(
          `${API_URL}/api/plans/${mealPlanData._id}`,
          mealPlanData,
          { headers }
        );
        showSuccessToast("Meal plan updated successfully.");
      } else {
        await axios.post(`${API_URL}/api/plans`, mealPlanData, { headers });
        showSuccessToast("Meal plan added successfully.");
      }

      fetchMealPlans();
      setOpen(false);
      setEditMode(false);
    } catch (error) {
      showErrorToast("Error saving meal plan.");
    }
  };

  const handleAddMeal = () => {
    setMealPlanData({
      ...mealPlanData,
      meals: [
        ...mealPlanData.meals,
        {
          name: "",
          description: "",
          price: "",
          availableOn: "",
        },
      ],
    });
  };

  const handleDeleteMeal = (index) => {
    setMealPlanData({
      ...mealPlanData,
      meals: mealPlanData.meals.filter((_, i) => i !== index),
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Meal Plans
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
          setEditMode(false);
          setMealPlanData({
            name: "",
            description: "",
            price: "",
            meals: [],
            deliveryDays: "",
          });
        }}
        sx={{ mb: 3 }}
      >
        Add New Meal Plan
      </Button>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Delivery Days</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlans.map((mealPlan) => (
              <TableRow key={mealPlan._id}>
                <TableCell>{mealPlan.name}</TableCell>
                <TableCell>{mealPlan.description}</TableCell>
                <TableCell>${mealPlan.price}</TableCell>
                <TableCell>
                  {mealPlan.deliveryDays?.join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setEditMode(true);
                      setMealPlanData(mealPlan);
                      setOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        await axios.delete(
                          `${API_URL}/api/plans/${mealPlan._id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        showSuccessToast("Meal plan deleted successfully.");
                        fetchMealPlans();
                      } catch (error) {
                        showErrorToast("Error deleting meal plan.");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Meal Plan Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editMode ? "Edit Meal Plan" : "Add New Meal Plan"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={mealPlanData.name}
            onChange={(e) =>
              setMealPlanData({ ...mealPlanData, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={mealPlanData.description}
            onChange={(e) =>
              setMealPlanData({ ...mealPlanData, description: e.target.value })
            }
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            type="number"
            value={mealPlanData.price}
            onChange={(e) =>
              setMealPlanData({
                ...mealPlanData,
                price: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Delivery Days (comma-separated)"
            fullWidth
            margin="dense"
            value={mealPlanData.deliveryDays}
            onChange={(e) =>
              setMealPlanData({
                ...mealPlanData,
                deliveryDays: e.target.value
                  .split(",")
                  .map((day) => day.trim()),
              })
            }
          />

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Meals
          </Typography>
          {mealPlanData.meals.map((meal, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{meal.name || `Meal ${index + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Meal Name"
                  fullWidth
                  margin="dense"
                  value={meal.name}
                  onChange={(e) =>
                    setMealPlanData({
                      ...mealPlanData,
                      meals: mealPlanData.meals.map((m, i) =>
                        i === index ? { ...m, name: e.target.value } : m
                      ),
                    })
                  }
                />
                <TextField
                  label="Meal Description"
                  fullWidth
                  margin="dense"
                  value={meal.description}
                  onChange={(e) =>
                    setMealPlanData({
                      ...mealPlanData,
                      meals: mealPlanData.meals.map((m, i) =>
                        i === index ? { ...m, description: e.target.value } : m
                      ),
                    })
                  }
                />
                <TextField
                  label="Meal Price"
                  fullWidth
                  margin="dense"
                  type="number"
                  value={meal.price}
                  onChange={(e) =>
                    setMealPlanData({
                      ...mealPlanData,
                      meals: mealPlanData.meals.map((m, i) =>
                        i === index
                          ? { ...m, price: parseFloat(e.target.value) }
                          : m
                      ),
                    })
                  }
                />
                <TextField
                  label="Available Days (comma-separated)"
                  fullWidth
                  margin="dense"
                  value={meal.availableOn}
                  onChange={(e) =>
                    setMealPlanData({
                      ...mealPlanData,
                      meals: mealPlanData.meals.map((m, i) =>
                        i === index
                          ? {
                            ...m,
                            availableOn: e.target.value
                              .split(",")
                              .map((day) => day.trim()),
                          }
                          : m
                      ),
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteMeal(index)}
                  sx={{ mt: 1 }}
                >
                  Remove Meal
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
          <Button variant="outlined" onClick={handleAddMeal} sx={{ mt: 2 }}>
            Add Meal
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMealPlans;
