import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { ChevronDown } from 'lucide-react';

// Mock data (should ideally come from centralized sources)
const mockEmployees = [
  { id: 'EMP001', name: 'John Doe', department: 'Sales', employeeType: 'Fixed', status: 'Active' },
  { id: 'EMP002', name: 'Jane Smith', department: 'Marketing', employeeType: 'Hourly', status: 'Active' },
  { id: 'EMP003', name: 'Peter Jones', department: 'HR', employeeType: 'Fixed', status: 'Terminated' },
  { id: 'EMP004', name: 'Alice Brown', department: 'IT', employeeType: 'Contractual', status: 'Active' },
];

const SalaryReport = () => {
  const { toast } = useToast();
  const [reportMonth, setReportMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [reportYear, setReportYear] = useState(String(new Date().getFullYear()));
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('all');
  const [salaryTypeFilter, setSalaryTypeFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});

  const months = Array.from({ length: 12 }, (item, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
  }));

  const years = Array.from({ length: 5 }, (item, i) => ({
    value: String(new Date().getFullYear() - 2 + i),
    label: String(new Date().getFullYear() - 2 + i),
  }));

  const employeeStatuses = [
    { value: 'Active', label: 'Active' },
    { value: 'Terminated', label: 'Terminated' },
    { value: 'Resigned', label: 'Resigned' },
    { value: 'Retired', label: 'Retired' },
    { value: 'Laid Off', label: 'Laid Off' },
    { value: 'Deceased', label: 'Deceased' },
    { value: 'Absconded', label: 'Absconded' },
    { value: 'Transferred', label: 'Transferred' },
  ];

  const salaryTypes = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'Commission-based', label: 'Commission-based' },
  ];

  const allDepartments = useMemo(() => {
    const departments = [...new Set(mockEmployees.map(emp => emp.department))];
    return departments.map(dept => ({ value: dept, label: dept }));
  }, []);

  const filteredSalarySetups = useMemo(() => {
    const allSetups = JSON.parse(localStorage.getItem('salarySetups') || '[]');

    return allSetups.filter(setup => {
      const employee = mockEmployees.find(emp => emp.id === setup.employeeId);
      if (!employee) return false; // Skip if employee not found

      const setupDate = new Date(setup.effectiveFromDate);
      const periodStart = new Date(parseInt(reportYear), parseInt(reportMonth) - 1, 1);
      const periodEnd = new Date(parseInt(reportYear), parseInt(reportMonth), 0); // Last day of the month

      const matchesPeriod = setupDate >= periodStart && setupDate <= periodEnd;
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesStatus = employeeStatusFilter === 'all' || employee.status === employeeStatusFilter;
      const matchesSalaryType = salaryTypeFilter === 'all' || setup.salaryType === salaryTypeFilter;

      return matchesPeriod && matchesDepartment && matchesStatus && matchesSalaryType;
    }).map(setup => ({
      ...setup,
      employeeName: mockEmployees.find(emp => emp.id === setup.employeeId)?.name || 'Unknown',
      employeeDepartment: mockEmployees.find(emp => emp.id === setup.employeeId)?.department || 'Unknown',
      employeeStatus: mockEmployees.find(emp => emp.id === setup.employeeId)?.status || 'Unknown',
    }));
  }, [reportMonth, reportYear, departmentFilter, employeeStatusFilter, salaryTypeFilter]);

  const summary = useMemo(() => {
    const totalEmployees = filteredSalarySetups.length;
    const totalGrossSalary = filteredSalarySetups.reduce((sum, setup) => sum + setup.grossSalary, 0);
    const totalNetPayable = filteredSalarySetups.reduce((sum, setup) => sum + setup.netPayable, 0);
    const totalDeductions = filteredSalarySetups.reduce((sum, setup) => sum + 
      (setup.deductions.taxDeduction || 0) +
      (setup.deductions.providentFundEmployeePercent ? (setup.basicSalary * setup.deductions.providentFundEmployeePercent / 100) : 0) +
      (setup.deductions.loanRepayment || 0) +
      (setup.deductions.deductionForLateAbsence || 0) +
      (setup.deductions.otherDeduction || 0)
    , 0);

    return {
      totalEmployees,
      totalGrossSalary,
      totalNetPayable,
      totalDeductions,
    };
  }, [filteredSalarySetups]);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">Salary Report</h1>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportMonth">Month</Label>
            <Select onValueChange={setReportMonth} value={reportMonth}>
              <SelectTrigger id="reportMonth">
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
            <Label htmlFor="reportYear">Year</Label>
            <Select onValueChange={setReportYear} value={reportYear}>
              <SelectTrigger id="reportYear">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentFilter">Department</Label>
            <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
              <SelectTrigger id="departmentFilter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {allDepartments.map(dept => (
                  <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeStatusFilter">Employee Status</Label>
            <Select onValueChange={setEmployeeStatusFilter} value={employeeStatusFilter}>
              <SelectTrigger id="employeeStatusFilter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {employeeStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryTypeFilter">Salary Type</Label>
            <Select onValueChange={setSalaryTypeFilter} value={salaryTypeFilter}>
              <SelectTrigger id="salaryTypeFilter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {salaryTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salary Details</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSalarySetups.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Salary Type</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalarySetups.map((setup) => (
                    <React.Fragment key={setup.id}>
                      <TableRow>
                        <TableCell>{setup.employeeId}</TableCell>
                        <TableCell>{setup.employeeName}</TableCell>
                        <TableCell>{setup.employeeDepartment}</TableCell>
                        <TableCell>{setup.employeeStatus}</TableCell>
                        <TableCell>{setup.salaryType}</TableCell>
                        <TableCell>{setup.basicSalary.toFixed(2)}</TableCell>
                        <TableCell>{setup.grossSalary.toFixed(2)}</TableCell>
                        <TableCell>{setup.netPayable.toFixed(2)}</TableCell>
                        <TableCell>{setup.paymentMode}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => toggleRow(setup.id)}>
                            <ChevronDown size={16} className={expandedRows[setup.id] ? 'rotate-180' : ''} />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows[setup.id] && (
                        <TableRow>
                          <TableCell colSpan="10" className="p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2 text-blue-700">Allowances</h4>
                                <p>House Rent: {setup.allowances.houseRentPercent}%</p>
                                <p>Medical: {setup.allowances.medicalAllowance.toFixed(2)}</p>
                                <p>Transport: {setup.allowances.transportAllowance.toFixed(2)}</p>
                                <p>Mobile/Internet: {setup.allowances.mobileInternetAllowance.toFixed(2)}</p>
                                <p>Festival Bonus: {setup.allowances.festivalBonus.toFixed(2)}</p>
                                <p>Overtime: {setup.allowances.overtime.toFixed(2)}</p>
                                <p>Commission: {setup.allowances.commission.toFixed(2)}</p>
                                <p>Special: {setup.allowances.specialAllowance.toFixed(2)}</p>
                                <p>Others: {setup.allowances.othersAllowance.toFixed(2)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 text-red-700">Deductions</h4>
                                <p>PF (Employee): {setup.deductions.providentFundEmployeePercent}%</p>
                                <p>Tax: {setup.deductions.taxDeduction.toFixed(2)}</p>
                                <p>Loan Repayment: {setup.deductions.loanRepayment.toFixed(2)}</p>
                                <p>Late/Absence: {setup.deductions.deductionForLateAbsence.toFixed(2)}</p>
                                <p>Other Deduction: {setup.deductions.otherDeduction.toFixed(2)}</p>
                                <h4 className="font-semibold mt-4 mb-2 text-green-700">Employer Contribution</h4>
                                <p>PF (Employer): {setup.employerContribution.providentFundEmployerPercent}%</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No salary data found for the selected filters.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Total Employees Paid</Label>
            <Input value={summary.totalEmployees} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Total Gross Salary</Label>
            <Input value={summary.totalGrossSalary.toFixed(2)} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Total Deductions</Label>
            <Input value={summary.totalDeductions.toFixed(2)} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Total Net Payable</Label>
            <Input value={summary.totalNetPayable.toFixed(2)} readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryReport;
