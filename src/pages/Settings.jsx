import { useState } from "react";
import SideNavLayout from "../layouts/SideNavLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { getRiskThresholds, setRiskThresholds } from "../hooks/useRiskThresholds";
import { toast } from "react-toastify";

export default function Settings() {
  const stored = getRiskThresholds();
  const [high, setHigh] = useState(stored.high * 100);
  const [medium, setMedium] = useState(stored.medium * 100);

  const handleSave = () => {
    const highVal = Number(high) / 100;
    const medVal = Number(medium) / 100;

    if (medVal >= highVal) {
      toast.error("Medium threshold must be lower than High threshold", { position: "top-right" });
      return;
    }
    if (highVal <= 0 || highVal >= 100 || medVal <= 0 || medVal >= 100) {
      toast.error("Thresholds must be between 0% and 100%", { position: "top-right" });
      return;
    }

    setRiskThresholds({ high: highVal, medium: medVal });
    toast.info("Risk thresholds updated", { position: "top-right" });
  };

  const handleReset = () => {
    setHigh(50);
    setMedium(20);
    setRiskThresholds({ high: 0.5, medium: 0.2 });
    toast.info("Risk thresholds reset to defaults", { position: "top-right" });
  };

  return (
    <SideNavLayout>
      <div className="max-w-2xl space-y-6 pb-6">
        <p className="text-sm text-muted-foreground">
          Configure application settings and risk parameters
        </p>

        <Card title="Risk Level Thresholds">
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Set the default probability thresholds that determine risk classification across the application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  High Risk threshold (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    value={high}
                    onChange={(e) => setHigh(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Above this = <span className="text-destructive font-medium">High Risk</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Medium Risk threshold (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Above this = <span className="text-yellow-600 font-medium">Medium Risk</span>, below = <span className="text-green-600 font-medium">Low Risk</span>
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-muted/30 rounded-lg border space-y-2">
              <div className="text-sm font-medium text-foreground">Preview</div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span><span className="text-destructive font-medium">High Risk</span>: above {high}%</span>
                <span><span className="text-yellow-600 font-medium">Medium Risk</span>: {medium}% – {high}%</span>
                <span><span className="text-green-600 font-medium">Low Risk</span>: below {medium}%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
            </div>
          </div>
        </Card>
      </div>
    </SideNavLayout>
  );
}
