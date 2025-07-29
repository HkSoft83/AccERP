import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AddSalarySetup from './AddSalarySetup'; // Import the renamed component

const mockEmployees = [
  { id: 'EMP001', name: 'John Doe' },
  { id: 'EMP002', name: 'Jane Smith' },
  { id: 'EMP003', name: 'Peter Jones' },
];

const mockSalarySetups = [
  {
    id: 'EMP001-2023-01-01',
    employeeId: 'EMP001',
    salaryType: 'Fixed',
    effectiveFromDate: '2023-01-01',
    basicSalary: 50000,
    grossSalary: 65000,
    netPayable: 60000,
    isActive: true,
  },
  {
    id: 'EMP002-2023-03-15',
    employeeId: 'EMP002',
    salaryType: 'Hourly',
    effectiveFromDate: '2023-03-15',
    basicSalary: 25000,
    grossSalary: 30000,
    netPayable: 28000,
    isActive: true,
  },
];

const SalarySetup = () => {
  const { toast } = useToast();
  const [salarySetups, setSalarySetups] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editData, setEditData] = useState(null); // New state for editing

  useEffect(() => {
    loadSalarySetups();
  }, []);

  const loadSalarySetups = () => {
    const storedSetups = localStorage.getItem('salarySetups');
    if (storedSetups) {
      try {
        setSalarySetups(JSON.parse(storedSetups));
      } catch (e) {
        console.error("Failed to parse salary setups from localStorage", e);
        setSalarySetups([]);
      }
    } else {
      // Initialize with mock data if localStorage is empty
      localStorage.setItem('salarySetups', JSON.stringify(mockSalarySetups));
      setSalarySetups(mockSalarySetups);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const handleDelete = (id) => {
    const updatedSetups = salarySetups.filter(setup => setup.id !== id);
    localStorage.setItem('salarySetups', JSON.stringify(updatedSetups));
    setSalarySetups(updatedSetups);
    toast({
      title: "Salary Setup Deleted",
      description: "The salary setup has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleEdit = (id) => {
    const setupToEdit = salarySetups.find(setup => setup.id === id);
    if (setupToEdit) {
      console.log("Editing setup:", setupToEdit);
      setEditData(setupToEdit);
      setShowAddForm(true);
    } else {
      console.log("Setup not found for editing with ID:", id);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">Salary Setup List</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
          <PlusCircle size={20} className="mr-2" /> {showAddForm ? 'Hide Form' : 'Add New Setup'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Salary Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSalarySetup 
              onSave={() => {
                loadSalarySetups(); // Reload list after saving
                setShowAddForm(false); // Hide form after saving
                setEditData(null); // Clear edit data
              }}
              onCancel={() => {
                setShowAddForm(false);
                setEditData(null);
              }}
              editData={editData}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Salary Setups</CardTitle>
        </CardHeader>
        <CardContent>
          {salarySetups.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Salary Type</TableHead>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salarySetups.map((setup) => (
                    <TableRow key={setup.id}>
                      <TableCell>{setup.employeeId}</TableCell>
                      <TableCell>{getEmployeeName(setup.employeeId)}</TableCell>
                      <TableCell>{setup.salaryType}</TableCell>
                      <TableCell>{setup.effectiveFromDate}</TableCell>
                      <TableCell>{setup.basicSalary.toFixed(2)}</TableCell>
                      <TableCell>{setup.grossSalary.toFixed(2)}</TableCell>
                      <TableCell>{setup.netPayable.toFixed(2)}</TableCell>
                      <TableCell>{setup.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(setup.id)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(setup.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No salary setups found. Click &quot;Add New Setup&quot; to create one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySetup;
