
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MetricConverter from '@/components/MetricConverter';
import CurrencyConverter from '@/components/CurrencyConverter';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("metric");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center py-8 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Converter</h1>
        <p className="text-center text-gray-600 mb-8">Metric and currency conversions made easy</p>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <Tabs
              defaultValue="metric"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="currency">Currency</TabsTrigger>
              </TabsList>
              <div className="px-6 pb-6">
                <TabsContent value="metric" className="mt-0">
                  <MetricConverter />
                </TabsContent>
                <TabsContent value="currency" className="mt-0">
                  <CurrencyConverter />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
