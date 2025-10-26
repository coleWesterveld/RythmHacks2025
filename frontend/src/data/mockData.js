export const mockDatasets = [
    {
      id: 1,
      name: 'Patient Demographics Q3 2024',
      source: 'patient_records.csv',
      epsilonSpent: 2.7,
      epsilonTotal: 5.0,
      researchers: 12,
      queries: 47,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Employee Salary Data 2024',
      source: 'hr_database',
      epsilonSpent: 4.8,
      epsilonTotal: 5.0,
      researchers: 8,
      queries: 89,
      status: 'Budget Low'
    },
    {
      id: 3,
      name: 'Student Academic Records',
      source: 'student_data.csv',
      epsilonSpent: 1.2,
      epsilonTotal: 10.0,
      researchers: 15,
      queries: 34,
      status: 'Active'
    }
  ];
  
export const mockResearchers = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    institution: 'Toronto General Hospital',
    accessLevel: 'Full Access',
    datasets: ['Patient Demographics Q3 2024'],
    epsilonSpent: 1.5,
    epsilonTotal: 3.0,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Prof. Michael Rodriguez',
    email: 'm.rodriguez@research.org',
    institution: 'Data Science Institute',
    accessLevel: 'Analyst',
    datasets: ['Employee Salary Data 2024', 'Student Academic Records'],
    epsilonSpent: 0.8,
    epsilonTotal: 2.0,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Dr. Emma Wilson',
    email: 'e.wilson@medschool.edu',
    institution: 'Medical Research Center',
    accessLevel: 'Viewer',
    datasets: ['Patient Demographics Q3 2024'],
    epsilonSpent: 2.9,
    epsilonTotal: 3.0,
    status: 'Active'
  },
  {
    id: 4,
    name: 'James Park',
    email: 'j.park@university.edu',
    institution: 'University Research Lab',
    accessLevel: 'Analyst',
    datasets: ['Student Academic Records'],
    epsilonSpent: 0.0,
    epsilonTotal: 2.5,
    status: 'Pending Approval'
  }
];
  
  export const mockSchema = {
    tableName: 'patient_records',
    columns: [
      { name: 'patient_id', type: 'Integer', queryable: false, icon: '' },
      { name: 'age', type: 'Numeric', queryable: true, icon: '' },
      { name: 'city', type: 'Categorical', queryable: true, icon: '' },
      { name: 'condition', type: 'Categorical', queryable: true, icon: '' },
      { name: 'days_in_hospital', type: 'Numeric', queryable: true, icon: '' },
      { name: 'medication', type: 'Categorical', queryable: true, icon: '' }
    ]
  };