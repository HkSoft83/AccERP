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

  const initialFormData = {
    employeeId: '',
    salaryType: 'Fixed',
    effectiveFromDate: new Date(),
    basicSalary: 0,
    allowances: {
      houseRentPercent: 0, // Default to 0
      medicalAllowance: 0,
      transportAllowance: 0,
      mobileInternetAllowance: 0,
      festivalBonus: 0,
      overtime: 0,
      commission: 0,
      specialAllowance: 0,
      othersAllowance: 0,
    },
    deductions: {
      providentFundEmployeePercent: 0, // Default to 0
      taxDeduction: 0,
      loanRepayment: 0,
      deductionForLateAbsence: 0,
      otherDeduction: 0,
    },
    employerContribution: {
      providentFundEmployerPercent: 0, // Default to 0
    },
    paymentMode: 'Bank',
    bankAccountNo: '',
    accountName: '',
    bankName: '',
    branchName: '',
    routingNo: '',
    mobileBankingName: '',
    mobileBankingNumber: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [grossSalary, setGrossSalary] = useState(0);
  const [netPayable, setNetPayable] = useState(0);

  useEffect(() => {
    console.log("AddSalarySetup useEffect - editData:", editData);
    console.log("AddSalarySetup useEffect - editData.allowances:", editData?.allowances);
    if (editData) {
      setFormData({
        ...editData,
        effectiveFromDate: new Date(editData.effectiveFromDate),
        allowances: editData.allowances || {},
        deductions: editData.deductions || {},
        employerContribution: editData.employerContribution || {},
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  useEffect(() => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const houseRent = basic * (parseFloat(formData.allowances.houseRentPercent) / 100) || 0;
    const medical = parseFloat(formData.allowances.medicalAllowance) || 0;
    const transport = parseFloat(formData.allowances.transportAllowance) || 0;
    const mobileInternet = parseFloat(formData.allowances.mobileInternetAllowance) || 0;
    const bonus = parseFloat(formData.allowances.festivalBonus) || 0;
    const ot = parseFloat(formData.allowances.overtime) || 0;
    const comm = parseFloat(formData.allowances.commission) || 0;
    const special = parseFloat(formData.allowances.specialAllowance) || 0;
    const others = parseFloat(formData.allowances.othersAllowance) || 0;

    const totalAllowances = houseRent + medical + transport + mobileInternet + bonus + ot + comm + special + others;

    const pfEmployee = basic * (parseFloat(formData.deductions.providentFundEmployeePercent) / 100) || 0;
    const tax = parseFloat(formData.deductions.taxDeduction) || 0;
    const loan = parseFloat(formData.deductions.loanRepayment) || 0;
    const lateAbsence = parseFloat(formData.deductions.deductionForLateAbsence) || 0;
    const otherDed = parseFloat(formData.deductions.otherDeduction) || 0;

    const totalDeductions = pfEmployee + tax + loan + lateAbsence + otherDed;

    const calculatedGrossSalary = basic + totalAllowances;
    const calculatedNetPayable = calculatedGrossSalary - totalDeductions;

    setGrossSalary(calculatedGrossSalary.toFixed(2));
    setNetPayable(calculatedNetPayable.toFixed(2));
  }, [formData]);

  const handleInputChange = (field, value, nestedField = null) => {
    setFormData(prev => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [nestedField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast({ title: "Validation Error", description: "Please select an employee.", variant: "destructive" });
      return;
    }

    const salaryData = {
      id: formData.id || `${formData.employeeId}-${formData.effectiveFromDate.toISOString().split('T')[0]}`, // Use existing ID if editing
      employeeId: formData.employeeId,
      salaryType: formData.salaryType,
      effectiveFromDate: formData.effectiveFromDate.toISOString().split('T')[0],
      basicSalary: parseFloat(formData.basicSalary),
      allowances: {
        houseRentPercent: parseFloat(formData.allowances.houseRentPercent),
        medicalAllowance: parseFloat(formData.allowances.medicalAllowance),
        transportAllowance: parseFloat(formData.allowances.transportAllowance),
        mobileInternetAllowance: parseFloat(formData.allowances.mobileInternetAllowance),
        festivalBonus: parseFloat(formData.allowances.festivalBonus),
        overtime: parseFloat(formData.allowances.overtime),
        commission: parseFloat(formData.allowances.commission),
        specialAllowance: parseFloat(formData.allowances.specialAllowance),
        othersAllowance: parseFloat(formData.allowances.othersAllowance),
      },
      deductions: {
        providentFundEmployeePercent: parseFloat(formData.deductions.providentFundEmployeePercent),
        taxDeduction: parseFloat(formData.deductions.taxDeduction),
        loanRepayment: parseFloat(formData.deductions.loanRepayment),
        deductionForLateAbsence: parseFloat(formData.deductions.deductionForLateAbsence),
        otherDeduction: parseFloat(formData.deductions.otherDeduction),
      },
      employerContribution: {
        providentFundEmployerPercent: parseFloat(formData.employerContribution.providentFundEmployerPercent),
      },
      grossSalary: parseFloat(grossSalary),
      netPayable: parseFloat(netPayable),
      paymentMode: formData.paymentMode,
      bankAccountNo: formData.paymentMode === 'Bank' ? formData.bankAccountNo : '',
      accountName: formData.paymentMode === 'Bank' ? formData.accountName : '',
      bankName: formData.paymentMode === 'Bank' ? formData.bankName : '',
      branchName: formData.paymentMode === 'Bank' ? formData.branchName : '',
      routingNo: formData.paymentMode === 'Bank' ? formData.routingNo : '',
      mobileBankingName: formData.paymentMode === 'Mobile Banking' ? formData.mobileBankingName : '',
      mobileBankingNumber: formData.paymentMode === 'Mobile Banking' ? formData.mobileBankingNumber : '',
      isActive: formData.isActive,
    };

    console.log("Salary Setup Data:", JSON.stringify(salaryData, null, 2));

    let existingSalarySetups = JSON.parse(localStorage.getItem('salarySetups') || '[]');
    if (formData.id) {
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
                <Select onValueChange={(value) => handleInputChange('employeeId', value)} value={formData.employeeId}>
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
                <Select onValueChange={(value) => handleInputChange('salaryType', value)} value={formData.salaryType}>
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
                <DatePicker date={formData.effectiveFromDate} setDate={(date) => handleInputChange('effectiveFromDate', date)} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Salary Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                                <Input id="basicSalary" type="number" value={formData.basicSalary} onChange={(e) => handleInputChange('basicSalary', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseRentPercent">House Rent (%)</Label>
                <Input id="houseRentPercent" type="number" value={formData.allowances.houseRentPercent} onChange={(e) => handleInputChange('allowances', e.target.value, 'houseRentPercent')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                <Input id="medicalAllowance" type="number" value={formData.allowances.medicalAllowance} onChange={(e) => handleInputChange('allowances', e.target.value, 'medicalAllowance')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportAllowance">Transport/Conveyance</Label>
                <Input id="transportAllowance" type="number" value={formData.allowances.transportAllowance} onChange={(e) => handleInputChange('allowances', e.target.value, 'transportAllowance')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileInternetAllowance">Mobile/Internet Allowance</Label>
                <Input id="mobileInternetAllowance" type="number" value={formData.allowances.mobileInternetAllowance} onChange={(e) => handleInputChange('allowances', e.target.value, 'mobileInternetAllowance')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="festivalBonus">Festival Bonus</Label>
                <Input id="festivalBonus" type="number" value={formData.allowances.festivalBonus} onChange={(e) => handleInputChange('allowances', e.target.value, 'festivalBonus')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtime">Overtime</Label>
                <Input id="overtime" type="number" value={formData.allowances.overtime} onChange={(e) => handleInputChange('allowances', e.target.value, 'overtime')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Commission</Label>
                <Input id="commission" type="number" value={formData.allowances.commission} onChange={(e) => handleInputChange('allowances', e.target.value, 'commission')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialAllowance">Special Allowance</Label>
                <Input id="specialAllowance" type="number" value={formData.allowances.specialAllowance} onChange={(e) => handleInputChange('allowances', e.target.value, 'specialAllowance')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="othersAllowance">Others Allowance</Label>
                <Input id="othersAllowance" type="number" value={formData.allowances.othersAllowance} onChange={(e) => handleInputChange('allowances', e.target.value, 'othersAllowance')} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="providentFundEmployeePercent">Provident Fund (Employee %)</Label>
                <Input id="providentFundEmployeePercent" type="number" value={formData.deductions.providentFundEmployeePercent} onChange={(e) => handleInputChange('deductions', e.target.value, 'providentFundEmployeePercent')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxDeduction">Tax Deduction (TDS)</Label>
                <Input id="taxDeduction" type="number" value={formData.deductions.taxDeduction} onChange={(e) => handleInputChange('deductions', e.target.value, 'taxDeduction')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanRepayment">Loan Repayment</Label>
                <Input id="loanRepayment" type="number" value={formData.deductions.loanRepayment} onChange={(e) => handleInputChange('deductions', e.target.value, 'loanRepayment')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deductionForLateAbsence">Deduction for Late/Absence</Label>
                <Input id="deductionForLateAbsence" type="number" value={formData.deductions.deductionForLateAbsence} onChange={(e) => handleInputChange('deductions', e.target.value, 'deductionForLateAbsence')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherDeduction">Other Deduction</Label>
                <Input id="otherDeduction" type="number" value={formData.deductions.otherDeduction} onChange={(e) => handleInputChange('deductions', e.target.value, 'otherDeduction')} />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Employer Contribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="providentFundEmployerPercent">Provident Fund (Employer %)</Label>
                <Input id="providentFundEmployerPercent" type="number" value={formData.employerContribution.providentFundEmployerPercent} onChange={(e) => handleInputChange('employerContribution', e.target.value, 'providentFundEmployerPercent')} />
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
                <Select onValueChange={(value) => handleInputChange('paymentMode', value)} value={formData.paymentMode}>
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
              {formData.paymentMode === 'Bank' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountNo">Bank Account No</Label>
                    <Input id="bankAccountNo" type="text" value={formData.bankAccountNo} onChange={(e) => handleInputChange('bankAccountNo', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" type="text" value={formData.accountName} onChange={(e) => handleInputChange('accountName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" type="text" value={formData.bankName} onChange={(e) => handleInputChange('bankName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input id="branchName" type="text" value={formData.branchName} onChange={(e) => handleInputChange('branchName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNo">Routing No</Label>
                    <Input id="routingNo" type="text" value={formData.routingNo} onChange={(e) => handleInputChange('routingNo', e.target.value)} />
                  </div>
                </>
              )}
              {formData.paymentMode === 'Mobile Banking' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mobileBankingName">Mobile Banking Name</Label>
                    <Input id="mobileBankingName" type="text" value={formData.mobileBankingName} onChange={(e) => handleInputChange('mobileBankingName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileBankingNumber">Mobile Banking Number</Label>
                    <Input id="mobileBankingNumber" type="text" value={formData.mobileBankingNumber} onChange={(e) => handleInputChange('mobileBankingNumber', e.target.value)} />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => handleInputChange('isActive', checked)} />
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
