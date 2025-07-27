import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Estimate = () => {
  return (
    <div className="space-y-6 p-1">
      <Card className="shadow-lg border-border dark:border-dark-border">
        <CardHeader className="bg-card dark:bg-dark-card rounded-t-lg p-4 md:p-6 border-b border-border dark:border-dark-border">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
            Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <p className="text-muted-foreground dark:text-dark-muted-foreground">
            This is the Estimate page. Functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estimate;