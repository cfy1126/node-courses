const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      message: 'First and Last names are required',
    });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const matchingItem = data.employees.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!matchingItem) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} not Found`,
    });
  }
  if (req.body.firstname) {
    matchingItem.firstname = req.body.firstname;
  }
  if (req.body.lastname) {
    matchingItem.lastname = req.body.lastname;
  }
  const filterEmployees = data.employees.filter(
    (employee) => employee.id !== parseInt(req.body.id)
  );
  const unsortedEmployees = [...filterEmployees, matchingItem];
  data.setEmployees(
    unsortedEmployees.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const matchingItem = data.employees.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!matchingItem) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} not Found`,
    });
  }
  const filterEmployees = data.employees.filter(
    (employee) => employee.id !== parseInt(req.body.id)
  );
  data.setEmployees(filterEmployees)
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const matchingItem = data.employees.find(
    (employee) => employee.id === parseInt(req.params.id)
  );
  if (!matchingItem) {
    return res.status(400).json({
      message: `Employee ID ${req.params.id} not Found`,
    });
  }
  res.json(matchingItem);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
