import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RouteProgressBar from './components/RouteProgressBar';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AddRestaurant from './pages/AddRestaurant';
import AboutUs from './pages/AboutUs';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RouteProgressBar />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route
            path="/restaurants/new"
            element={(
              <AdminRoute>
                <AddRestaurant />
              </AdminRoute>
            )}
          />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route
            path="/restaurants/:id/edit"
            element={(
              <AdminRoute>
                <AddRestaurant />
              </AdminRoute>
            )}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/favorites"
            element={(
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
