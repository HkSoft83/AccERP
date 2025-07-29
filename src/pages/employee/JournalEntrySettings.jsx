import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import mockAccounts from '@/data/mockAccounts';

const salaryComponents = [
  { key: 'basicSalary', name: 'Basic Salary' },
  { key: 'houseRent', name: 'House Rent' },
  { key: 'medicalAllowance', name: 'Medical Allowance' },
  { key: 'transportAllowance', name: 'Transport Allowance' },
  { key: 'mobileInternetAllowance', name: 'Mobile/Internet Allowance' },
  { key: 'festivalBonus', name: 'Festival Bonus' },
  { key: 'overtime', name: 'Overtime' },
  { key: 'commission', name: 'Commission' },
  { key: 'specialAllowance', name: 'Special Allowance' },
  { key: 'othersAllowance', name: 'Others Allowance' },
  { key: 'providentFundEmployee', name: 'Provident Fund (Employee)' },
  { key: 'taxDeduction', name: 'Tax Deduction (TDS)' },
  { key: 'loanRepayment', name: 'Loan Repayment' },
  { key: 'deductionForLateAbsence', name: 'Deduction for Late/Absence' },
  { key: 'otherDeduction', name: 'Other Deduction' },
  { key: 'providentFundEmployer', name: 'Provident Fund (Employer)' },
  { key: 'netPayable', name: 'Net Payable' },
];

const JournalEntrySettings = ({ onSave, onCancel }) => {
  const { toast } = useToast();
  const [mappings, setMappings] = useState({});

  useEffect(() => {
    const storedMappings = localStorage.getItem('journalEntryMappings');
    if (storedMappings) {
      setMappings(JSON.parse(storedMappings));
    } else {
      // Initialize with empty mappings
      const initialMappings = {};
      salaryComponents.forEach(comp => {
        initialMappings[comp.key] = '';
      });
      setMappings(initialMappings);
    }
  }, []);

  const handleMappingChange = (componentKey, accountId) => {
    setMappings(prev => ({
      ...prev,
      [componentKey]: accountId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('journalEntryMappings', JSON.stringify(mappings));
    toast({ title: "Settings Saved", description: "Journal entry mappings saved successfully!" });
    if (onSave) {
      onSave();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entry Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-muted-foreground">Map each salary component to its corresponding account in the Chart of Accounts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salaryComponents.map(component => (
              <div key={component.key} className="space-y-2">
                <Label htmlFor={component.key}>{component.name}</Label>
                <Select
                  value={mappings[component.key] || ''}
                  onValueChange={(value) => handleMappingChange(component.key, value)}
                >
                  <SelectTrigger id={component.key}>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="submit">Save Mappings</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JournalEntrySettings;
