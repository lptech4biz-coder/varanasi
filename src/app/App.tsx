import { useState } from 'react';
import { HiCalculator, HiArrowRight, HiEye, HiInformationCircle } from 'react-icons/hi2';
import { useLanguage } from '../i18n';
import { AppHeader } from '../components/layout/AppHeader';
import { AppFooter } from '../components/layout/AppFooter';
import { Button } from '../components/common/Button';
import { VillageSearch } from '../features/valuation/components/VillageSearch';
import { SegmentPicker } from '../features/valuation/components/SegmentPicker';
import { PropertyTypeSelector } from '../features/valuation/components/PropertyTypeSelector';
import { BoundaryConditions } from '../features/valuation/components/BoundaryConditions';
import { ResidentialDetails } from '../features/valuation/components/ResidentialDetails';
import { CommercialDetails } from '../features/valuation/components/CommercialDetails';
import { IndustrialDetails } from '../features/valuation/components/IndustrialDetails';
import { AgriculturalDetails } from '../features/valuation/components/AgriculturalDetails';
import { AdvancedOptions } from '../features/valuation/components/AdvancedOptions';
import { ConstructionDetails } from '../features/valuation/components/ConstructionDetails';
import { TreeValuation } from '../features/valuation/components/TreeValuation';
import { OtherAssets } from '../features/valuation/components/OtherAssets';
import { ResultModal } from '../features/valuation/components/ResultModal';
import { useValuationForm } from '../features/valuation/hooks/useValuationForm';
import { formatINR } from '../utils/format';
import styles from './App.module.css';

export function App() {
  const { t, language } = useLanguage();
  const form = useValuationForm();
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // `form.errors` holds translation *keys* (e.g. "error.areaRequired"), not
  // display text -- translate them once here so every child component can
  // just render `errors.someField` directly without needing `t()` itself.
  const translatedErrors = Object.fromEntries(
    Object.entries(form.errors).map(([field, key]) => [field, t(key as Parameters<typeof t>[0])]),
  );

  const handleCalculate = () => {
    const { firstErrorId } = form.calculate();
    if (firstErrorId) {
      const el = document.getElementById(firstErrorId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
    } else {
      setIsResultModalOpen(true);
    }
  };

  const handleReset = () => {
    setIsResultModalOpen(false);
    form.reset();
  };

  return (
    <div className={styles.app}>
      <div className={styles.wrap}>
        <AppHeader onReset={handleReset} />

        <div className={styles.dashboard}>
          {/* Column 1: 1, 2, 3 in one vertical */}
          <div className={styles.colSetup}>
            {/* 1. Location & Village Search */}
            <VillageSearch
              selectedVillage={form.state.village}
              onSelect={form.selectVillage}
              error={translatedErrors.villageSearch}
            />

            {form.state.village && form.availableSegments.length > 0 && (
              <SegmentPicker
                segments={form.availableSegments}
                selected={form.state.segment}
                onSelect={form.selectSegment}
              />
            )}

            {/* 2. Property Type Selector */}
            {form.state.village && (
              <PropertyTypeSelector
                value={form.state.propertyType}
                onChange={form.setPropertyType}
              />
            )}

            {/* 3. Boundary Conditions */}
            {form.state.village && form.state.propertyType !== 'agri' && (
              <BoundaryConditions value={form.state.boundary} onChange={form.setBoundary} />
            )}
          </div>

          {form.state.village ? (
            <>
              {/* Column 2: 4. Details & Primary Actions */}
              <div className={styles.colDetails}>
                {form.state.propertyType === 'res' && (
                  <ResidentialDetails
                    segment={form.state.segment}
                    mode={form.state.residentialMode}
                    onModeChange={form.setResidentialMode}
                    roadWidth={form.state.roadWidth}
                    onRoadWidthChange={(v) => form.setField('roadWidth', v)}
                    area={form.state.area}
                    onAreaChange={(v) => form.setField('area', v)}
                    flatCarpetArea={form.state.flatCarpetArea}
                    onFlatCarpetAreaChange={(v) => form.setField('flatCarpetArea', v)}
                    flatSuperArea={form.state.flatSuperArea}
                    onFlatSuperAreaChange={(v) => form.setField('flatSuperArea', v)}
                    floorWhich={form.state.floorWhich}
                    onFloorWhichChange={(v) => form.setField('floorWhich', v)}
                    errors={translatedErrors}
                  />
                )}

                {form.state.propertyType === 'comm' && (
                  <CommercialDetails
                    segment={form.state.segment}
                    commercialType={form.state.commercialType}
                    onCommercialTypeChange={(v) => form.setField('commercialType', v)}
                    area={form.state.commercialArea}
                    onAreaChange={(v) => form.setField('commercialArea', v)}
                    floorDiscountPct={form.state.commercialFloorDiscountPct}
                    onFloorDiscountChange={(v) => form.setField('commercialFloorDiscountPct', v)}
                    errors={translatedErrors}
                  />
                )}

                {form.state.propertyType === 'indust' && (
                  <IndustrialDetails
                    roadWidth={form.state.roadWidth}
                    onRoadWidthChange={(v) => form.setField('roadWidth', v)}
                    area={form.state.industrialArea}
                    onAreaChange={(v) => form.setField('industrialArea', v)}
                    errors={translatedErrors}
                  />
                )}

                {form.state.propertyType === 'agri' && (
                  <AgriculturalDetails
                    agriType={form.state.agriType}
                    onAgriTypeChange={(v) => form.setField('agriType', v)}
                    agriUnit={form.state.agriUnit}
                    onAgriUnitChange={(v) => form.setField('agriUnit', v)}
                    area={form.state.agriArea}
                    onAreaChange={(v) => form.setField('agriArea', v)}
                    bonuses={form.state.agriBonuses}
                    onBonusesChange={(patch) =>
                      form.setField('agriBonuses', { ...form.state.agriBonuses, ...patch })
                    }
                    errors={translatedErrors}
                  />
                )}
              </div>

              {/* Column 3: 5. Additional Options */}
              <div className={styles.colAdvanced}>
                <AdvancedOptions>
                  {form.state.propertyType !== 'agri' && (
                    <ConstructionDetails
                      value={form.state.construction}
                      onChange={form.setConstruction}
                    />
                  )}
                  <TreeValuation
                    trees={form.state.trees}
                    onAdd={form.addTree}
                    onUpdate={form.updateTree}
                    onRemove={form.removeTree}
                  />
                  <OtherAssets value={form.state.assets} onChange={form.setAssets} />
                </AdvancedOptions>
              </div>
            </>
          ) : (
            <div className={styles.guideCard}>
              <HiInformationCircle className={styles.guideIcon} />
              <div className={styles.guideTitle}>{t('calculate.selectVillageFirst')}</div>
              <div className={styles.guideText}>
                {language === 'en'
                  ? 'Select a village or mohalla from the list on the left to configure property parameters and calculate valuation.'
                  : 'बाईं ओर दी गई सूची से ग्राम/मोहल्ला चुनें जिससे दर सूची के अनुसार सर्किल दर लोड हो सके।'}
              </div>
            </div>
          )}
        </div>

        {form.state.village && (
          <div className={styles.bottomActions}>
            <Button onClick={handleCalculate} className={styles.calcBtn}>
              <HiCalculator className={styles.calcIcon} />
              <span>{t('calculate.button')}</span>
              <HiArrowRight />
            </Button>

            {form.result && !isResultModalOpen && (
              <button
                type="button"
                className={styles.viewResultBtn}
                onClick={() => setIsResultModalOpen(true)}
              >
                <HiEye />
                <span>
                  {t('result.viewResult')} — {formatINR(form.result.total)}
                </span>
              </button>
            )}
          </div>
        )}

        {form.result && (
          <ResultModal
            isOpen={isResultModalOpen}
            onClose={() => setIsResultModalOpen(false)}
            sections={form.result.sections}
            total={form.result.total}
          />
        )}

        <AppFooter />
      </div>
    </div>
  );
}

