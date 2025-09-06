const organizationRegister = (req, res) => {
  const { name, password } = req.body;
  console.log(name, password);
};

module.exports = organizationRegister;
