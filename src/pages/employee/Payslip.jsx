
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Printer, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for finalized payslips
const mockPayslips = [
  {
    payslipId: 'PS-2025-07-JD',
    employeeId: 'EMP001',
    name: 'John Doe',
    month: 'July 2025',
    netPayable: 50000,
    paymentMode: 'Bank',
    status: 'Finalized',
    department: 'Sales',
    designation: 'Sales Manager',
    paymentDate: '2025-07-31',
    salaryType: 'Fixed',
    bankAccount: '**** **** **** 1234',
    earnings: {
      basicSalary: 40000,
      houseRentAllowance: 8000,
      medicalAllowance: 2000,
      transportAllowance: 5000,
    },
    deductions: {
      taxDeduction: 2000,
      loanRepayment: 1500,
      providentFund: 1500,
    },
  },
  {
    payslipId: 'PS-2025-07-JS',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    month: 'July 2025',
    netPayable: 41500,
    paymentMode: 'Mobile Banking',
    status: 'Finalized',
    department: 'Marketing',
    designation: 'Marketing Executive',
    paymentDate: '2025-07-31',
    salaryType: 'Fixed',
    bankAccount: 'N/A',
    earnings: {
      basicSalary: 35000,
      houseRentAllowance: 7000,
      medicalAllowance: 1500,
    },
    deductions: {
      taxDeduction: 1000,
      providentFund: 1000,
    },
  },
];

const Payslip = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    searchTerm: '',
    month: '',
    department: '',
    salaryType: '',
  });
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredPayslips = useMemo(() => {
    return mockPayslips.filter(p => {
      const searchTermMatch =
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.employeeId.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const monthMatch = filters.month ? p.month.includes(filters.month) : true;
      const departmentMatch = filters.department && filters.department !== 'all' ? p.department === filters.department : true;
      const salaryTypeMatch = filters.salaryType ? p.salaryType === filters.salaryType : true;
      return searchTermMatch && monthMatch && departmentMatch && salaryTypeMatch;
    });
  }, [filters]);

  const handleDownload = () => {
    toast({ title: 'Downloading...', description: 'Your payslip is being downloaded.' });
    // In a real app, this would trigger a PDF generation library
  };

  const handlePrint = () => {
    window.print();
  };

  const PayslipView = ({ payslip }) => {
    if (!payslip) return null;

    const totalEarnings = Object.values(payslip.earnings).reduce((sum, val) => sum + (val || 0), 0);
    const totalDeductions = Object.values(payslip.deductions).reduce((sum, val) => sum + (val || 0), 0);

    return (
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Payslip for {payslip.month}</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </div>
        </DialogHeader>
        <div className="p-6" id="payslip-to-print">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-lg">Employee Info</h3>
              <p><strong>Name:</strong> {payslip.name}</p>
              <p><strong>ID:</strong> {payslip.employeeId}</p>
              <p><strong>Designation:</strong> {payslip.designation}</p>
              <p><strong>Department:</strong> {payslip.department}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Payroll Info</h3>
              <p><strong>Pay Period:</strong> {payslip.month}</p>
              <p><strong>Payment Date:</strong> {payslip.paymentDate}</p>
              <p><strong>Salary Type:</strong> {payslip.salaryType}</p>
              <p><strong>Payment Mode:</strong> {payslip.paymentMode}</p>
              {payslip.paymentMode === 'Bank' && <p><strong>Bank Account:</strong> {payslip.bankAccount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Earnings</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(payslip.earnings).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell className="text-right">{value?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right font-bold mt-4">Total Earnings: {totalEarnings.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Deductions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(payslip.deductions).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell className="text-right">{value?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right font-bold mt-4">Total Deductions: {totalDeductions.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold">Net Payable: {payslip.netPayable.toFixed(2)}</h3>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">Payslip Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filters / Search</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="searchTerm">Search by Employee ID or Name</Label>
            <Input
              id="searchTerm"
              placeholder="e.g., EMP001 or John Doe"
              value={filters.searchTerm}
              onChange={e => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              placeholder="e.g., July 2025"
              value={filters.month}
              onChange={e => handleFilterChange('month', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={val => handleFilterChange('department', val)} value={filters.department}>
              <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payslip List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payslip ID</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Net Payable</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayslips.map(p => (
                <TableRow key={p.payslipId}>
                  <TableCell>{p.payslipId}</TableCell>
                  <TableCell>{p.employeeId}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.month}</TableCell>
                  <TableCell>{p.netPayable.toFixed(2)}</TableCell>
                  <TableCell>{p.paymentMode}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>
                    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedPayslip(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(p)}>View</Button>
                      </DialogTrigger>
                      {selectedPayslip && selectedPayslip.payslipId === p.payslipId && <PayslipView payslip={selectedPayslip} />}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPayslips.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No payslips found matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payslip;
