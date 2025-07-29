import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SalarySetupDetail = ({ setup, onClose }) => {
  if (!setup) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Salary Setup Details for {setup.employeeId}</CardTitle>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
            <p><strong>Employee ID:</strong> {setup.employeeId}</p>
            <p><strong>Salary Type:</strong> {setup.salaryType}</p>
            <p><strong>Effective From:</strong> {setup.effectiveFromDate}</p>
            <p><strong>Basic Salary:</strong> {setup.basicSalary.toFixed(2)}</p>
            <p><strong>Gross Salary:</strong> {setup.grossSalary.toFixed(2)}</p>
            <p><strong>Net Payable:</strong> {setup.netPayable.toFixed(2)}</p>
            <p><strong>Status:</strong> {setup.isActive ? 'Active' : 'Inactive'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
            <p><strong>Payment Mode:</strong> {setup.paymentMode}</p>
            {setup.paymentMode === 'Bank' && (
              <>
                <p><strong>Account Name:</strong> {setup.accountName}</p>
                <p><strong>Bank Name:</strong> {setup.bankName}</p>
                <p><strong>Branch Name:</strong> {setup.branchName}</p>
                <p><strong>Account No:</strong> {setup.bankAccountNo}</p>
                <p><strong>Routing No:</strong> {setup.routingNo}</p>
              </>
            )}
            {setup.paymentMode === 'Mobile Banking' && (
              <>
                <p><strong>Mobile Banking Name:</strong> {setup.mobileBankingName}</p>
                <p><strong>Mobile Banking Number:</strong> {setup.mobileBankingNumber}</p>
              </>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Allowances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p><strong>House Rent (%):</strong> {setup.allowances.houseRentPercent}%</p>
          <p><strong>Medical Allowance:</strong> {setup.allowances.medicalAllowance.toFixed(2)}</p>
          <p><strong>Transport Allowance:</strong> {setup.allowances.transportAllowance.toFixed(2)}</p>
          <p><strong>Mobile/Internet Allowance:</strong> {setup.allowances.mobileInternetAllowance.toFixed(2)}</p>
          <p><strong>Festival Bonus:</strong> {setup.allowances.festivalBonus.toFixed(2)}</p>
          <p><strong>Overtime:</strong> {setup.allowances.overtime.toFixed(2)}</p>
          <p><strong>Commission:</strong> {setup.allowances.commission.toFixed(2)}</p>
          <p><strong>Special Allowance:</strong> {setup.allowances.specialAllowance.toFixed(2)}</p>
          <p><strong>Others Allowance:</strong> {setup.allowances.othersAllowance.toFixed(2)}</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p><strong>Provident Fund (Employee %):</strong> {setup.deductions.providentFundEmployeePercent}%</p>
          <p><strong>Tax Deduction (TDS):</strong> {setup.deductions.taxDeduction.toFixed(2)}</p>
          <p><strong>Loan Repayment:</strong> {setup.deductions.loanRepayment.toFixed(2)}</p>
          <p><strong>Deduction for Late/Absence:</strong> {setup.deductions.deductionForLateAbsence.toFixed(2)}</p>
          <p><strong>Other Deduction:</strong> {setup.deductions.otherDeduction.toFixed(2)}</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Employer Contribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Provident Fund (Employer %):</strong> {setup.employerContribution.providentFundEmployerPercent}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalarySetupDetail;
