const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'resident' }).sort({ createdAt: -1 });
    res.render('admin/users', { title: 'User Management', users });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching users.' };
    res.redirect('/dashboard');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.flash = { type: 'success', message: 'User deleted successfully.' };
    res.redirect('/admin/users');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error deleting user.' };
    res.redirect('/admin/users');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', { title: 'My Profile', user });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error loading profile.' };
    res.redirect('/dashboard');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.session.userId, { name, phone, address }, { new: true });
    req.session.userName = user.name;
    req.session.flash = { type: 'success', message: 'Profile updated successfully.' };
    res.redirect('/profile');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error updating profile.' };
    res.redirect('/profile');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      req.session.flash = { type: 'danger', message: 'All password fields are required.' };
      return res.redirect('/profile');
    }
    if (newPassword !== confirmNewPassword) {
      req.session.flash = { type: 'danger', message: 'New passwords do not match.' };
      return res.redirect('/profile');
    }
    if (newPassword.length < 6) {
      req.session.flash = { type: 'danger', message: 'New password must be at least 6 characters.' };
      return res.redirect('/profile');
    }
    const user = await User.findById(req.session.userId);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      req.session.flash = { type: 'danger', message: 'Old password is incorrect.' };
      return res.redirect('/profile');
    }
    user.password = newPassword;
    await user.save();
    req.session.flash = { type: 'success', message: 'Password changed successfully.' };
    res.redirect('/profile');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error changing password.' };
    res.redirect('/profile');
  }
};
