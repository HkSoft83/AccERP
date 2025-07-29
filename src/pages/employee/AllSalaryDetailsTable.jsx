import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AllSalaryDetailsTable = ({ salarySetups, onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>All Salary Setups - Detailed View</CardTitle>
        <Button variant="outline" onClick={onClose}>Close Detailed View</Button>
      </CardHeader>
      <CardContent>
        {salarySetups.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan="2">Employee ID</TableHead>
                  <TableHead rowSpan="2">Name</TableHead>
                  <TableHead rowSpan="2">Type</TableHead>
                  <TableHead colSpan="10" className="text-center bg-blue-100">Allowances</TableHead>
                  <TableHead colSpan="5" className="text-center bg-red-100">Deductions</TableHead>
                  <TableHead colSpan="1" className="text-center bg-green-100">Employer Contribution</TableHead>
                  <TableHead colSpan="2" className="text-center bg-yellow-100">Summary</TableHead>
                  <TableHead colSpan="6" className="text-center bg-purple-100">Payment Details</TableHead>
                  <TableHead rowSpan="2">Active</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Basic</TableHead>
                  <TableHead>House Rent (%)</TableHead>
                  <TableHead>Medical</TableHead>
                  <TableHead>Transport</TableHead>
                  <TableHead>Mobile/Internet</TableHead>
                  <TableHead>Festival Bonus</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Special Allowance</TableHead>
                  <TableHead>Others Allowance</TableHead>
                  <TableHead>PF (Emp %)</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Loan</TableHead>
                  <TableHead>Late/Absence</TableHead>
                  <TableHead>Other Deduction</TableHead>
                  <TableHead>PF (Employer %)</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Net Payable</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Bank Account No</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Routing No</TableHead>
                  <TableHead>Mobile Banking Name</TableHead>
                  <TableHead>Mobile Banking Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salarySetups.map((setup) => (
                  <TableRow key={setup.id}>
                    <TableCell>{setup.employeeId}</TableCell>
                    <TableCell>{setup.employeeId}</TableCell> {/* Placeholder for employee name */}
                    <TableCell>{setup.salaryType}</TableCell>
                    <TableCell>{setup.basicSalary.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.houseRentPercent}%</TableCell>
                    <TableCell>{setup.allowances.medicalAllowance.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.transportAllowance.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.mobileInternetAllowance.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.festivalBonus.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.overtime.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.commission.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.specialAllowance.toFixed(2)}</TableCell>
                    <TableCell>{setup.allowances.othersAllowance.toFixed(2)}</TableCell>
                    <TableCell>{setup.deductions.providentFundEmployeePercent}%</TableCell>
                    <TableCell>{setup.deductions.taxDeduction.toFixed(2)}</TableCell>
                    <TableCell>{setup.deductions.loanRepayment.toFixed(2)}</TableCell>
                    <TableCell>{setup.deductions.deductionForLateAbsence.toFixed(2)}</TableCell>
                    <TableCell>{setup.deductions.otherDeduction.toFixed(2)}</TableCell>
                    <TableCell>{setup.employerContribution.providentFundEmployerPercent}%</TableCell>
                    <TableCell>{setup.grossSalary.toFixed(2)}</TableCell>
                    <TableCell>{setup.netPayable.toFixed(2)}</TableCell>
                    <TableCell>{setup.paymentMode}</TableCell>
                    <TableCell>{setup.bankAccountNo}</TableCell>
                    <TableCell>{setup.accountName}</TableCell>
                    <TableCell>{setup.bankName}</TableCell>
                    <TableCell>{setup.branchName}</TableCell>
                    <TableCell>{setup.routingNo}</TableCell>
                    <TableCell>{setup.mobileBankingName}</TableCell>
                    <TableCell>{setup.mobileBankingNumber}</TableCell>
                    <TableCell>{setup.isActive ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No salary setups to display in detail.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AllSalaryDetailsTable;
