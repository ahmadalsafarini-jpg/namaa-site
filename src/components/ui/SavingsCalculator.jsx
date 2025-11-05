import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';

// Helper for currency formatting - Qatari Riyal (QAR)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-QA', {
    style: 'currency',
    currency: 'QAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const SavingsCalculator = ({ monthlyKwh, facilityType = "Residential" }) => {
  const [years, setYears] = useState(10);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculation = useMemo(() => {
    if (!monthlyKwh || monthlyKwh <= 0) {
      return {
        totalSavings: 0,
        monthlySavings: 0,
        annualSavings: 0,
        isValid: false,
      };
    }

    const vatRate = 0.05; // 5% VAT

    // Define tariff slabs based on Kahramaa Qatar tariffs
    const getTariffSlabs = () => {
      if (facilityType === "Villa (Residential)" || facilityType === "Flat (Residential)") {
        return [
          { min: 1, max: 2000, rate: 0.11 },
          { min: 2001, max: 4000, rate: 0.13 },
          { min: 4001, max: 15000, rate: 0.18 },
          { min: 15001, max: Infinity, rate: 0.26 }
        ];
      } else if (facilityType === "Commercial" || facilityType === "Healthcare") {
        return [
          { min: 1, max: 4000, rate: 0.13 },
          { min: 4001, max: 10000, rate: 0.17 },
          { min: 10001, max: Infinity, rate: 0.22 }
        ];
      } else if (facilityType === "Industrial (Subsidized)") {
        return [{ min: 1, max: Infinity, rate: 0.13 }];
      } else if (facilityType === "Hotel") {
        return [{ min: 1, max: Infinity, rate: 0.15 }];
      } else if (facilityType === "Government" || facilityType === "Educational") {
        return [{ min: 1, max: Infinity, rate: 0.32 }];
      } else if (facilityType === "Productive Farms" || facilityType === "EZAB (Livestock)" || facilityType === "Water Tanker") {
        return [{ min: 1, max: Infinity, rate: 0.07 }];
      } else if (facilityType === "Bulk Industrial") {
        return [{ min: 1, max: Infinity, rate: 0.10 }];
      } else {
        // Default fallback
        return [{ min: 1, max: Infinity, rate: 0.09 }];
      }
    };

    // Calculate electricity bill using tiered slab calculation on MONTHLY basis (like Kahramaa does)
    const calculateMonthlyBill = (monthlyKwh) => {
      if (monthlyKwh <= 0) return 0;
      const slabs = getTariffSlabs();
      let subtotal = 0;
      let remaining = monthlyKwh;

      slabs.forEach(slab => {
        if (remaining <= 0) return;
        
        const slabSize = slab.max - slab.min + 1;
        const used = Math.min(remaining, slabSize);
        
        if (monthlyKwh >= slab.min) {
          subtotal += used * slab.rate;
          remaining -= used;
        }
      });

      const vat = subtotal * vatRate;
      return subtotal + vat; // Total including VAT
    };

    const panelDegradationRate = 0.005; // 0.5% per year - industry standard.
    const electricityInflationRate = 0.03; // 3% per year - conservative for Qatar.

    let accumulatedSavings = 0;
    let currentYearSavings = 0;

    for (let i = 1; i <= 25; i++) {
      // Production decreases slightly each year.
      const monthlyProduction = monthlyKwh * Math.pow(1 - panelDegradationRate, i - 1);
      
      // Calculate the MONTHLY bill, then multiply by 12 for annual
      const inflationMultiplier = Math.pow(1 + electricityInflationRate, i - 1);
      const baseMonthlyBill = calculateMonthlyBill(monthlyProduction);
      const inflatedMonthlyBill = baseMonthlyBill * inflationMultiplier;
      const annualBill = inflatedMonthlyBill * 12;
      
      if (i <= years) {
        accumulatedSavings += annualBill;
      }

      if (i === years) {
        currentYearSavings = annualBill;
      }
    }

    // Calculate average rate for display (approximate)
    const baseMonthlyBill = calculateMonthlyBill(monthlyKwh);
    const baseAnnualBill = baseMonthlyBill * 12;
    const annualConsumption = monthlyKwh * 12;
    const averageRate = baseAnnualBill / annualConsumption;

    // Calculate breakdown for first year to show tiered structure (MONTHLY basis)
    const getMonthlyBreakdown = () => {
      const slabs = getTariffSlabs();
      const breakdown = [];
      let remaining = monthlyKwh;
      
      slabs.forEach((slab, index) => {
        if (remaining <= 0) return;
        
        const slabSize = slab.max === Infinity ? remaining : slab.max - slab.min + 1;
        const used = Math.min(remaining, slabSize);
        
        if (monthlyKwh >= slab.min && used > 0) {
          const cost = used * slab.rate;
          const vatAmount = cost * vatRate;
          const totalForSlab = cost + vatAmount;
          
          breakdown.push({
            range: slab.max === Infinity 
              ? `${(slab.min).toLocaleString()}+ kWh` 
              : `${(slab.min).toLocaleString()} - ${(slab.max).toLocaleString()} kWh`,
            rate: slab.rate,
            kwh: used,
            cost: cost,
            vat: vatAmount,
            total: totalForSlab,
            annualTotal: totalForSlab * 12 // Show annual total per slab
          });
          
          remaining -= used;
        }
      });
      
      return breakdown;
    };

    return {
      totalSavings: accumulatedSavings,
      monthlySavings: currentYearSavings / 12,
      annualSavings: currentYearSavings,
      averageRate: averageRate,
      breakdown: getMonthlyBreakdown(),
      monthlyBill: baseMonthlyBill,
      isValid: true,
    };
  }, [years, monthlyKwh, facilityType]);

  if (!calculation.isValid) {
    return (
      <Card className="bg-amber-50 border-amber-200 border-2 mt-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Info className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Savings Calculator Unavailable</h4>
            <p className="text-sm text-amber-800">Please provide a "Load Profile (kWh/month)" in your application to estimate savings.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-2xl relative overflow-hidden bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 mt-6 shadow-xl border border-emerald-300/30">
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <h4 className="font-bold text-lg text-white">Your Estimated Savings with Solar</h4>
        </div>

        <div className="space-y-4">
        <div>
          <p className="text-sm text-white/90">How much will you save with solar?</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-4xl font-bold text-white">{formatCurrency(calculation.totalSavings)}</p>
            <p className="text-white/80 font-medium">{years} {years > 1 ? 'years' : 'year'}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
          <button 
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wide">
                Monthly Bill Breakdown (Kahramaa Tiered + 5% VAT)
              </p>
              <p className="text-xs text-white/80 mt-1">Based on {monthlyKwh.toLocaleString()} kWh/month</p>
            </div>
            {showBreakdown ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white" />
            )}
          </button>
          
          {showBreakdown && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {calculation.breakdown.map((slab, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-white">{slab.range}</span>
                      <span className="text-white/80 ml-2">
                        @ QAR {slab.rate.toFixed(2)}/kWh
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatCurrency(slab.total)}/mo
                      </div>
                      <div className="text-xs text-white/70">
                        {slab.kwh.toLocaleString()} kWh
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Monthly Total</span>
                  <span className="font-bold text-white">{formatCurrency(calculation.monthlyBill)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Annual Total (×12)</span>
                  <span className="font-semibold text-white">{formatCurrency(calculation.monthlyBill * 12)}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/20">
                  <span className="text-white/80">Effective Rate</span>
                  <span className="text-white">QAR {calculation.averageRate.toFixed(3)}/kWh</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
            <div className="flex justify-between items-center text-sm text-white/90 mb-2">
                <span className="font-medium">1 Year</span>
                <span className="font-medium">25 Years</span>
            </div>
            <input
                type="range"
                min="1"
                max="25"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-white/30 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${((years - 1) / 24) * 100}%, rgba(255,255,255,0.3) ${((years - 1) / 24) * 100}%, rgba(255,255,255,0.3) 100%)`
                }}
            />
        </div>

        <div className="flex items-center pt-4 border-t border-white/20">
            <div className="w-1/2 text-center">
                <p className="text-sm text-white/80 mb-1">Monthly</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(calculation.monthlySavings)}</p>
            </div>
            <div className="border-l border-white/20 h-16"></div>
            <div className="w-1/2 text-center">
                <p className="text-sm text-white/80 mb-1">Annual</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(calculation.annualSavings)}</p>
            </div>
        </div>
        
        <div className="text-center text-xs text-white/80 pt-2">
            <p>This is an estimate based on your provided load profile, Kahramaa Qatar electricity tariffs (with 5% VAT), 3% annual electricity inflation, and 0.5% annual panel degradation. Actual savings may vary. Rates sourced from <a href="https://www.km.qa" target="_blank" rel="noopener noreferrer" className="text-white underline">Kahramaa</a>.</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
