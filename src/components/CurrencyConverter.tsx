
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flagEmoji?: string;
}

interface ExchangeRates {
  [key: string]: number;
}

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const currencies: Currency[] = [
    { code: "USD", name: "US Dollar", symbol: "$", flagEmoji: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flagEmoji: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flagEmoji: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flagEmoji: "🇯🇵" },
    { code: "AUD", name: "Australian Dollar", symbol: "$", flagEmoji: "🇦🇺" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$", flagEmoji: "🇨🇦" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flagEmoji: "🇨🇭" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flagEmoji: "🇨🇳" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flagEmoji: "🇮🇳" },
    { code: "MXN", name: "Mexican Peso", symbol: "$", flagEmoji: "🇲🇽" },
    { code: "SGD", name: "Singapore Dollar", symbol: "$", flagEmoji: "🇸🇬" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "$", flagEmoji: "🇳🇿" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flagEmoji: "🇧🇷" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flagEmoji: "🇸🇪" },
    { code: "ZAR", name: "South African Rand", symbol: "R", flagEmoji: "🇿🇦" }
  ];

  // Mock exchange rates relative to USD (as of a recent date)
  const mockExchangeRates: ExchangeRates = {
    "USD": 1,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 150.13,
    "AUD": 1.52,
    "CAD": 1.37,
    "CHF": 0.88,
    "CNY": 7.24,
    "INR": 83.37,
    "MXN": 16.73,
    "SGD": 1.34,
    "NZD": 1.65,
    "BRL": 5.06,
    "SEK": 10.42,
    "ZAR": 18.31
  };

  useEffect(() => {
    // Simulate loading exchange rates
    setLoading(true);
    setTimeout(() => {
      setExchangeRates(mockExchangeRates);
      setLoading(false);
      convert(amount, fromCurrency, toCurrency);
    }, 500);
  }, []);

  const convert = (value: string, from: string, to: string) => {
    const amount = parseFloat(value);
    
    if (isNaN(amount) || !exchangeRates[from] || !exchangeRates[to]) {
      setConvertedAmount("");
      return;
    }

    // Convert to USD first (base currency), then to target currency
    const inUSD = amount / exchangeRates[from];
    const result = inUSD * exchangeRates[to];
    
    setConvertedAmount(result.toFixed(4));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    convert(value, fromCurrency, toCurrency);
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    convert(amount, value, toCurrency);
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
    convert(amount, fromCurrency, value);
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    convert(amount, toCurrency, fromCurrency);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 italic">
        {loading ? "Loading exchange rates..." : "Using mock exchange rates for demonstration"}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From</label>
            <Select
              value={fromCurrency}
              onValueChange={handleFromCurrencyChange}
              disabled={loading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flagEmoji}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="text-lg pl-8"
              placeholder="Enter amount"
              disabled={loading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currencies.find(c => c.code === fromCurrency)?.symbol}
            </div>
          </div>
        </div>

        <div className="flex justify-center my-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={switchCurrencies}
            className="rounded-full h-10 w-10"
            disabled={loading}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">To</label>
            <Select
              value={toCurrency}
              onValueChange={handleToCurrencyChange}
              disabled={loading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flagEmoji}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={convertedAmount}
              readOnly
              className="text-lg pl-8 bg-gray-50"
              placeholder="Converted amount"
              disabled={loading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currencies.find(c => c.code === toCurrency)?.symbol}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        {!loading && fromCurrency && toCurrency && amount && !isNaN(parseFloat(amount)) && (
          <p>
            {`1 ${fromCurrency} = ${(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} ${toCurrency}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
