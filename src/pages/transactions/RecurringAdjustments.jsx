import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { DatePicker } from '../../components/ui/date-picker';
import { TimePicker } from '../../components/ui/time-picker';
import { Switch } from '../../components/ui/switch';
import mockAccounts from '../../data/mockAccounts';

export default function RecurringAdjustments() {
  const [transactionType, setTransactionType] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [automationType, setAutomationType] = useState('');
  const [customFrequencyValue, setCustomFrequencyValue] = useState('');
  const [customFrequencyUnit, setCustomFrequencyUnit] = useState('');
  const [occurrenceDay, setOccurrenceDay] = useState('');
  const [occurrenceTime, setOccurrenceTime] = useState('');
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [journalEntries, setJournalEntries] = useState([
    { account: '', debit: '', credit: '', lineNarration: '' },
    { account: '', debit: '', credit: '', lineNarration: '' },
  ]);
  const [overallNarration, setOverallNarration] = useState('');
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [journalEntries]);

  const handleJournalEntryChange = (index, field, value) => {
    const newJournalEntries = [...journalEntries];
    newJournalEntries[index][field] = value;
    setJournalEntries(newJournalEntries);
  };

  const addJournalEntry = () => {
    setJournalEntries([
      ...journalEntries,
      { account: '', debit: '', credit: '', lineNarration: '' },
    ]);
  };

  const removeJournalEntry = (index) => {
    const newJournalEntries = journalEntries.filter((_, i) => i !== index);
    setJournalEntries(newJournalEntries);
  };

  const handleDebitFocus = (index) => {
    const newJournalEntries = [...journalEntries];
    if (newJournalEntries[index].credit !== '') {
      newJournalEntries[index].credit = '';
      setJournalEntries(newJournalEntries);
    }
  };

  const handleCreditFocus = (index) => {
    const newJournalEntries = [...journalEntries];
    if (newJournalEntries[index].debit !== '') {
      newJournalEntries[index].debit = '';
      setJournalEntries(newJournalEntries);
    }
  };

  const calculateTotals = () => {
    let debitSum = 0;
    let creditSum = 0;
    journalEntries.forEach((entry) => {
      debitSum += parseFloat(entry.debit) || 0;
      creditSum += parseFloat(entry.credit) || 0;
    });
    setTotalDebit(debitSum);
    setTotalCredit(creditSum);
  };

  const handleAddRecurringTransaction = () => {
    const newTransaction = {
      id: Date.now(), // Simple unique ID
      transactionType,
      frequency,
      ...(frequency === 'custom' && { customFrequencyValue, customFrequencyUnit }),
      occurrenceDay,
      occurrenceTime,
      startDate: startDate ? startDate.toDateString() : '',
      endDate: endDate ? endDate.toDateString() : '',
      amount,
      description,
      automationType,
    };
    setRecurringTransactions([...recurringTransactions, newTransaction]);
    // Clear form fields
    setTransactionType('');
    setFrequency('');
    setStartDate(null);
    setEndDate(null);
    setAmount('');
    setDescription('');
    setAutomationType('');
    setCustomFrequencyValue('');
    setCustomFrequencyUnit('');
    setOccurrenceDay('');
    setOccurrenceTime('');

    // Clear journal entry fields
    setJournalEntries([{ account: '', debit: '', credit: '', lineNarration: '' }]);
    setOverallNarration('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recurring Transactions</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Recurring Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select onValueChange={setTransactionType} value={transactionType}>
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="journalEntry">Journal Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select onValueChange={setFrequency} value={frequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {frequency === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="customFrequencyValue">Every</Label>
                  <Input
                    id="customFrequencyValue"
                    type="number"
                    value={customFrequencyValue}
                    onChange={(e) => setCustomFrequencyValue(e.target.value)}
                    placeholder="e.g., 2, 3"
                  />
                </div>
                <div>
                  <Label htmlFor="customFrequencyUnit">Unit</Label>
                  <Select onValueChange={setCustomFrequencyUnit} value={customFrequencyUnit}>
                    <SelectTrigger id="customFrequencyUnit">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                date={startDate}
                setDate={(newStartDate) => {
                  setStartDate(newStartDate);
                  if (endDate && newStartDate > endDate) {
                    setEndDate(null);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <DatePicker date={endDate} setDate={setEndDate} disabledDate={{ before: startDate }} />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="automationType">Automation Type</Label>
              <Select onValueChange={setAutomationType} value={automationType}>
                <SelectTrigger id="automationType">
                  <SelectValue placeholder="Select Automation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="unscheduled">Unscheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {frequency && (
              <>
                <div>
                  <Label htmlFor="occurrenceTime">Time of Day</Label>
                  <TimePicker
                    value={occurrenceTime}
                    onChange={setOccurrenceTime}
                  />
                </div>
                {(frequency === 'weekly' || frequency === 'monthly' || frequency === 'quarterly' || frequency === 'half-yearly' || frequency === 'annually' || frequency === 'custom') && (
                  <div>
                    <Label htmlFor="occurrenceDay">Day of {frequency === 'weekly' ? 'Week' : frequency === 'monthly' ? 'Month' : frequency === 'annually' ? 'Year' : 'Period'}</Label>
                    <Input
                      id="occurrenceDay"
                      type="text"
                      value={occurrenceDay}
                      onChange={(e) => {
                        const value = e.target.value;
                        let maxDay;

                        switch (frequency) {
                          case 'weekly':
                            maxDay = 7;
                            break;
                          case 'monthly':
                            maxDay = 31;
                            break;
                          case 'quarterly':
                            maxDay = 92; // Approx. 365/4
                            break;
                          case 'half-yearly':
                            maxDay = 183; // Approx. 365/2
                            break;
                          case 'annually':
                            maxDay = 365;
                            break;
                          case 'custom':
                            if (customFrequencyUnit === 'days') {
                              maxDay = parseInt(customFrequencyValue) || 1;
                            } else if (customFrequencyUnit === 'weeks') {
                              maxDay = (parseInt(customFrequencyValue) || 1) * 7;
                            } else if (customFrequencyUnit === 'months') {
                              maxDay = (parseInt(customFrequencyValue) || 1) * new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
                            } else if (customFrequencyUnit === 'years') {
                              maxDay = (parseInt(customFrequencyValue) || 1) * 365;
                            }
                            break;
                          default:
                            maxDay = Infinity;
                        }

                        const days = value.split(/[,/]/).map(day => day.trim());
                        let allValid = true;

                        if (value === '') {
                          setOccurrenceDay('');
                          return;
                        }

                        for (const day of days) {
                          if (day.toLowerCase() === 'last') {
                            continue;
                          }
                          const numValue = parseInt(day);
                          if (isNaN(numValue) || numValue < 1 || numValue > maxDay) {
                            allValid = false;
                            break;
                          }
                        }

                        if (allValid) {
                          setOccurrenceDay(value);
                        }
                      }}
                      placeholder={
                        frequency === 'weekly' ? 'e.g., 1 (Mon), 7 (Sun)' :
                        frequency === 'monthly' ? 'e.g., 1, 15, last' :
                        frequency === 'quarterly' || frequency === 'half-yearly' || frequency === 'annually' ? 'e.g., 1, 90, 180, last' :
                        'e.g., 1, 4, last'
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {transactionType === 'journalEntry' && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Journal Entry Details</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Account</th>
                    <th className="py-2 px-4 border-b">Debit</th>
                    <th className="py-2 px-4 border-b">Credit</th>
                    <th className="py-2 px-4 border-b">Line Narration</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntries.map((entry, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">
                        <Select onValueChange={(value) => handleJournalEntryChange(index, 'account', value)} value={entry.account}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAccounts.map(account => (
                              <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Input
                          type="number"
                          value={entry.debit}
                          onChange={(e) => handleJournalEntryChange(index, 'debit', e.target.value)}
                          onFocus={() => handleDebitFocus(index)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Input
                          type="number"
                          value={entry.credit}
                          onChange={(e) => handleJournalEntryChange(index, 'credit', e.target.value)}
                          onFocus={() => handleCreditFocus(index)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Input
                          type="text"
                          value={entry.lineNarration}
                          onChange={(e) => handleJournalEntryChange(index, 'lineNarration', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <Button variant="destructive" size="sm" onClick={() => removeJournalEntry(index)}>Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-2 px-4 font-bold text-right">Total:</td>
                    <td className="py-2 px-4 font-bold">{totalDebit.toFixed(2)}</td>
                    <td className="py-2 px-4 font-bold">{totalCredit.toFixed(2)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
              <Button onClick={addJournalEntry} className="mt-2">Add Line Item</Button>
              {totalDebit !== totalCredit && (
                <p className="text-red-500 mt-2">Debit and Credit totals must be equal!</p>
              )}
              <div className="mt-4">
                <Label htmlFor="overallNarration">Overall Narration</Label>
                <Input
                  id="overallNarration"
                  type="text"
                  value={overallNarration}
                  onChange={(e) => setOverallNarration(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <Button onClick={handleAddRecurringTransaction}>Add Recurring Transaction</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Recurring Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recurringTransactions.length === 0 ? (
            <p>No recurring transactions added yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recurringTransactions.map((txn) => (
                <Card key={txn.id} className="p-4">
                  <p><strong>Type:</strong> {txn.transactionType}</p>
                  <p><strong>Frequency:</strong> {txn.frequency} {txn.frequency === 'custom' && `(Every ${txn.customFrequencyValue} ${txn.customFrequencyUnit})`}</p>
                  {txn.occurrenceDay && <p><strong>Occurs On:</strong> {txn.occurrenceDay}</p>}
                  {txn.occurrenceTime && <p><strong>At Time:</strong> {txn.occurrenceTime}</p>}
                  <p><strong>Start Date:</strong> {txn.startDate}</p>
                  <p><strong>End Date:</strong> {txn.endDate || 'N/A'}</p>
                  <p><strong>Amount:</strong> {txn.amount}</p>
                  <p><strong>Description:</strong> {txn.description}</p>
                  <p><strong>Automation:</strong> {txn.automationType}</p>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
