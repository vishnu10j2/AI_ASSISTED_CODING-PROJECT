const Complaint = require('../models/Complaint');

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ resident: req.session.userId }).sort({ createdAt: -1 });
    res.render('resident/complaints', { title: 'My Complaints', complaints });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching complaints.' };
    res.redirect('/dashboard');
  }
};

exports.getNewComplaint = (req, res) => {
  res.render('resident/complaint-form', { title: 'New Complaint' });
};

exports.postNewComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description) {
      req.session.flash = { type: 'danger', message: 'Title and description are required.' };
      return res.redirect('/resident/complaints/new');
    }
    await Complaint.create({ resident: req.session.userId, title, description, category });
    req.session.flash = { type: 'success', message: 'Complaint submitted successfully.' };
    res.redirect('/resident/complaints');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error submitting complaint.' };
    res.redirect('/resident/complaints/new');
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('resident', 'name email').sort({ createdAt: -1 });
    res.render('admin/complaints', { title: 'All Complaints', complaints });
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error fetching complaints.' };
    res.redirect('/dashboard');
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status, adminResponse, updatedAt: Date.now() });
    req.session.flash = { type: 'success', message: 'Complaint updated successfully.' };
    res.redirect('/admin/complaints');
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Error updating complaint.' };
    res.redirect('/admin/complaints');
  }
};
