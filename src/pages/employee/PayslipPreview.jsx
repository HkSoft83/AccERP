import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PayslipPreview = ({ employeePayrollData, onClose }) => {
  if (!employeePayrollData) {
    return null;
  }

  const { employeeName, employeeId, basicSalary, allowances, deductions, employerContribution, grossSalary, netPayable, paymentMode, bankAccountNo, accountName, bankName, branchName, routingNo, mobileBankingName, mobileBankingNumber, adjustments } = employeePayrollData;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Payslip for {employeeName} ({employeeId})</CardTitle>
        <Button variant="outline" onClick={onClose}>Close Payslip</Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Employee Details</h3>
            <p><strong>Employee Name:</strong> {employeeName}</p>
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <p><strong>Basic Salary:</strong> {basicSalary.toFixed(2)}</p>
            <p><strong>Gross Salary:</strong> {grossSalary.toFixed(2)}</p>
            <p><strong>Net Payable:</strong> {netPayable.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
            <p><strong>Payment Mode:</strong> {paymentMode}</p>
            {paymentMode === 'Bank' && (
              <>
                <p><strong>Account Name:</strong> {accountName}</p>
                <p><strong>Bank Name:</strong> {bankName}</p>
                <p><strong>Branch Name:</strong> {branchName}</p>
                <p><strong>Account No:</strong> {bankAccountNo}</p>
                <p><strong>Routing No:</strong> {routingNo}</p>
              </>
            )}
            {paymentMode === 'Mobile Banking' && (
              <>
                <p><strong>Mobile Banking Name:</strong> {mobileBankingName}</p>
                <p><strong>Mobile Banking Number:</strong> {mobileBankingNumber}</p>
              </>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Allowances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p><strong>House Rent (%):</strong> {allowances.houseRentPercent}%</p>
          <p><strong>Medical Allowance:</strong> {allowances.medicalAllowance.toFixed(2)}</p>
          <p><strong>Transport Allowance:</strong> {allowances.transportAllowance.toFixed(2)}</p>
          <p><strong>Mobile/Internet Allowance:</strong> {allowances.mobileInternetAllowance.toFixed(2)}</p>
          <p><strong>Festival Bonus:</strong> {allowances.festivalBonus.toFixed(2)}</p>
          <p><strong>Overtime:</strong> {allowances.overtime.toFixed(2)}</p>
          <p><strong>Commission:</strong> {allowances.commission.toFixed(2)}</p>
          <p><strong>Special Allowance:</strong> {allowances.specialAllowance.toFixed(2)}</p>
          <p><strong>Others Allowance:</strong> {allowances.othersAllowance.toFixed(2)}</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p><strong>Provident Fund (Employee %):</strong> {deductions.providentFundEmployeePercent}%</p>
          <p><strong>Tax Deduction (TDS):</strong> {deductions.taxDeduction.toFixed(2)}</p>
          <p><strong>Loan Repayment:</strong> {deductions.loanRepayment.toFixed(2)}</p>
          <p><strong>Deduction for Late/Absence:</strong> {deductions.deductionForLateAbsence.toFixed(2)}</p>
          <p><strong>Other Deduction:</strong> {deductions.otherDeduction.toFixed(2)}</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Employer Contribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Provident Fund (Employer %):</strong> {employerContribution.providentFundEmployerPercent}%</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Adjustments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Bonus:</strong> {adjustments.bonus.toFixed(2)}</p>
          <p><strong>Advance Recovery:</strong> {adjustments.advanceRecovery.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayslipPreview;
