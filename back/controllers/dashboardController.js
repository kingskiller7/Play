const getDashboard = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    return res.json({ message: 'Welcome to the Admin Dashboard' });
  } else {
    return res.json({ message: 'Welcome to the User Dashboard' });
  }
};

export default getDashboard;