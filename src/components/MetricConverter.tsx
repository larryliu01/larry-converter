
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ConversionType = 'length' | 'weight' | 'temperature' | 'volume';

interface ConversionOption {
  value: string;
  label: string;
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
}

const MetricConverter = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('100');
  const { toast } = useToast();

  const conversionTypes = [
    { value: 'length', label: 'Length' },
    { value: 'weight', label: 'Weight' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'volume', label: 'Volume' }
  ];

  const conversionOptions: Record<ConversionType, ConversionOption[]> = {
    length: [
      { value: 'km', label: 'Kilometers', factor: 1000 },
      { value: 'm', label: 'Meters', factor: 1 },
      { value: 'cm', label: 'Centimeters', factor: 0.01 },
      { value: 'mm', label: 'Millimeters', factor: 0.001 },
      { value: 'mi', label: 'Miles', factor: 1609.34 },
      { value: 'yd', label: 'Yards', factor: 0.9144 },
      { value: 'ft', label: 'Feet', factor: 0.3048 },
      { value: 'in', label: 'Inches', factor: 0.0254 }
    ],
    weight: [
      { value: 't', label: 'Metric Tons', factor: 1000 },
      { value: 'kg', label: 'Kilograms', factor: 1 },
      { value: 'g', label: 'Grams', factor: 0.001 },
      { value: 'mg', label: 'Milligrams', factor: 0.000001 },
      { value: 'lb', label: 'Pounds', factor: 0.453592 },
      { value: 'oz', label: 'Ounces', factor: 0.0283495 }
    ],
    temperature: [
      { 
        value: 'c', 
        label: 'Celsius', 
        toBase: (value) => value,
        fromBase: (value) => value 
      },
      { 
        value: 'f', 
        label: 'Fahrenheit', 
        toBase: (value) => (value - 32) * 5/9,
        fromBase: (value) => value * 9/5 + 32
      },
      { 
        value: 'k', 
        label: 'Kelvin', 
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15
      }
    ],
    volume: [
      { value: 'l', label: 'Liters', factor: 1 },
      { value: 'ml', label: 'Milliliters', factor: 0.001 },
      { value: 'gal', label: 'Gallons (US)', factor: 3.78541 },
      { value: 'qt', label: 'Quarts (US)', factor: 0.946353 },
      { value: 'pt', label: 'Pints (US)', factor: 0.473176 },
      { value: 'cup', label: 'Cups (US)', factor: 0.24 },
      { value: 'floz', label: 'Fluid Ounces (US)', factor: 0.0295735 },
      { value: 'tbsp', label: 'Tablespoons (US)', factor: 0.0147868 },
      { value: 'tsp', label: 'Teaspoons (US)', factor: 0.00492892 }
    ]
  };

  const convert = (value: string, from: string, to: string, type: ConversionType): string => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      return '';
    }

    const options = conversionOptions[type];
    const fromOption = options.find(opt => opt.value === from);
    const toOption = options.find(opt => opt.value === to);

    if (!fromOption || !toOption) {
      return '';
    }

    // For temperature, which uses special conversion functions
    if (type === 'temperature') {
      if (fromOption.toBase && toOption.fromBase) {
        const baseValue = fromOption.toBase(numValue);
        const result = toOption.fromBase(baseValue);
        return result.toFixed(2);
      }
      return '';
    }

    // For other units that use simple factor conversion
    if (fromOption.factor && toOption.factor) {
      const baseValue = numValue * fromOption.factor;
      const result = baseValue / toOption.factor;
      return result.toFixed(4);
    }

    return '';
  };

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromValue(value);
    if (value) {
      const convertedValue = convert(value, fromUnit, toUnit, conversionType);
      setToValue(convertedValue);
    } else {
      setToValue('');
    }
  };

  const handleToValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToValue(value);
    if (value) {
      const convertedValue = convert(value, toUnit, fromUnit, conversionType);
      setFromValue(convertedValue);
    } else {
      setFromValue('');
    }
  };

  const switchUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  useEffect(() => {
    if (fromValue) {
      const convertedValue = convert(fromValue, fromUnit, toUnit, conversionType);
      setToValue(convertedValue);
    }
  }, [conversionType, fromUnit, toUnit]);

  const showInvalidConversionToast = () => {
    toast({
      title: "Invalid conversion",
      description: "Please enter a valid number to convert.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Conversion Type</label>
        <Select
          value={conversionType}
          onValueChange={(value) => setConversionType(value as ConversionType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {conversionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From</label>
            <Select
              value={fromUnit}
              onValueChange={setFromUnit}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions[conversionType].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="text"
            value={fromValue}
            onChange={handleFromValueChange}
            className="text-lg"
            placeholder="Enter value"
          />
        </div>

        <div className="flex justify-center my-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={switchUnits}
            className="rounded-full h-10 w-10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">To</label>
            <Select
              value={toUnit}
              onValueChange={setToUnit}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions[conversionType].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="text"
            value={toValue}
            onChange={handleToValueChange}
            className="text-lg"
            placeholder="Result"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricConverter;
