import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Edit, CheckCircle } from 'lucide-react';

// Mock data for employees (should ideally come from a centralized employee database)
const mockEmployees = [
  { id: 'EMP001', name: 'John Doe', employmentStartDate: '2022-01-01', department: 'Sales', employeeType: 'Full time' },
  { id: 'EMP002', name: 'Jane Smith', employmentStartDate: '2022-03-15', department: 'Marketing', employeeType: 'Part time' },
  { id: 'EMP003', name: 'Peter Jones', employmentStartDate: '2023-06-01', department: 'HR', employeeType: 'Full time' },
  { id: 'EMP004', name: 'Alice Brown', employmentStartDate: '2021-11-01', department: 'IT', employeeType: 'Contractual' },
];

const PayrollRun = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('');

  const months = Array.from({ length: 12 }, (item, i) => {
    const month = String(i + 1).padStart(2, '0');
    return { value: month, label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }) };
  });

  const years = Array.from({ length: 5 }, (item, i) => {
    const year = String(new Date().getFullYear() - 2 + i);
    return { value: year, label: year };
  });

  useEffect(() => {
    generatePayrollData();
  }, [selectedMonth, selectedYear, searchTerm, departmentFilter, employeeTypeFilter]);

  const handleFinalizeAll = () => {
    const pendingPayroll = payrollData.filter(item => item.status === 'Pending');
    if (pendingPayroll.length === 0) {
      toast({ title: "No Pending Payroll", description: "All payroll entries are already finalized." });
      return;
    }

    const updatedPayrollData = payrollData.map(item => ({ ...item, status: 'Paid' }));
    setPayrollData(updatedPayrollData);
    toast({ title: "All Payroll Finalized", description: "All pending payroll entries have been finalized." });
    // In a real application, this would trigger saving all to backend and accounting entries
  };

  const generatePayrollData = () => {
    const allSalarySetups = JSON.parse(localStorage.getItem('salarySetups') || '[]');
    let eligibleEmployees = mockEmployees.filter(emp => {
      // For simplicity, assuming all mockEmployees are active for now
      // In a real app, you'd check emp.isActive and emp.employmentStartDate <= selectedPeriodEndDate
      return true; 
    });

    // Apply filters
    if (searchTerm) {
      eligibleEmployees = eligibleEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (departmentFilter && departmentFilter !== 'all') {
      eligibleEmployees = eligibleEmployees.filter(emp => emp.department === departmentFilter);
    }
    if (employeeTypeFilter && employeeTypeFilter !== 'all') {
      eligibleEmployees = eligibleEmployees.filter(emp => emp.employeeType === employeeTypeFilter);
    }

    const newPayrollData = eligibleEmployees.map(emp => {
      const employeeSalarySetup = allSalarySetups.find(setup => setup.employeeId === emp.id && setup.isActive);

      // If no active salary setup, use default/zero values
      const basicSalary = employeeSalarySetup?.basicSalary || 0;
      const allowances = employeeSalarySetup?.allowances || {};
      const deductions = employeeSalarySetup?.deductions || {};
      const employerContribution = employeeSalarySetup?.employerContribution || {};
      const grossSalary = employeeSalarySetup?.grossSalary || 0;
      const netPayable = employeeSalarySetup?.netPayable || 0;

      return {
        id: `${emp.id}-${selectedYear}-${selectedMonth}`,
        employeeId: emp.id,
        employeeName: emp.name,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        employerContribution: employerContribution,
        grossSalary: grossSalary,
        netPayable: netPayable,
        status: 'Pending',
        adjustments: { bonus: 0, advanceRecovery: 0 }, // Manual adjustments
      };
    });
    setPayrollData(newPayrollData);
  };

  const handleAdjustmentChange = (employeeId, field, value) => {
    setPayrollData(prevData =>
      prevData.map(item =>
        item.employeeId === employeeId
          ? { ...item, adjustments: { ...item.adjustments, [field]: parseFloat(value) || 0 } }
          : item
      )
    );
  };

  const handleFinalize = (id) => {
    setPayrollData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: 'Paid' } : item
      )
    );
    toast({ title: "Payroll Finalized", description: `Payroll for ${id} has been finalized.` });
    // In a real application, this would trigger saving to backend and accounting entries
  };

  const handleGeneratePayslip = () => {
    toast({ title: "Payslip Generation", description: "Generating payslips... (Not yet implemented)" });
    // This would trigger the actual payslip generation logic
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">Payroll Run</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Payroll Period</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Employees</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="searchTerm">Search by Name or ID</Label>
            <Input
              id="searchTerm"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentFilter">Department</Label>
            <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
              <SelectTrigger id="departmentFilter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeTypeFilter">Employee Type</Label>
            <Select onValueChange={setEmployeeTypeFilter} value={employeeTypeFilter}>
              <SelectTrigger id="employeeTypeFilter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full time">Full time</SelectItem>
                <SelectItem value="Part time">Part time</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Contractual">Contractual</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Eligible Employees for Payroll</CardTitle>
          {payrollData.some(item => item.status === 'Pending') && (
            <Button onClick={handleFinalizeAll} className="bg-green-600 hover:bg-green-700 text-white">
              Finalize All Pending
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {payrollData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Advance Recovery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell>{data.employeeId}</TableCell>
                      <TableCell>{data.employeeName}</TableCell>
                      <TableCell>{data.basicSalary.toFixed(2)}</TableCell>
                      <TableCell>
                        {/* Display allowances summary */}
                        House Rent: {data.allowances.houseRentPercent || 0}%<br/>
                        Medical: {data.allowances.medicalAllowance?.toFixed(2) || 0}<br/>
                        Transport: {data.allowances.transportAllowance?.toFixed(2) || 0}
                      </TableCell>
                      <TableCell>
                        {/* Display deductions summary */}
                        PF: {data.deductions.providentFundEmployeePercent || 0}%<br/>
                        Tax: {data.deductions.taxDeduction?.toFixed(2) || 0}<br/>
                        Loan: {data.deductions.loanRepayment?.toFixed(2) || 0}
                      </TableCell>
                      <TableCell>{data.grossSalary.toFixed(2)}</TableCell>
                      <TableCell>{data.netPayable.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={data.adjustments.bonus}
                          onChange={(e) => handleAdjustmentChange(data.employeeId, 'bonus', e.target.value)}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={data.adjustments.advanceRecovery}
                          onChange={(e) => handleAdjustmentChange(data.employeeId, 'advanceRecovery', e.target.value)}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell>{data.status}</TableCell>
                      <TableCell className="text-center">
                        {data.status === 'Pending' ? (
                          <Button variant="outline" size="sm" onClick={() => handleFinalize(data.id)}>
                            <CheckCircle size={16} className="mr-1" /> Finalize
                          </Button>
                        ) : (
                          <span className="text-green-600">Paid</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No eligible employees found for this payroll period.</p>
          )}
        </CardContent>
      </Card>

      {payrollData.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleGeneratePayslip} className="bg-green-600 hover:bg-green-700 text-white">
            Generate Payslips
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayrollRun;
