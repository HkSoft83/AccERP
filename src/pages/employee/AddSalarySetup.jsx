import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';


const AddSalarySetup = ({ onSave, onCancel, editData }) => {
  const { toast } = useToast();
  
  const mockEmployees = [
    { id: 'EMP001', name: 'John Doe' },
    { id: 'EMP002', name: 'Jane Smith' },
    { id: 'EMP003', name: 'Peter Jones' },
  ];

  const [employees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [salaryType, setSalaryType] = useState('Fixed');
  const [effectiveFromDate, setEffectiveFromDate] = useState(new Date());
  const [basicSalary, setBasicSalary] = useState(0);
  const [houseRentPercent, setHouseRentPercent] = useState(40);
  const [medicalAllowance, setMedicalAllowance] = useState(0);
  const [transportAllowance, setTransportAllowance] = useState(0);
  const [mobileInternetAllowance, setMobileInternetAllowance] = useState(0);
  const [festivalBonus, setFestivalBonus] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [commission, setCommission] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [othersAllowance, setOthersAllowance] = useState(0);
  const [providentFundEmployeePercent, setProvidentFundEmployeePercent] = useState(10);
  const [taxDeduction, setTaxDeduction] = useState(0);
  const [loanRepayment, setLoanRepayment] = useState(0);
  const [deductionForLateAbsence, setDeductionForLateAbsence] = useState(0);
  const [otherDeduction, setOtherDeduction] = useState(0);
  const [providentFundEmployerPercent, setProvidentFundEmployerPercent] = useState(10);
  const [paymentMode, setPaymentMode] = useState('Bank');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [routingNo, setRoutingNo] = useState('');
  const [mobileBankingName, setMobileBankingName] = useState('');
  const [mobileBankingNumber, setMobileBankingNumber] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [grossSalary, setGrossSalary] = useState(0);
  const [netPayable, setNetPayable] = useState(0);

  useEffect(() => {
    if (editData) {
      setSelectedEmployee(editData.employeeId);
      setSalaryType(editData.salaryType);
      setEffectiveFromDate(new Date(editData.effectiveFromDate));
      setBasicSalary(editData.basicSalary);
      setHouseRentPercent(editData.allowances.houseRentPercent);
      setMedicalAllowance(editData.allowances.medicalAllowance);
      setTransportAllowance(editData.allowances.transportAllowance);
      setMobileInternetAllowance(editData.allowances.mobileInternetAllowance);
      setFestivalBonus(editData.allowances.festivalBonus);
      setOvertime(editData.allowances.overtime);
      setCommission(editData.allowances.commission);
      setSpecialAllowance(editData.allowances.specialAllowance);
      setOthersAllowance(editData.allowances.othersAllowance);
      setProvidentFundEmployeePercent(editData.deductions.providentFundEmployeePercent);
      setTaxDeduction(editData.deductions.taxDeduction);
      setLoanRepayment(editData.deductions.loanRepayment);
      setDeductionForLateAbsence(editData.deductions.deductionForLateAbsence);
      setOtherDeduction(editData.deductions.otherDeduction);
      setProvidentFundEmployerPercent(editData.employerContribution.providentFundEmployerPercent);
      setPaymentMode(editData.paymentMode);
      setBankAccountNo(editData.bankAccountNo || '');
      setAccountName(editData.accountName || '');
      setBankName(editData.bankName || '');
      setBranchName(editData.branchName || '');
      setRoutingNo(editData.routingNo || '');
      setMobileBankingName(editData.mobileBankingName || '');
      setMobileBankingNumber(editData.mobileBankingNumber || '');
      setIsActive(editData.isActive);
    }
  }, [editData]);

  useEffect(() => {
    const basic = parseFloat(basicSalary) || 0;
    const houseRent = basic * (parseFloat(houseRentPercent) / 100) || 0;
    const medical = parseFloat(medicalAllowance) || 0;
    const transport = parseFloat(transportAllowance) || 0;
    const mobileInternet = parseFloat(mobileInternetAllowance) || 0;
    const bonus = parseFloat(festivalBonus) || 0;
    const ot = parseFloat(overtime) || 0;
    const comm = parseFloat(commission) || 0;
    const special = parseFloat(specialAllowance) || 0;
    const others = parseFloat(othersAllowance) || 0;

    const totalAllowances = houseRent + medical + transport + mobileInternet + bonus + ot + comm + special + others;

    const pfEmployee = basic * (parseFloat(providentFundEmployeePercent) / 100) || 0;
    const tax = parseFloat(taxDeduction) || 0;
    const loan = parseFloat(loanRepayment) || 0;
    const lateAbsence = parseFloat(deductionForLateAbsence) || 0;
    const otherDed = parseFloat(otherDeduction) || 0;

    const totalDeductions = pfEmployee + tax + loan + lateAbsence + otherDed;

    const calculatedGrossSalary = basic + totalAllowances;
    const calculatedNetPayable = calculatedGrossSalary - totalDeductions;

    setGrossSalary(calculatedGrossSalary.toFixed(2));
    setNetPayable(calculatedNetPayable.toFixed(2));
  }, [basicSalary, houseRentPercent, medicalAllowance, transportAllowance, mobileInternetAllowance, festivalBonus, overtime, commission, specialAllowance, othersAllowance, providentFundEmployeePercent, taxDeduction, loanRepayment, deductionForLateAbsence, otherDeduction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast({ title: "Validation Error", description: "Please select an employee.", variant: "destructive" });
      return;
    }

    const salaryData = {
      id: editData ? editData.id : `${selectedEmployee}-${effectiveFromDate.toISOString().split('T')[0]}`, // Use existing ID if editing
      employeeId: selectedEmployee,
      salaryType,
      effectiveFromDate: effectiveFromDate.toISOString().split('T')[0],
      basicSalary: parseFloat(basicSalary),
      allowances: {
        houseRentPercent: parseFloat(houseRentPercent),
        medicalAllowance: parseFloat(medicalAllowance),
        transportAllowance: parseFloat(transportAllowance),
        mobileInternetAllowance: parseFloat(mobileInternetAllowance),
        festivalBonus: parseFloat(festivalBonus),
        overtime: parseFloat(overtime),
        commission: parseFloat(commission),
        specialAllowance: parseFloat(specialAllowance),
        othersAllowance: parseFloat(othersAllowance),
      },
      deductions: {
        providentFundEmployeePercent: parseFloat(providentFundEmployeePercent),
        taxDeduction: parseFloat(taxDeduction),
        loanRepayment: parseFloat(loanRepayment),
        deductionForLateAbsence: parseFloat(deductionForLateAbsence),
        otherDeduction: parseFloat(otherDeduction),
      },
      employerContribution: {
        providentFundEmployerPercent: parseFloat(providentFundEmployerPercent),
      },
      grossSalary: parseFloat(grossSalary),
      netPayable: parseFloat(netPayable),
      paymentMode,
      bankAccountNo: paymentMode === 'Bank' ? bankAccountNo : '',
      accountName: paymentMode === 'Bank' ? accountName : '',
      bankName: paymentMode === 'Bank' ? bankName : '',
      branchName: paymentMode === 'Bank' ? branchName : '',
      routingNo: paymentMode === 'Bank' ? routingNo : '',
      mobileBankingName: paymentMode === 'Mobile Banking' ? mobileBankingName : '',
      mobileBankingNumber: paymentMode === 'Mobile Banking' ? mobileBankingNumber : '',
      isActive,
    };

    console.log("Salary Setup Data:", JSON.stringify(salaryData, null, 2));

    let existingSalarySetups = JSON.parse(localStorage.getItem('salarySetups') || '[]');
    if (editData) {
      // Update existing entry
      existingSalarySetups = existingSalarySetups.map(setup =>
        setup.id === salaryData.id ? salaryData : setup
      );
      toast({ title: "Success", description: "Salary setup updated successfully!", className: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600' });
    } else {
      // Add new entry
      existingSalarySetups = [...existingSalarySetups, salaryData];
      toast({ title: "Success", description: "Salary setup saved successfully!", className: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600' });
    }
    localStorage.setItem('salarySetups', JSON.stringify(existingSalarySetups));

    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Salary Setup</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select onValueChange={setSalaryType} value={salaryType}>
                  <SelectTrigger id="salaryType">
                    <SelectValue placeholder="Select salary type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Commission-based">Commission-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveFromDate">Effective From Date</Label>
                <DatePicker date={effectiveFromDate} setDate={setEffectiveFromDate} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Salary Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input id="basicSalary" type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseRentPercent">House Rent (%)</Label>
                <Input id="houseRentPercent" type="number" value={houseRentPercent} onChange={(e) => setHouseRentPercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                <Input id="medicalAllowance" type="number" value={medicalAllowance} onChange={(e) => setMedicalAllowance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportAllowance">Transport/Conveyance</Label>
                <Input id="transportAllowance" type="number" value={transportAllowance} onChange={(e) => setTransportAllowance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileInternetAllowance">Mobile/Internet Allowance</Label>
                <Input id="mobileInternetAllowance" type="number" value={mobileInternetAllowance} onChange={(e) => setMobileInternetAllowance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="festivalBonus">Festival Bonus</Label>
                <Input id="festivalBonus" type="number" value={festivalBonus} onChange={(e) => setFestivalBonus(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtime">Overtime</Label>
                <Input id="overtime" type="number" value={overtime} onChange={(e) => setOvertime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Commission</Label>
                <Input id="commission" type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialAllowance">Special Allowance</Label>
                <Input id="specialAllowance" type="number" value={specialAllowance} onChange={(e) => setSpecialAllowance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="othersAllowance">Others Allowance</Label>
                <Input id="othersAllowance" type="number" value={othersAllowance} onChange={(e) => setOthersAllowance(e.target.value)} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="providentFundEmployeePercent">Provident Fund (Employee %)</Label>
                <Input id="providentFundEmployeePercent" type="number" value={providentFundEmployeePercent} onChange={(e) => setProvidentFundEmployeePercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxDeduction">Tax Deduction (TDS)</Label>
                <Input id="taxDeduction" type="number" value={taxDeduction} onChange={(e) => setTaxDeduction(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanRepayment">Loan Repayment</Label>
                <Input id="loanRepayment" type="number" value={loanRepayment} onChange={(e) => setLoanRepayment(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deductionForLateAbsence">Deduction for Late/Absence</Label>
                <Input id="deductionForLateAbsence" type="number" value={deductionForLateAbsence} onChange={(e) => setDeductionForLateAbsence(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherDeduction">Other Deduction</Label>
                <Input id="otherDeduction" type="number" value={otherDeduction} onChange={(e) => setOtherDeduction(e.target.value)} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Employer Contribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="providentFundEmployerPercent">Provident Fund (Employer %)</Label>
                <Input id="providentFundEmployerPercent" type="number" value={providentFundEmployerPercent} onChange={(e) => setProvidentFundEmployerPercent(e.target.value)} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gross Salary</Label>
                <Input value={grossSalary} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Net Payable</Label>
                <Input value={netPayable} readOnly />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select onValueChange={setPaymentMode} value={paymentMode}>
                  <SelectTrigger id="paymentMode">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paymentMode === 'Bank' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountNo">Bank Account No</Label>
                    <Input id="bankAccountNo" type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input id="branchName" type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNo">Routing No</Label>
                    <Input id="routingNo" type="text" value={routingNo} onChange={(e) => setRoutingNo(e.target.value)} />
                  </div>
                </>
              )}
              {paymentMode === 'Mobile Banking' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mobileBankingName">Mobile Banking Name</Label>
                    <Input id="mobileBankingName" type="text" value={mobileBankingName} onChange={(e) => setMobileBankingName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileBankingNumber">Mobile Banking Number</Label>
                    <Input id="mobileBankingNumber" type="text" value={mobileBankingNumber} onChange={(e) => setMobileBankingNumber(e.target.value)} />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="isActive">Is Active?</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="submit">Save Salary Setup</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSalarySetup;
