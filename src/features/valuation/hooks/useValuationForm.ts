import { useCallback, useMemo, useState } from 'react';
import { findSegmentsForVillage } from '../../../data/villages';
import { calculateValuation } from '../services/valuationService';
import { getRequiredFields, isPositiveNumber } from '../utils/validation';
import type {
  AgriBonuses,
  AgriTypeKey,
  AgriUnit,
  AssetsInput,
  BoundaryConditions,
  BuildClass,
  BuildFloorTier,
  BuildType,
  CommercialType,
  ConstructionDraft,
  PropertyType,
  ResidentialMode,
  RoadWidthKey,
  SegmentRate,
  TreeEntry,
  Village,
  ValuationInput,
  ValuationResult,
} from '../types';

let nextTreeId = 1;

function initialState() {
  return {
    village: null as Village | null,
    segment: null as SegmentRate | null,
    propertyType: 'res' as PropertyType,
    boundary: { multiRoad: false, park: false } as BoundaryConditions,

    residentialMode: 'plot' as ResidentialMode,
    roadWidth: 'rate_basic_0_3m' as RoadWidthKey,
    area: null as number | null,
    flatCarpetArea: null as number | null,
    flatSuperArea: null as number | null,
    floorTotalFloors: 2 as 2 | 3,
    floorWhich: 1 as 1 | 2 | 3 | 4 | 5 | 6,

    commercialType: 'shop' as CommercialType,
    commercialArea: null as number | null,
    commercialFloorDiscountPct: 0 as 0 | 10 | 15 | 20 | 35,

    industrialArea: null as number | null,

    agriType: 'agri_general' as AgriTypeKey,
    agriUnit: 'ha' as AgriUnit,
    agriArea: null as number | null,
    agriBonuses: { segmentRoad: false, ringRoad: false, aabadiProximity: false } as AgriBonuses,

    construction: {
      included: false,
      buildType: 'rcc' as BuildType,
      buildClass: 0 as BuildClass,
      buildFloorTier: 3 as BuildFloorTier,
      coveredArea: null as number | null,
    } as ConstructionDraft,
    trees: [] as TreeEntry[],
    assets: { borewellCount: 0, kuanCount: 0 } as AssetsInput,
  };
}

export function useValuationForm() {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ValuationResult | null>(null);

  const availableSegments = useMemo(
    () => (state.village ? findSegmentsForVillage(state.village.name) : []),
    [state.village],
  );

  const selectVillage = useCallback((village: Village) => {
    setState((prev) => ({ ...initialState(), village, propertyType: prev.propertyType }));
    setResult(null);
    setErrors({});
  }, []);

  const selectSegment = useCallback((segment: SegmentRate | null) => {
    setState((prev) => ({ ...prev, segment }));
  }, []);

  const setPropertyType = useCallback((propertyType: PropertyType) => {
    setState((prev) => ({ ...prev, propertyType }));
    setResult(null);
  }, []);

  const setResidentialMode = useCallback((residentialMode: ResidentialMode) => {
    setState((prev) => ({ ...prev, residentialMode }));
  }, []);

  const setBoundary = useCallback((boundary: Partial<BoundaryConditions>) => {
    setState((prev) => ({ ...prev, boundary: { ...prev.boundary, ...boundary } }));
  }, []);

  const setField = useCallback(
    <K extends keyof ReturnType<typeof initialState>>(key: K, value: ReturnType<typeof initialState>[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    },
    [],
  );

  const setConstruction = useCallback((patch: Partial<ConstructionDraft>) => {
    setState((prev) => ({ ...prev, construction: { ...prev.construction, ...patch } }));
  }, []);

  const setAssets = useCallback((patch: Partial<AssetsInput>) => {
    setState((prev) => ({ ...prev, assets: { ...prev.assets, ...patch } }));
  }, []);

  const addTree = useCallback(() => {
    setState((prev) => ({
      ...prev,
      trees: [...prev.trees, { id: nextTreeId++, type: 'faldar', age: '5', qty: 1 }],
    }));
  }, []);

  const updateTree = useCallback((id: number, patch: Partial<TreeEntry>) => {
    setState((prev) => ({
      ...prev,
      trees: prev.trees.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const removeTree = useCallback((id: number) => {
    setState((prev) => ({ ...prev, trees: prev.trees.filter((t) => t.id !== id) }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState());
    setResult(null);
    setErrors({});
  }, []);

  /** Build the fully-typed calculation input from current state, or null if a village hasn't been picked yet. */
  const buildInput = useCallback((): ValuationInput | null => {
    if (!state.village) return null;
    return {
      village: state.village,
      segment: state.segment,
      propertyType: state.propertyType,
      boundary: state.boundary,
      residentialMode: state.residentialMode,
      roadWidth: state.roadWidth,
      area: state.area ?? 0,
      flatCarpetArea: state.flatCarpetArea ?? 0,
      flatSuperArea: state.flatSuperArea,
      floorTotalFloors: state.floorTotalFloors,
      floorWhich: state.floorWhich,
      commercialType: state.commercialType,
      commercialArea: state.commercialArea ?? 0,
      commercialFloorDiscountPct: state.commercialFloorDiscountPct,
      industrialArea: state.industrialArea ?? 0,
      agriType: state.agriType,
      agriUnit: state.agriUnit,
      agriArea: state.agriArea ?? 0,
      agriBonuses: state.agriBonuses,
      construction: {
        included: state.construction.included,
        buildType: state.construction.buildType,
        buildClass: state.construction.buildClass,
        buildFloorTier: state.construction.buildFloorTier,
        coveredArea: state.construction.coveredArea ?? 0,
      },
      trees: state.trees,
      assets: state.assets,
    };
  }, [state]);

  /** Validate the current step and, if valid, run the calculation. Returns the id of the first invalid field, if any. */
  const calculate = useCallback((): { firstErrorId: string | null } => {
    const required = getRequiredFields(!!state.village, state.propertyType, state.residentialMode);
    const newErrors: Record<string, string> = {};
    const areaByField: Record<string, number | null> = {
      resArea: state.area,
      flatCarpet: state.flatCarpetArea,
      floorArea: state.area,
      commArea: state.commercialArea,
      industArea: state.industrialArea,
      agriArea: state.agriArea,
    };

    let firstErrorId: string | null = null;
    for (const field of required) {
      const isVillageField = field.id === 'villageSearch';
      const invalid = isVillageField ? !state.village : !isPositiveNumber(areaByField[field.id]);
      if (invalid) {
        newErrors[field.id] = field.messageKey;
        if (!firstErrorId) firstErrorId = field.id;
      }
    }

    setErrors(newErrors);
    if (firstErrorId) {
      setResult(null);
      return { firstErrorId };
    }

    const input = buildInput();
    if (!input) return { firstErrorId: 'villageSearch' };
    setResult(calculateValuation(input));
    return { firstErrorId: null };
  }, [state, buildInput]);

  return {
    state,
    errors,
    result,
    availableSegments,
    selectVillage,
    selectSegment,
    setPropertyType,
    setResidentialMode,
    setBoundary,
    setField,
    setConstruction,
    setAssets,
    addTree,
    updateTree,
    removeTree,
    calculate,
    reset,
  };
}

export type UseValuationForm = ReturnType<typeof useValuationForm>;
